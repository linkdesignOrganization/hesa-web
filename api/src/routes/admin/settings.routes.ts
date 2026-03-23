import { Router, Request, Response } from 'express';
import {
  getAllConfig,
  getConfigByKey,
  updateConfig,
} from '../../services/site-config.service';
import { logActivity } from '../../services/activity-log.service';
import { deleteBlob, uploadImage } from '../../services/storage.service';
import { AuthRequest } from '../../middleware/auth.middleware';
import { sanitizeBody } from '../../middleware/validate.middleware';
import { adminUploadSingleImage } from '../../middleware/admin-upload.middleware';
import { optimizeImageForProfile } from '../../utils/image-processor';

/** Allowed fields per config key to prevent arbitrary field injection */
const ALLOWED_FIELDS: Record<string, string[]> = {
  general: ['siteName', 'logoUrl', 'ga4Id', 'ga4Enabled', 'fbPixelId', 'fbPixelEnabled'],
  contacto: ['phone', 'email', 'address', 'hours', 'whatsapp'],
  redes: ['facebook', 'instagram', 'linkedin', 'youtube'],
  seo: ['metaTitle', 'metaDescription', 'ogImage'],
};

function filterAllowedFields(key: string, data: Record<string, unknown>): Record<string, unknown> {
  const allowed = ALLOWED_FIELDS[key];
  if (!allowed) return {};
  const filtered: Record<string, unknown> = {};
  for (const field of allowed) {
    if (field in data) {
      filtered[field] = data[field];
    }
  }
  return filtered;
}

const router = Router();
/**
 * GET /api/admin/settings
 * REQ-303 to REQ-307: Get all site configuration
 */
router.get('/', async (_req: Request, res: Response) => {
  try {
    const config = await getAllConfig();
    res.json(config);
  } catch (error) {
    console.error('Error fetching settings:', error);
    res.status(500).json({ error: 'Failed to fetch settings' });
  }
});

/**
 * GET /api/admin/settings/:key
 * Get config by key (general | contacto | redes | seo)
 */
router.get('/:key', async (req: Request, res: Response) => {
  try {
    const validKeys = ['general', 'contacto', 'redes', 'seo'];
    if (!validKeys.includes(req.params.key)) {
      res.status(400).json({ error: 'Invalid config key. Must be: general, contacto, redes, or seo' });
      return;
    }
    const config = await getConfigByKey(req.params.key);
    if (!config) {
      res.status(404).json({ error: 'Config not found' });
      return;
    }
    res.json(config);
  } catch (error) {
    console.error('Error fetching config:', error);
    res.status(500).json({ error: 'Failed to fetch config' });
  }
});

/**
 * PUT /api/admin/settings/:key
 * REQ-307: Update config by key
 */
router.put('/:key', sanitizeBody, async (req: Request, res: Response) => {
  try {
    const validKeys = ['general', 'contacto', 'redes', 'seo'];
    if (!validKeys.includes(req.params.key)) {
      res.status(400).json({ error: 'Invalid config key' });
      return;
    }

    // Filter to only allowed fields for this config key (prevents arbitrary field injection)
    const safeData = filterAllowedFields(req.params.key, req.body);

    // Validate GA4/FB Pixel IDs format if present (prevent XSS via script injection)
    if (req.params.key === 'general') {
      if (safeData.ga4Id && typeof safeData.ga4Id === 'string') {
        // GA4 IDs must match G-XXXXXXXXXX pattern
        if (!/^G-[A-Z0-9]{1,15}$/.test(safeData.ga4Id) && safeData.ga4Id !== '') {
          res.status(400).json({ error: 'Invalid GA4 Measurement ID format (must be G-XXXXXXXXXX)' });
          return;
        }
      }
      if (safeData.fbPixelId && typeof safeData.fbPixelId === 'string') {
        // FB Pixel IDs must be numeric only
        if (!/^\d{1,20}$/.test(safeData.fbPixelId) && safeData.fbPixelId !== '') {
          res.status(400).json({ error: 'Invalid Facebook Pixel ID format (must be numeric)' });
          return;
        }
      }
    }

    const updated = await updateConfig(req.params.key, safeData);

    const authReq = req as AuthRequest;
    logActivity({
      action: 'update',
      entity: 'settings',
      entityName: `Settings: ${req.params.key}`,
      user: authReq.user?.email,
      details: `Updated ${req.params.key} settings`,
    }).catch(() => {});

    res.json(updated);
  } catch (error) {
    console.error('Error updating config:', error);
    res.status(500).json({ error: 'Failed to update settings' });
  }
});

/**
 * POST /api/admin/settings/logo
 * Upload site logo
 */
router.post('/logo', adminUploadSingleImage.single('image'), async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      res.status(400).json({ error: 'No image file provided' });
      return;
    }

    const current = await getConfigByKey('general');
    const previousLogoUrl = current?.logoUrl;
    const optimized = await optimizeImageForProfile(req.file.buffer, 'site-logo');

    const url = await uploadImage(optimized.buffer, optimized.contentType, 'site');
    await updateConfig('general', { logoUrl: url });
    if (previousLogoUrl && previousLogoUrl !== url) {
      await deleteBlob(previousLogoUrl);
    }

    res.json({ logoUrl: url });
  } catch (error) {
    console.error('Error uploading logo:', error);
    res.status(500).json({ error: 'Failed to upload logo' });
  }
});

/**
 * POST /api/admin/settings/og-image
 * Upload OG image for social sharing
 */
router.post('/og-image', adminUploadSingleImage.single('image'), async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      res.status(400).json({ error: 'No image file provided' });
      return;
    }

    const current = await getConfigByKey('seo');
    const previousOgImage = current?.ogImage;
    const optimized = await optimizeImageForProfile(req.file.buffer, 'og-image');

    const url = await uploadImage(optimized.buffer, optimized.contentType, 'site');
    await updateConfig('seo', { ogImage: url });
    if (previousOgImage && previousOgImage !== url) {
      await deleteBlob(previousOgImage);
    }

    res.json({ ogImage: url });
  } catch (error) {
    console.error('Error uploading OG image:', error);
    res.status(500).json({ error: 'Failed to upload OG image' });
  }
});

export default router;
