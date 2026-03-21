import { Router, Response } from 'express';
import mongoose from 'mongoose';
import { AuthRequest } from '../../middleware/auth.middleware';
import { sanitizeBody } from '../../middleware/validate.middleware';
import { adminUploadSingleImage } from '../../middleware/admin-upload.middleware';
import * as homeService from '../../services/home.service';
import * as storageService from '../../services/storage.service';
import { logActivity } from '../../services/activity-log.service';
import { optimizeImageForProfile } from '../../utils/image-processor';

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
    const { mode, target, single, slides } = req.body;

    if (!mode || !['single', 'carousel'].includes(mode)) {
      res.status(400).json({ error: 'mode must be "single" or "carousel"' });
      return;
    }

    const saveTarget = target || mode;

    // Validate slide fields helper
    function validateSlide(s: any, label: string): string | null {
      if (!s.tag?.es || !s.tag?.en) return `${label}: tag is required (ES and EN)`;
      if (!s.headline?.es || !s.headline?.en) return `${label}: headline is required (ES and EN)`;
      if (!s.ctaText?.es || !s.ctaText?.en) return `${label}: CTA text is required (ES and EN)`;
      if (!s.ctaLink) return `${label}: CTA link is required`;
      if (s.tagsEs && s.tagsEs.length > 6) return `${label}: maximum 6 Spanish tags`;
      if (s.tagsEn && s.tagsEn.length > 6) return `${label}: maximum 6 English tags`;
      if (s.product && !mongoose.isValidObjectId(s.product)) return `${label}: invalid product ID`;
      return null;
    }

    if (saveTarget === 'single') {
      if (!single) {
        res.status(400).json({ error: 'single slide data is required' });
        return;
      }
      const err = validateSlide(single, 'Portada');
      if (err) { res.status(400).json({ error: err }); return; }
    }

    if (saveTarget === 'carousel') {
      if (!Array.isArray(slides) || slides.length === 0) {
        res.status(400).json({ error: 'At least one slide is required' });
        return;
      }
      if (slides.length > 4) {
        res.status(400).json({ error: 'Maximum 4 slides allowed' });
        return;
      }
      for (let i = 0; i < slides.length; i++) {
        const err = validateSlide(slides[i], `Slide ${i + 1}`);
        if (err) { res.status(400).json({ error: err }); return; }
      }
    }

    const config = await homeService.updateHero({ mode, target: saveTarget as any, single, slides });
    if (!config) {
      res.status(500).json({ error: 'Failed to update hero' });
      return;
    }

    await logActivity({
      action: 'update',
      entity: 'content',
      entityName: 'Hero del Home',
      user: req.user?.email,
      details: `${mode}, target: ${saveTarget}`,
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

    const slideIndex = parseInt(req.body.slideIndex || '0', 10);
    const imageType = req.body.imageType as 'desktop' | 'mobile';
    const target = (req.body.target || 'carousel') as 'single' | 'carousel';

    if (!imageType || !['desktop', 'mobile'].includes(imageType)) {
      res.status(400).json({ error: 'imageType must be "desktop" or "mobile"' });
      return;
    }

    const current = await homeService.getHomeConfig();
    let previousImageUrl: string | undefined;
    if (target === 'single' && current.hero?.single) {
      previousImageUrl = imageType === 'desktop' ? current.hero.single.imageDesktop : current.hero.single.imageMobile;
    } else if (target === 'carousel') {
      const currentSlide = current.hero?.slides?.[slideIndex];
      if (currentSlide) {
        previousImageUrl = imageType === 'desktop' ? currentSlide.imageDesktop : currentSlide.imageMobile;
      }
    }

    const processed = await optimizeImageForProfile(
      file.buffer,
      imageType === 'desktop' ? 'home-hero-desktop' : 'home-hero-mobile'
    );
    const imageUrl = await storageService.uploadImage(processed.buffer, processed.contentType, 'home');

    const config = await homeService.updateSlideImage(target, slideIndex, imageType, imageUrl);
    if (previousImageUrl && previousImageUrl !== imageUrl) {
      await storageService.deleteBlob(previousImageUrl).catch(() => {});
    }

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
