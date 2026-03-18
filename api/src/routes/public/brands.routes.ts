import { Router, Request, Response } from 'express';
import * as brandService from '../../services/brand.service';
import * as productService from '../../services/product.service';

const router = Router();

/**
 * GET /api/public/brands
 * Public brands listing.
 * REQ-143 to REQ-148
 */
router.get('/', async (_req: Request, res: Response) => {
  try {
    const brands = await brandService.getBrandsWithProductCount();
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
      category: (req.query.category as string)?.substring(0, 100),
      species: (req.query.species as string)?.substring(0, 100),
      family: (req.query.family as string)?.substring(0, 100),
      lifeStage: (req.query.lifeStage as string)?.substring(0, 100),
      equipmentType: (req.query.equipmentType as string)?.substring(0, 100),
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
