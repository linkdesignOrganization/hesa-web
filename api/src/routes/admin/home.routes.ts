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

/** Validate that every element in an array is a valid ObjectId string. */
function validateIdArray(ids: unknown): ids is string[] {
  return Array.isArray(ids) && ids.every(id => typeof id === 'string' && mongoose.isValidObjectId(id));
}

/**
 * GET /api/admin/home
 * Get full home config for admin editing.
 * REQ-275 to REQ-283
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
 * Update hero text fields.
 * REQ-275 to REQ-277
 */
router.put('/hero', sanitizeBody, async (req: AuthRequest, res: Response) => {
  try {
    const config = await homeService.updateHero(req.body);
    if (!config) {
      res.status(500).json({ error: 'Failed to update hero' });
      return;
    }

    await logActivity({
      action: 'update',
      entity: 'content',
      entityName: 'Hero del Home',
      user: req.user?.email,
    });

    res.json(config);
  } catch (error) {
    console.error('Error updating hero:', error);
    res.status(500).json({ error: 'Failed to update hero' });
  }
});

/**
 * POST /api/admin/home/hero/image
 * Upload hero background image.
 * REQ-048
 */
router.post('/hero/image', adminUploadSingleImage.single('image'), async (req: AuthRequest, res: Response) => {
  try {
    const file = req.file;
    if (!file) {
      res.status(400).json({ error: 'No image provided' });
      return;
    }

    // Delete old hero image
    const current = await homeService.getHomeConfig();
    if (current.hero.image) {
      await storageService.deleteBlob(current.hero.image);
    }

    const processed = await processImageSingle(file.buffer, 1920);
    const imageUrl = await storageService.uploadImage(processed.buffer, processed.contentType, 'home');

    const config = await homeService.updateHero({ image: imageUrl });

    await logActivity({
      action: 'update',
      entity: 'content',
      entityName: 'Imagen del Hero',
      user: req.user?.email,
    });

    res.json(config);
  } catch (error) {
    console.error('Error uploading hero image:', error);
    res.status(500).json({ error: 'Failed to upload hero image' });
  }
});

/**
 * PUT /api/admin/home/featured-products
 * Update featured products list (array of product IDs in order).
 * REQ-278 to REQ-281
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
 * Update featured brands list (array of brand IDs in order).
 * REQ-282 to REQ-283
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
