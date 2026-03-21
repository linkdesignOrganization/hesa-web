import { Router, Response } from 'express';
import { AuthRequest } from '../../middleware/auth.middleware';
import { sanitizeBody } from '../../middleware/validate.middleware';
import { adminUploadSingleImage } from '../../middleware/admin-upload.middleware';
import * as contentService from '../../services/content.service';
import * as storageService from '../../services/storage.service';
import { logActivity } from '../../services/activity-log.service';
import { optimizeImageForProfile } from '../../utils/image-processor';

const router = Router();

/**
 * GET /api/admin/content
 * Get all page contents for admin.
 * REQ-284
 */
router.get('/', async (_req: AuthRequest, res: Response) => {
  try {
    const contents = await contentService.getAllPageContents();
    res.json(contents);
  } catch (error) {
    console.error('Error fetching contents:', error);
    res.status(500).json({ error: 'Failed to fetch page contents' });
  }
});

/**
 * GET /api/admin/content/:pageKey
 * Get content for a specific page.
 */
router.get('/:pageKey', async (req: AuthRequest, res: Response) => {
  try {
    const pageKey = req.params.pageKey.substring(0, 50);
    const validPages = ['nosotros', 'distribuidores', 'contacto', 'politicas'];
    if (!validPages.includes(pageKey)) {
      res.status(404).json({ error: 'Page not found' });
      return;
    }
    const content = await contentService.getPageContent(pageKey);
    res.json(content);
  } catch (error) {
    console.error('Error fetching content:', error);
    res.status(500).json({ error: 'Failed to fetch page content' });
  }
});

/**
 * PUT /api/admin/content/:pageKey
 * Update page sections.
 * REQ-285 to REQ-287
 */
router.put('/:pageKey', sanitizeBody, async (req: AuthRequest, res: Response) => {
  try {
    const pageKey = req.params.pageKey.substring(0, 50);
    const validPages = ['nosotros', 'distribuidores', 'contacto', 'politicas'];
    if (!validPages.includes(pageKey)) {
      res.status(404).json({ error: 'Page not found' });
      return;
    }

    const { sections, heroImage } = req.body;

    if (!Array.isArray(sections)) {
      res.status(400).json({ error: 'sections must be an array' });
      return;
    }

    const content = await contentService.updatePageContent(pageKey, sections, heroImage);

    const pageLabels: Record<string, string> = {
      nosotros: 'Nosotros',
      distribuidores: 'Distribuidores',
      contacto: 'Contacto',
      politicas: 'Politicas Comerciales',
    };

    await logActivity({
      action: 'update',
      entity: 'content',
      entityName: pageLabels[pageKey] || pageKey,
      user: req.user?.email,
    });

    res.json(content);
  } catch (error) {
    console.error('Error updating content:', error);
    res.status(500).json({ error: 'Failed to update page content' });
  }
});

/**
 * POST /api/admin/content/:pageKey/image
 * Upload hero image for a static page.
 * REQ-288
 */
router.post('/:pageKey/image', adminUploadSingleImage.single('image'), async (req: AuthRequest, res: Response) => {
  try {
    const pageKey = req.params.pageKey.substring(0, 50);
    const validPages = ['nosotros', 'distribuidores', 'contacto', 'politicas'];
    if (!validPages.includes(pageKey)) {
      res.status(404).json({ error: 'Page not found' });
      return;
    }
    const file = req.file;
    if (!file) {
      res.status(400).json({ error: 'No image provided' });
      return;
    }

    const current = await contentService.getPageContent(pageKey);
    const previousHeroImage = current.heroImage;

    const processed = await optimizeImageForProfile(file.buffer, 'content-hero');
    const imageUrl = await storageService.uploadImage(processed.buffer, processed.contentType, `content/${pageKey}`);

    const content = await contentService.updatePageHeroImage(pageKey, imageUrl);
    if (previousHeroImage && previousHeroImage !== imageUrl) {
      await storageService.deleteBlob(previousHeroImage).catch(() => {});
    }

    await logActivity({
      action: 'update',
      entity: 'content',
      entityName: `Imagen de ${pageKey}`,
      user: req.user?.email,
    });

    res.json(content);
  } catch (error) {
    console.error('Error uploading content image:', error);
    res.status(500).json({ error: 'Failed to upload image' });
  }
});

export default router;
