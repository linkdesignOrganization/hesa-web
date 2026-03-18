import { Router, Request, Response } from 'express';
import { getPublicConfig } from '../../services/site-config.service';

const router = Router();

/**
 * GET /api/public/config
 * Returns site configuration needed by the public site:
 * phone, email, address, whatsapp, social links, SEO, analytics toggles
 */
router.get('/', async (_req: Request, res: Response) => {
  try {
    const config = await getPublicConfig();
    res.json(config);
  } catch (error) {
    console.error('Error fetching public site config:', error);
    res.status(500).json({ error: 'Failed to load site configuration' });
  }
});

export default router;
