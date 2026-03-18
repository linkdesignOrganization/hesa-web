import { Router, Request, Response } from 'express';
import * as homeService from '../../services/home.service';

const router = Router();

/**
 * GET /api/public/home
 * Public home configuration: hero data, featured products, featured brands.
 * REQ-042 to REQ-077
 * BUG-002 FIX: Ensure featured items are populated from isFeatured flags
 * before querying, so the home page always shows featured content.
 */
router.get('/', async (_req: Request, res: Response) => {
  try {
    // BUG-002: Auto-populate home config from isFeatured flags if empty
    await homeService.ensureFeaturedItemsPopulated();

    const [config, featuredProducts, featuredBrands] = await Promise.all([
      homeService.getHomeConfig(),
      homeService.getFeaturedProductsPopulated(),
      homeService.getFeaturedBrandsPopulated(),
    ]);

    // NFR-001/ADR-11: Cache home data for 10 minutes
    res.setHeader('Cache-Control', 'public, max-age=600, stale-while-revalidate=60');
    res.json({
      hero: config.hero,
      featuredProducts,
      featuredBrands,
    });
  } catch (error) {
    console.error('Error fetching home config:', error);
    res.status(500).json({ error: 'Failed to fetch home configuration' });
  }
});

export default router;
