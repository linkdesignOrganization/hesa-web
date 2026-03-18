import { Request, Response, NextFunction } from 'express';

/**
 * Sets security headers on all responses.
 * NFR-020: Content-Security-Policy, X-Frame-Options, X-Content-Type-Options
 */
export function securityHeaders(_req: Request, res: Response, next: NextFunction): void {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader(
    'Permissions-Policy',
    'camera=(), microphone=(), geolocation=()'
  );
  // NFR-020: Content-Security-Policy for the API
  res.setHeader(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https: blob:; connect-src 'self' https://login.microsoftonline.com https://*.blob.core.windows.net; frame-ancestors 'none'"
  );
  next();
}
