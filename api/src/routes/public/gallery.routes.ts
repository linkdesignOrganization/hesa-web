import { Router, Request, Response } from 'express';
import * as galleryService from '../../services/gallery.service';

const router = Router();

/**
 * GET /api/public/gallery
 * Public gallery listing, newest first.
 */
router.get('/', async (_req: Request, res: Response) => {
  try {
    const items = await galleryService.getGalleryItems();
    res.json(items);
  } catch (error) {
    console.error('Error fetching gallery:', error);
    res.status(500).json({ error: 'Failed to fetch gallery items' });
  }
});

export default router;
