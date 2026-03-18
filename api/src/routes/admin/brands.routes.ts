import { Router, Response } from 'express';
import { AuthRequest } from '../../middleware/auth.middleware';
import { sanitizeBody, requireFields } from '../../middleware/validate.middleware';
import * as brandService from '../../services/brand.service';
import * as storageService from '../../services/storage.service';
import { logActivity } from '../../services/activity-log.service';
import { generateSlug } from '../../utils/slug';
import { processImageSingle } from '../../utils/image-processor';
import multer from 'multer';

const router = Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024 } });

/**
 * GET /api/admin/brands
 * Admin brands listing with product counts.
 * REQ-259 to REQ-263
 */
router.get('/', async (_req: AuthRequest, res: Response) => {
  try {
    const brands = await brandService.getBrandsWithProductCount();
    res.json(brands);
  } catch (error) {
    console.error('Error fetching brands:', error);
    res.status(500).json({ error: 'Failed to fetch brands' });
  }
});

/**
 * GET /api/admin/brands/:id
 * Admin brand detail.
 */
router.get('/:id', async (req: AuthRequest, res: Response) => {
  try {
    const brand = await brandService.getBrandById(req.params.id);
    if (!brand) {
      res.status(404).json({ error: 'Brand not found' });
      return;
    }
    const productCount = await brandService.getBrandProductCount(req.params.id);
    res.json({ ...brand, productCount });
  } catch (error) {
    console.error('Error fetching brand:', error);
    res.status(500).json({ error: 'Failed to fetch brand' });
  }
});

/**
 * POST /api/admin/brands
 * Create a new brand.
 * REQ-264 to REQ-267
 */
router.post(
  '/',
  sanitizeBody,
  requireFields('name', 'country'),
  async (req: AuthRequest, res: Response) => {
    try {
      const body = req.body;
      let slug = generateSlug(body.name);

      // Ensure slug uniqueness
      let counter = 1;
      while (await brandService.getBrandBySlug(slug)) {
        slug = `${generateSlug(body.name)}-${counter}`;
        counter++;
      }

      const brand = await brandService.createBrand({
        ...body,
        slug,
      });

      await logActivity({
        action: 'create',
        entity: 'brand',
        entityId: String(brand._id),
        entityName: body.name,
        user: req.user?.email,
      });

      res.status(201).json(brand);
    } catch (error) {
      console.error('Error creating brand:', error);
      res.status(500).json({ error: 'Failed to create brand' });
    }
  }
);

/**
 * PUT /api/admin/brands/:id
 * Update a brand.
 */
router.put('/:id', sanitizeBody, async (req: AuthRequest, res: Response) => {
  try {
    const body = req.body;

    if (body.name) {
      body.slug = generateSlug(body.name);
    }

    const brand = await brandService.updateBrand(req.params.id, body);
    if (!brand) {
      res.status(404).json({ error: 'Brand not found' });
      return;
    }

    await logActivity({
      action: 'update',
      entity: 'brand',
      entityId: req.params.id,
      entityName: brand.name,
      user: req.user?.email,
    });

    res.json(brand);
  } catch (error) {
    console.error('Error updating brand:', error);
    res.status(500).json({ error: 'Failed to update brand' });
  }
});

/**
 * DELETE /api/admin/brands/:id
 * Delete a brand.
 * REQ-267: Warning if brand has products.
 */
router.delete('/:id', async (req: AuthRequest, res: Response) => {
  try {
    const brand = await brandService.getBrandById(req.params.id);
    if (!brand) {
      res.status(404).json({ error: 'Brand not found' });
      return;
    }

    const productCount = await brandService.getBrandProductCount(req.params.id);

    // Delete logo from storage
    if (brand.logo) {
      await storageService.deleteBlob(brand.logo);
    }

    await brandService.deleteBrand(req.params.id);

    await logActivity({
      action: 'delete',
      entity: 'brand',
      entityId: req.params.id,
      entityName: brand.name,
      user: req.user?.email,
      details: productCount > 0 ? `Had ${productCount} associated products` : undefined,
    });

    res.json({ success: true, hadProducts: productCount });
  } catch (error) {
    console.error('Error deleting brand:', error);
    res.status(500).json({ error: 'Failed to delete brand' });
  }
});

/**
 * POST /api/admin/brands/:id/logo
 * Upload logo for a brand.
 */
router.post('/:id/logo', upload.single('image'), async (req: AuthRequest, res: Response) => {
  try {
    const brand = await brandService.getBrandById(req.params.id);
    if (!brand) {
      res.status(404).json({ error: 'Brand not found' });
      return;
    }

    const file = req.file;
    if (!file) {
      res.status(400).json({ error: 'No image provided' });
      return;
    }

    // Delete existing logo
    if (brand.logo) {
      await storageService.deleteBlob(brand.logo);
    }

    const processed = await processImageSingle(file.buffer, 400);
    const logoUrl = await storageService.uploadImage(processed.buffer, processed.contentType, 'brands');

    const updated = await brandService.updateBrand(req.params.id, { logo: logoUrl });
    res.json(updated);
  } catch (error) {
    console.error('Error uploading logo:', error);
    res.status(500).json({ error: 'Failed to upload logo' });
  }
});

export default router;
