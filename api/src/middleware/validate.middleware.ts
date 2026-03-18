import { Request, Response, NextFunction } from 'express';

/**
 * Sanitize string fields to prevent XSS injection.
 * Strips all HTML tags, script content, event handlers,
 * null bytes, and encoded JavaScript URIs.
 */
function sanitizeString(value: string): string {
  return value
    // eslint-disable-next-line no-control-regex
    .replace(/\x00/g, '')
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/on\w+\s*=\s*["'][^"']*["']/gi, '')
    .replace(/<[^>]*>/g, '')
    .replace(/javascript\s*:/gi, '')
    .replace(/data\s*:\s*text\/html/gi, '')
    .replace(/vbscript\s*:/gi, '')
    .trim();
}

/**
 * Strip keys starting with '$' to prevent NoSQL operator injection.
 * Also recursively sanitizes string values against XSS.
 */
function sanitizeObject(obj: Record<string, unknown>): Record<string, unknown> {
  const sanitized: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(obj)) {
    // Block MongoDB operators (e.g. $gt, $ne, $regex, $where)
    if (key.startsWith('$')) continue;

    if (typeof value === 'string') {
      sanitized[key] = sanitizeString(value);
    } else if (Array.isArray(value)) {
      sanitized[key] = sanitizeArray(value);
    } else if (typeof value === 'object' && value !== null) {
      sanitized[key] = sanitizeObject(value as Record<string, unknown>);
    } else {
      sanitized[key] = value;
    }
  }
  return sanitized;
}

function sanitizeArray(arr: unknown[]): unknown[] {
  return arr.map((item) => {
    if (typeof item === 'string') return sanitizeString(item);
    if (typeof item === 'object' && item !== null) {
      return sanitizeObject(item as Record<string, unknown>);
    }
    return item;
  });
}

/**
 * Middleware that sanitizes request body against XSS and NoSQL injection.
 */
export function sanitizeBody(req: Request, _res: Response, next: NextFunction): void {
  if (req.body && typeof req.body === 'object') {
    req.body = sanitizeObject(req.body);
  }
  next();
}

/**
 * Creates a validation middleware that checks required fields.
 */
export function requireFields(...fields: string[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const missing: string[] = [];
    for (const field of fields) {
      const value = req.body[field];
      if (value === undefined || value === null || value === '') {
        missing.push(field);
      }
    }
    if (missing.length > 0) {
      res.status(400).json({
        error: 'Validation failed',
        details: missing.map((f) => ({ field: f, message: `${f} is required` })),
      });
      return;
    }
    next();
  };
}
