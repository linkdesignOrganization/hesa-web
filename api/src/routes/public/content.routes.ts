import { Router, Request, Response } from 'express';
import * as contentService from '../../services/content.service';

const router = Router();

/**
 * GET /api/public/content/:pageKey
 * Public page content for static pages.
 * REQ-155 to REQ-196
 */
router.get('/:pageKey', async (req: Request, res: Response) => {
  try {
    const pageKey = req.params.pageKey.substring(0, 50);
    const validPages = ['distribuidores', 'contacto'];
    if (!validPages.includes(pageKey)) {
      res.status(404).json({ error: 'Page not found' });
      return;
    }

    const content = await contentService.getPageContent(pageKey);
    res.json(content);
  } catch (error) {
    console.error('Error fetching page content:', error);
    res.status(500).json({ error: 'Failed to fetch page content' });
  }
});

export default router;
