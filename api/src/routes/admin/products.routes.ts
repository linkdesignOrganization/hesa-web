import { Router, Response } from 'express';
import mongoose from 'mongoose';
import { AuthRequest } from '../../middleware/auth.middleware';
import { sanitizeBody, requireFields } from '../../middleware/validate.middleware';
import { adminUploadImages, adminUploadPdf } from '../../middleware/admin-upload.middleware';
import * as productService from '../../services/product.service';
import * as storageService from '../../services/storage.service';
import { logActivity } from '../../services/activity-log.service';
import { generateProductSlugs } from '../../utils/slug';
import { processImageSingle } from '../../utils/image-processor';

const router = Router();

/** Validate that :id is a valid MongoDB ObjectId. */
function isValidId(id: string): boolean {
  return mongoose.isValidObjectId(id);
}

/**
 * GET /api/admin/products
 * Admin product listing (includes inactive).
 * REQ-224 to REQ-233
 */
router.get('/', async (req: AuthRequest, res: Response) => {
  try {
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const limit = Math.min(Math.max(1, parseInt(req.query.limit as string) || 24), 100);

    const result = await productService.getProducts({
      category: (req.query.category as string)?.substring(0, 100),
      brand: (req.query.brand as string)?.substring(0, 100),
      search: (req.query.search as string)?.substring(0, 100),
      isActive: req.query.status === 'active' ? true : req.query.status === 'inactive' ? false : undefined,
      page,
      limit,
    });
    res.json(result);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

/**
 * GET /api/admin/products/:id
 * Admin product detail.
 * REQ-255 to REQ-258
 */
router.get('/:id', async (req: AuthRequest, res: Response) => {
  try {
    if (!isValidId(req.params.id)) {
      res.status(400).json({ error: 'Invalid product ID' });
      return;
    }
    const product = await productService.getProductById(req.params.id);
    if (!product) {
      res.status(404).json({ error: 'Product not found' });
      return;
    }
    res.json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ error: 'Failed to fetch product' });
  }
});

/**
 * POST /api/admin/products
 * Create a new product.
 * REQ-234 to REQ-254
 */
router.post(
  '/',
  sanitizeBody,
  requireFields('category'),
  async (req: AuthRequest, res: Response) => {
    try {
      const body = req.body;

      // Generate slugs from name
      const nameEs = body.name?.es || '';
      const nameEn = body.name?.en || nameEs;
      const slugs = generateProductSlugs(nameEs, nameEn);

      // Check for slug uniqueness and append counter if needed
      let finalSlugs = slugs;
      let counter = 1;
      while (true) {
        const existing = await productService.getProductBySlug(finalSlugs.es, 'es');
        if (!existing) break;
        finalSlugs = {
          es: `${slugs.es}-${counter}`,
          en: `${slugs.en}-${counter}`,
        };
        counter++;
      }

      const product = await productService.createProduct({
        ...body,
        slug: finalSlugs,
        hasEnTranslation: !!(body.name?.en && body.description?.en),
      });

      await logActivity({
        action: 'create',
        entity: 'product',
        entityId: String(product._id),
        entityName: nameEs,
        user: req.user?.email,
      });

      res.status(201).json(product);
    } catch (error) {
      console.error('Error creating product:', error);
      res.status(500).json({ error: 'Failed to create product' });
    }
  }
);

/**
 * PUT /api/admin/products/:id
 * Update a product.
 */
router.put('/:id', sanitizeBody, async (req: AuthRequest, res: Response) => {
  try {
    const body = req.body;

    // Regenerate slugs if name changed
    if (body.name) {
      const nameEs = body.name.es || '';
      const nameEn = body.name.en || nameEs;
      body.slug = generateProductSlugs(nameEs, nameEn);
      body.hasEnTranslation = !!(body.name.en && body.description?.en);
    }

    const product = await productService.updateProduct(req.params.id, body);
    if (!product) {
      res.status(404).json({ error: 'Product not found' });
      return;
    }

    await logActivity({
      action: 'update',
      entity: 'product',
      entityId: req.params.id,
      entityName: product.name?.es,
      user: req.user?.email,
    });

    res.json(product);
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ error: 'Failed to update product' });
  }
});

/**
 * DELETE /api/admin/products/:id
 * Delete a product.
 */
router.delete('/:id', async (req: AuthRequest, res: Response) => {
  try {
    const product = await productService.getProductById(req.params.id);
    if (!product) {
      res.status(404).json({ error: 'Product not found' });
      return;
    }

    // Delete associated images and PDF from storage
    if (product.images) {
      for (const img of product.images) {
        await storageService.deleteBlob(img);
      }
    }
    if (product.pdfUrl) {
      await storageService.deleteBlob(product.pdfUrl);
    }

    await productService.deleteProduct(req.params.id);

    await logActivity({
      action: 'delete',
      entity: 'product',
      entityId: req.params.id,
      entityName: product.name?.es,
      user: req.user?.email,
    });

    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ error: 'Failed to delete product' });
  }
});

/**
 * POST /api/admin/products/:id/images
 * Upload images for a product.
 * REQ-243, REQ-244, REQ-253, REQ-254
 */
router.post('/:id/images', adminUploadImages.array('images', 6), async (req: AuthRequest, res: Response) => {
  try {
    const product = await productService.getProductById(req.params.id);
    if (!product) {
      res.status(404).json({ error: 'Product not found' });
      return;
    }

    const files = req.files as Express.Multer.File[];
    if (!files || files.length === 0) {
      res.status(400).json({ error: 'No images provided' });
      return;
    }

    const uploadedUrls: string[] = [];
    for (const file of files) {
      const processed = await processImageSingle(file.buffer, 1200);
      const url = await storageService.uploadImage(processed.buffer, processed.contentType, 'products');
      uploadedUrls.push(url);
    }

    const existingImages = product.images || [];
    const allImages = [...existingImages, ...uploadedUrls];

    const updated = await productService.updateProduct(req.params.id, { images: allImages });
    res.json(updated);
  } catch (error) {
    console.error('Error uploading images:', error);
    res.status(500).json({ error: 'Failed to upload images' });
  }
});

/**
 * DELETE /api/admin/products/:id/images/:imageIndex
 * Remove a specific image from a product.
 */
router.delete('/:id/images/:imageIndex', async (req: AuthRequest, res: Response) => {
  try {
    const product = await productService.getProductById(req.params.id);
    if (!product) {
      res.status(404).json({ error: 'Product not found' });
      return;
    }

    const index = parseInt(req.params.imageIndex);
    if (isNaN(index) || index < 0 || index >= (product.images?.length || 0)) {
      res.status(400).json({ error: 'Invalid image index' });
      return;
    }

    const imageUrl = product.images![index];
    await storageService.deleteBlob(imageUrl);

    const updatedImages = product.images!.filter((_, i) => i !== index);
    const updated = await productService.updateProduct(req.params.id, { images: updatedImages });
    res.json(updated);
  } catch (error) {
    console.error('Error deleting image:', error);
    res.status(500).json({ error: 'Failed to delete image' });
  }
});

/**
 * POST /api/admin/products/:id/pdf
 * Upload PDF for a product.
 * REQ-243, REQ-245
 */
router.post('/:id/pdf', adminUploadPdf.single('pdf'), async (req: AuthRequest, res: Response) => {
  try {
    const product = await productService.getProductById(req.params.id);
    if (!product) {
      res.status(404).json({ error: 'Product not found' });
      return;
    }

    const file = req.file;
    if (!file) {
      res.status(400).json({ error: 'No PDF provided' });
      return;
    }

    // Delete existing PDF if present
    if (product.pdfUrl) {
      await storageService.deleteBlob(product.pdfUrl);
    }

    const pdfUrl = await storageService.uploadDocument(file.buffer, file.originalname);
    const updated = await productService.updateProduct(req.params.id, { pdfUrl });
    res.json(updated);
  } catch (error) {
    console.error('Error uploading PDF:', error);
    res.status(500).json({ error: 'Failed to upload PDF' });
  }
});

/**
 * DELETE /api/admin/products/:id/pdf
 * Remove PDF from a product.
 */
router.delete('/:id/pdf', async (req: AuthRequest, res: Response) => {
  try {
    const product = await productService.getProductById(req.params.id);
    if (!product) {
      res.status(404).json({ error: 'Product not found' });
      return;
    }

    if (product.pdfUrl) {
      await storageService.deleteBlob(product.pdfUrl);
    }

    const updated = await productService.updateProduct(req.params.id, { pdfUrl: undefined });
    res.json(updated);
  } catch (error) {
    console.error('Error deleting PDF:', error);
    res.status(500).json({ error: 'Failed to delete PDF' });
  }
});

/**
 * PATCH /api/admin/products/:id/toggle-active
 * Toggle product active state.
 * REQ-228
 */
router.patch('/:id/toggle-active', async (req: AuthRequest, res: Response) => {
  try {
    const product = await productService.getProductById(req.params.id);
    if (!product) {
      res.status(404).json({ error: 'Product not found' });
      return;
    }

    const updated = await productService.updateProduct(req.params.id, {
      isActive: !product.isActive,
    });

    const action = updated?.isActive ? 'activate' : 'deactivate';
    await logActivity({
      action,
      entity: 'product',
      entityId: req.params.id,
      entityName: product.name?.es,
      user: req.user?.email,
    });

    res.json(updated);
  } catch (error) {
    console.error('Error toggling product:', error);
    res.status(500).json({ error: 'Failed to toggle product' });
  }
});

/**
 * POST /api/admin/products/:id/duplicate
 * Duplicate a product.
 * REQ-228
 */
router.post('/:id/duplicate', async (req: AuthRequest, res: Response) => {
  try {
    const original = await productService.getProductById(req.params.id);
    if (!original) {
      res.status(404).json({ error: 'Product not found' });
      return;
    }

    const nameEs = `${original.name.es} (copia)`;
    const nameEn = original.name.en ? `${original.name.en} (copy)` : '';
    const slugs = generateProductSlugs(nameEs, nameEn);

    const duplicateData = {
      ...original,
      _id: undefined,
      name: { es: nameEs, en: nameEn },
      slug: slugs,
      isFeatured: false,
      featuredOrder: undefined,
      createdAt: undefined,
      updatedAt: undefined,
    };

    delete (duplicateData as Record<string, unknown>)._id;
    delete (duplicateData as Record<string, unknown>).createdAt;
    delete (duplicateData as Record<string, unknown>).updatedAt;

    const duplicate = await productService.createProduct(duplicateData as never);

    await logActivity({
      action: 'create',
      entity: 'product',
      entityId: String(duplicate._id),
      entityName: nameEs,
      user: req.user?.email,
      details: `Duplicated from ${original.name.es}`,
    });

    res.status(201).json(duplicate);
  } catch (error) {
    console.error('Error duplicating product:', error);
    res.status(500).json({ error: 'Failed to duplicate product' });
  }
});

export default router;
