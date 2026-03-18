import { Router, Request, Response } from 'express';
import { createMessage } from '../../services/message.service';
import { sendContactNotification } from '../../services/email.service';
import { logActivity } from '../../services/activity-log.service';
import { sanitizeBody } from '../../middleware/validate.middleware';
import { rateLimit } from '../../middleware/rate-limit.middleware';

const router = Router();

// NFR-016: Honeypot anti-spam + rate limiting
const recentSubmissions = new Map<string, number>();
const RATE_LIMIT_MS = 30000; // 30 seconds

function getClientIp(req: Request): string {
  return (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() || req.ip || 'unknown';
}

function isRateLimited(ip: string): boolean {
  const lastSubmit = recentSubmissions.get(ip);
  if (lastSubmit && Date.now() - lastSubmit < RATE_LIMIT_MS) {
    return true;
  }
  recentSubmissions.set(ip, Date.now());
  // Cleanup old entries periodically
  if (recentSubmissions.size > 10000) {
    const now = Date.now();
    for (const [key, time] of recentSubmissions.entries()) {
      if (now - time > RATE_LIMIT_MS * 2) recentSubmissions.delete(key);
    }
  }
  return false;
}

// NFR-017: Input sanitization
function sanitize(value: unknown): string {
  if (typeof value !== 'string') return '';
  // Remove control characters except newlines/tabs
  // eslint-disable-next-line no-control-regex
  return value.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '').trim();
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^[+]?[\d\s\-()]{7,20}$/;

/**
 * POST /api/public/contact/general
 * REQ-197 to REQ-205: General contact form submission
 */
router.post('/general', sanitizeBody, rateLimit(5, 60000), async (req: Request, res: Response) => {
  try {
    // NFR-016: Honeypot check
    if (req.body.website) {
      // Bot detected, silently accept
      res.json({ success: true });
      return;
    }

    // Rate limiting
    if (isRateLimited(getClientIp(req))) {
      res.status(429).json({ error: 'Too many requests. Please wait before submitting again.' });
      return;
    }

    // Sanitize inputs
    const name = sanitize(req.body.name);
    const email = sanitize(req.body.email);
    const phone = sanitize(req.body.phone);
    const consultationType = sanitize(req.body.consultationType);
    const productOfInterest = sanitize(req.body.productOfInterest);
    const message = sanitize(req.body.message);

    // Validate required fields
    const errors: Record<string, string> = {};
    if (!name || name.length > 100) errors.name = 'Name is required (max 100 chars)';
    if (!email || !EMAIL_REGEX.test(email) || email.length > 254) errors.email = 'Valid email is required';
    if (!consultationType || !['info', 'comercial', 'soporte', 'otro'].includes(consultationType)) {
      errors.consultationType = 'Consultation type is required';
    }
    if (!message || message.length > 2000) errors.message = 'Message is required (max 2000 chars)';
    if (phone && !PHONE_REGEX.test(phone)) errors.phone = 'Invalid phone format';

    if (Object.keys(errors).length > 0) {
      res.status(400).json({ errors });
      return;
    }

    // Create message in database
    const savedMessage = await createMessage({
      name,
      email,
      phone: phone || undefined,
      type: consultationType as 'info' | 'comercial' | 'soporte' | 'otro',
      productOfInterest: productOfInterest || undefined,
      message,
      status: 'nuevo',
      source: 'general',
    });

    // Send email notification (fire-and-forget, don't block response)
    sendContactNotification({
      source: 'general',
      name,
      email,
      phone,
      type: consultationType,
      message,
      productOfInterest,
    }).catch(err => console.error('Email notification failed:', err));

    // Log activity
    logActivity({
      action: 'create',
      entity: 'message',
      entityId: savedMessage._id?.toString(),
      entityName: name,
      details: `General contact from ${name} (${consultationType})`,
    }).catch(() => {});

    res.status(201).json({ success: true, id: savedMessage._id });
  } catch (error) {
    console.error('Error creating contact message:', error);
    res.status(500).json({ error: 'Failed to submit message' });
  }
});

/**
 * POST /api/public/contact/manufacturer
 * REQ-182 to REQ-192: Manufacturer contact form submission
 */
router.post('/manufacturer', sanitizeBody, rateLimit(5, 60000), async (req: Request, res: Response) => {
  try {
    // NFR-016: Honeypot check
    if (req.body.website) {
      res.json({ success: true });
      return;
    }

    // Rate limiting
    if (isRateLimited(getClientIp(req))) {
      res.status(429).json({ error: 'Too many requests. Please wait before submitting again.' });
      return;
    }

    // Sanitize inputs
    const companyName = sanitize(req.body.companyName);
    const country = sanitize(req.body.country);
    const contactName = sanitize(req.body.contactName);
    const contactEmail = sanitize(req.body.contactEmail);
    const contactPhone = sanitize(req.body.contactPhone);
    const productTypes = sanitize(req.body.productTypes);
    const message = sanitize(req.body.message);

    // Validate required fields
    const errors: Record<string, string> = {};
    if (!companyName || companyName.length > 200) errors.companyName = 'Company name is required (max 200 chars)';
    if (!country) errors.country = 'Country is required';
    if (!contactName || contactName.length > 100) errors.contactName = 'Contact name is required (max 100 chars)';
    if (!contactEmail || !EMAIL_REGEX.test(contactEmail) || contactEmail.length > 254) {
      errors.contactEmail = 'Valid email is required';
    }
    if (!message || message.length > 2000) errors.message = 'Message is required (max 2000 chars)';
    if (contactPhone && !PHONE_REGEX.test(contactPhone)) errors.contactPhone = 'Invalid phone format';

    if (Object.keys(errors).length > 0) {
      res.status(400).json({ errors });
      return;
    }

    // Create message in database
    const savedMessage = await createMessage({
      name: contactName,
      email: contactEmail,
      phone: contactPhone || undefined,
      type: 'fabricante',
      message,
      status: 'nuevo',
      source: 'manufacturer',
      companyName,
      country,
      contactName,
      contactEmail,
      contactPhone: contactPhone || undefined,
      productTypes: productTypes || undefined,
    });

    // Send email notification (fire-and-forget)
    sendContactNotification({
      source: 'manufacturer',
      name: contactName,
      email: contactEmail,
      phone: contactPhone,
      type: 'fabricante',
      message,
      companyName,
      country,
      contactName,
      contactEmail,
      contactPhone,
      productTypes,
    }).catch(err => console.error('Email notification failed:', err));

    // Log activity
    logActivity({
      action: 'create',
      entity: 'message',
      entityId: savedMessage._id?.toString(),
      entityName: `${companyName} (${contactName})`,
      details: `Manufacturer contact from ${companyName}, ${country}`,
    }).catch(() => {});

    res.status(201).json({ success: true, id: savedMessage._id });
  } catch (error) {
    console.error('Error creating manufacturer message:', error);
    res.status(500).json({ error: 'Failed to submit message' });
  }
});

export default router;
