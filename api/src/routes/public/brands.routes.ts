import { Router, Request, Response } from 'express';
import * as brandService from '../../services/brand.service';
import * as productService from '../../services/product.service';

const router = Router();

/** Safely extract a string query param, truncated to maxLen. */
function safeQueryString(value: unknown, maxLen = 100): string | undefined {
  if (typeof value !== 'string' || !value.trim()) return undefined;
  return value.substring(0, maxLen).trim();
}

/**
 * GET /api/public/brands
 * Public brands listing.
 * REQ-143 to REQ-148
 */
router.get('/', async (_req: Request, res: Response) => {
  try {
    const brands = await brandService.getBrandsWithProductCount();
    // NFR-001/ADR-11: Cache brands list for 10 minutes
    res.setHeader('Cache-Control', 'public, max-age=600, stale-while-revalidate=60');
    res.json(brands);
  } catch (error) {
    console.error('Error fetching brands:', error);
    res.status(500).json({ error: 'Failed to fetch brands' });
  }
});

/**
 * GET /api/public/brands/featured
 * Featured brands for home page.
 * REQ-057 to REQ-061
 */
router.get('/featured', async (_req: Request, res: Response) => {
  try {
    const brands = await brandService.getFeaturedBrands();
    // NFR-001/ADR-11: Cache featured brands for 10 minutes
    res.setHeader('Cache-Control', 'public, max-age=600, stale-while-revalidate=60');
    res.json(brands);
  } catch (error) {
    console.error('Error fetching featured brands:', error);
    res.status(500).json({ error: 'Failed to fetch featured brands' });
  }
});

/**
 * GET /api/public/brands/:slug
 * Get brand by slug with product count.
 * REQ-149 to REQ-154
 */
router.get('/:slug', async (req: Request, res: Response) => {
  try {
    const slug = req.params.slug.substring(0, 200);
    const brand = await brandService.getBrandBySlug(slug);
    if (!brand) {
      res.status(404).json({ error: 'Brand not found' });
      return;
    }

    const productCount = await brandService.getBrandProductCount(String(brand._id));
    res.json({ ...brand, productCount });
  } catch (error) {
    console.error('Error fetching brand:', error);
    res.status(500).json({ error: 'Failed to fetch brand' });
  }
});

/**
 * GET /api/public/brands/:slug/products
 * Products of a specific brand.
 */
router.get('/:slug/products', async (req: Request, res: Response) => {
  try {
    const slug = req.params.slug.substring(0, 200);
    const brand = await brandService.getBrandBySlug(slug);
    if (!brand) {
      res.status(404).json({ error: 'Brand not found' });
      return;
    }

    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const limit = Math.min(Math.max(1, parseInt(req.query.limit as string) || 24), 100);

    const result = await productService.getProducts({
      brand: String(brand._id),
      isActive: true,
      category: safeQueryString(req.query.category),
      species: safeQueryString(req.query.species),
      family: safeQueryString(req.query.family),
      lifeStage: safeQueryString(req.query.lifeStage),
      equipmentType: safeQueryString(req.query.equipmentType),
      page,
      limit,
    });

    res.json(result);
  } catch (error) {
    console.error('Error fetching brand products:', error);
    res.status(500).json({ error: 'Failed to fetch brand products' });
  }
});

export default router;
