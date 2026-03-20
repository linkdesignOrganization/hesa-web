import { Router, Response } from 'express';
import mongoose from 'mongoose';
import { AuthRequest } from '../../middleware/auth.middleware';
import { sanitizeBody } from '../../middleware/validate.middleware';
import { adminUploadSingleImage } from '../../middleware/admin-upload.middleware';
import * as homeService from '../../services/home.service';
import * as storageService from '../../services/storage.service';
import { logActivity } from '../../services/activity-log.service';
import { processImageSingle } from '../../utils/image-processor';

const router = Router();

function validateIdArray(ids: unknown): ids is string[] {
  return Array.isArray(ids) && ids.every(id => typeof id === 'string' && mongoose.isValidObjectId(id));
}

/**
 * GET /api/admin/home
 */
router.get('/', async (_req: AuthRequest, res: Response) => {
  try {
    const config = await homeService.getHomeConfig();
    res.json(config);
  } catch (error) {
    console.error('Error fetching home config:', error);
    res.status(500).json({ error: 'Failed to fetch home configuration' });
  }
});

/**
 * PUT /api/admin/home/hero
 * Update hero: mode + slides array.
 */
router.put('/hero', sanitizeBody, async (req: AuthRequest, res: Response) => {
  try {
    const { mode, slides } = req.body;

    if (!mode || !['single', 'carousel'].includes(mode)) {
      res.status(400).json({ error: 'mode must be "single" or "carousel"' });
      return;
    }

    if (!Array.isArray(slides) || slides.length === 0) {
      res.status(400).json({ error: 'At least one slide is required' });
      return;
    }

    if (mode === 'single' && slides.length > 1) {
      res.status(400).json({ error: 'Single mode allows only 1 slide' });
      return;
    }

    if (slides.length > 4) {
      res.status(400).json({ error: 'Maximum 4 slides allowed' });
      return;
    }

    // Validate required fields per slide
    for (let i = 0; i < slides.length; i++) {
      const s = slides[i];
      if (!s.tag?.es || !s.tag?.en) {
        res.status(400).json({ error: `Slide ${i + 1}: tag is required (ES and EN)` });
        return;
      }
      if (!s.headline?.es || !s.headline?.en) {
        res.status(400).json({ error: `Slide ${i + 1}: headline is required (ES and EN)` });
        return;
      }
      if (!s.ctaText?.es || !s.ctaText?.en) {
        res.status(400).json({ error: `Slide ${i + 1}: CTA text is required (ES and EN)` });
        return;
      }
      if (!s.ctaLink) {
        res.status(400).json({ error: `Slide ${i + 1}: CTA link is required` });
        return;
      }
      if (s.tagsEs && s.tagsEs.length > 6) {
        res.status(400).json({ error: `Slide ${i + 1}: maximum 6 Spanish tags allowed` });
        return;
      }
      if (s.tagsEn && s.tagsEn.length > 6) {
        res.status(400).json({ error: `Slide ${i + 1}: maximum 6 English tags allowed` });
        return;
      }
      // Validate product ID if provided
      if (s.product && !mongoose.isValidObjectId(s.product)) {
        res.status(400).json({ error: `Slide ${i + 1}: invalid product ID` });
        return;
      }
    }

    const config = await homeService.updateHero({ mode, slides });
    if (!config) {
      res.status(500).json({ error: 'Failed to update hero' });
      return;
    }

    await logActivity({
      action: 'update',
      entity: 'content',
      entityName: 'Hero del Home',
      user: req.user?.email,
      details: `${mode}, ${slides.length} slide(s)`,
    });

    res.json(config);
  } catch (error) {
    console.error('Error updating hero:', error);
    res.status(500).json({ error: 'Failed to update hero' });
  }
});

/**
 * POST /api/admin/home/hero/image
 * Upload hero slide image (desktop or mobile).
 * Body params: slideIndex (number), imageType ('desktop' | 'mobile')
 */
router.post('/hero/image', adminUploadSingleImage.single('image'), async (req: AuthRequest, res: Response) => {
  try {
    const file = req.file;
    if (!file) {
      res.status(400).json({ error: 'No image provided' });
      return;
    }

    const slideIndex = parseInt(req.body.slideIndex, 10);
    const imageType = req.body.imageType as 'desktop' | 'mobile';

    if (isNaN(slideIndex) || slideIndex < 0 || slideIndex > 3) {
      res.status(400).json({ error: 'Invalid slide index (0-3)' });
      return;
    }
    if (!imageType || !['desktop', 'mobile'].includes(imageType)) {
      res.status(400).json({ error: 'imageType must be "desktop" or "mobile"' });
      return;
    }

    // Delete old image if exists
    const current = await homeService.getHomeConfig();
    const currentSlide = current.hero?.slides?.[slideIndex];
    if (currentSlide) {
      const oldUrl = imageType === 'desktop' ? currentSlide.imageDesktop : currentSlide.imageMobile;
      if (oldUrl) {
        await storageService.deleteBlob(oldUrl).catch(() => {});
      }
    }

    const processed = await processImageSingle(file.buffer, 1920);
    const imageUrl = await storageService.uploadImage(processed.buffer, processed.contentType, 'home');

    const config = await homeService.updateSlideImage(slideIndex, imageType, imageUrl);

    await logActivity({
      action: 'update',
      entity: 'content',
      entityName: `Hero Slide ${slideIndex + 1} (${imageType})`,
      user: req.user?.email,
    });

    res.json(config);
  } catch (error) {
    console.error('Error uploading hero slide image:', error);
    res.status(500).json({ error: 'Failed to upload hero slide image' });
  }
});

/**
 * PUT /api/admin/home/featured-products
 */
router.put('/featured-products', sanitizeBody, async (req: AuthRequest, res: Response) => {
  try {
    const { productIds } = req.body;
    if (!validateIdArray(productIds)) {
      res.status(400).json({ error: 'productIds must be an array of valid IDs' });
      return;
    }

    const config = await homeService.updateFeaturedProducts(productIds);

    await logActivity({
      action: 'update',
      entity: 'content',
      entityName: 'Productos Destacados',
      user: req.user?.email,
      details: `${productIds.length} productos`,
    });

    res.json(config);
  } catch (error) {
    console.error('Error updating featured products:', error);
    res.status(500).json({ error: 'Failed to update featured products' });
  }
});

/**
 * PUT /api/admin/home/featured-brands
 */
router.put('/featured-brands', sanitizeBody, async (req: AuthRequest, res: Response) => {
  try {
    const { brandIds } = req.body;
    if (!validateIdArray(brandIds)) {
      res.status(400).json({ error: 'brandIds must be an array of valid IDs' });
      return;
    }

    const config = await homeService.updateFeaturedBrands(brandIds);

    await logActivity({
      action: 'update',
      entity: 'content',
      entityName: 'Marcas Destacadas',
      user: req.user?.email,
      details: `${brandIds.length} marcas`,
    });

    res.json(config);
  } catch (error) {
    console.error('Error updating featured brands:', error);
    res.status(500).json({ error: 'Failed to update featured brands' });
  }
});

export default router;
