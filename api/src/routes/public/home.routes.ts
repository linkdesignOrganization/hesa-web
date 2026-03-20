import { Router, Request, Response } from 'express';
import * as homeService from '../../services/home.service';
import { importMockCatalog } from '../../services/mock-catalog-import.service';

const router = Router();

/**
 * GET /api/public/home
 * Public home configuration: hero (mode + slides with product populated),
 * featured products, featured brands.
 */
router.get('/', async (_req: Request, res: Response) => {
  try {
    await homeService.ensureFeaturedItemsPopulated();

    const [heroData, featuredProducts, featuredBrands] = await Promise.all([
      homeService.getHeroSlidesPopulated(),
      homeService.getFeaturedProductsPopulated(),
      homeService.getFeaturedBrandsPopulated(),
    ]);

    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.json({
      hero: heroData,
      featuredProducts,
      featuredBrands,
    });
  } catch (error) {
    console.error('Error fetching home config:', error);
    res.status(500).json({ error: 'Failed to fetch home configuration' });
  }
});

/**
 * POST /api/public/home/seed-hero
 * TEMPORARY: Seed hero with mock carousel data. Remove after use.
 */
router.post('/seed-hero', async (_req: Request, res: Response) => {
  try {
    const { HomeConfig } = require('../../models/home-config.model');
    const config = await HomeConfig.findOne();
    if (!config) {
      res.status(404).json({ error: 'No home config found' });
      return;
    }

    const mockSlides = [
      {
        tag: { es: 'Desde 1987', en: 'Since 1987' },
        headline: { es: 'Donde la salud animal encuentra su mejor aliado', en: 'Where animal health finds its best ally' },
        subtitle: { es: 'Distribucion de farmacos, alimentos y equipos veterinarios en Costa Rica', en: 'Distribution of pharmaceuticals, food and veterinary equipment in Costa Rica' },
        ctaText: { es: 'Ver catalogo', en: 'View catalog' },
        ctaLink: '/es/catalogo',
        tagsEs: ['Farmacos', 'Alimentos', 'Equipos'],
        tagsEn: ['Pharmaceuticals', 'Food', 'Equipment'],
        imageDesktop: 'https://images.unsplash.com/photo-1628009368231-7bb7cfcb0def?w=1600&q=80',
        imageMobile: 'https://images.unsplash.com/photo-1628009368231-7bb7cfcb0def?w=800&q=80',
      },
      {
        tag: { es: 'Cobertura Nacional', en: 'National Coverage' },
        headline: { es: 'Llegamos a todo Costa Rica', en: 'We reach all of Costa Rica' },
        subtitle: { es: 'Flotilla propia con cadena de frio y visitas quincenales', en: 'Own fleet with cold chain and biweekly visits' },
        ctaText: { es: 'Conocer mas', en: 'Learn more' },
        ctaLink: '/es/nosotros',
        tagsEs: ['100% Cobertura', 'Flotilla propia', 'Cadena de frio'],
        tagsEn: ['100% Coverage', 'Own fleet', 'Cold chain'],
        imageDesktop: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=1600&q=80',
        imageMobile: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=800&q=80',
      },
      {
        tag: { es: 'Marcas Premium', en: 'Premium Brands' },
        headline: { es: 'Las mejores marcas del mundo en tus manos', en: 'The best brands in the world in your hands' },
        subtitle: { es: 'Representamos marcas exclusivas de Europa, Asia y America', en: 'We represent exclusive brands from Europe, Asia and America' },
        ctaText: { es: 'Ver marcas', en: 'View brands' },
        ctaLink: '/es/marcas',
        tagsEs: ['Exclusivas', 'Internacionales', '+18 Marcas'],
        tagsEn: ['Exclusive', 'International', '+18 Brands'],
        imageDesktop: 'https://images.unsplash.com/photo-1606567595334-d39972c85dbe?w=1600&q=80',
        imageMobile: 'https://images.unsplash.com/photo-1606567595334-d39972c85dbe?w=800&q=80',
      },
    ];

    await HomeConfig.findByIdAndUpdate(config._id, {
      $set: { 'hero.mode': 'carousel', 'hero.slides': mockSlides },
    });

    res.json({ success: true, message: '3 carousel slides seeded' });
  } catch (error) {
    console.error('Seed error:', error);
    res.status(500).json({ error: 'Seed failed' });
  }
});

/**
 * POST /api/public/home/import-mock-catalog
 * TEMPORARY: Populate the production catalog with mock brands/products for testing.
 */
router.post('/import-mock-catalog', async (_req: Request, res: Response) => {
  try {
    const summary = await importMockCatalog();
    res.json({ success: true, summary });
  } catch (error) {
    console.error('Mock catalog import error:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ error: 'Mock catalog import failed', message });
  }
});

export default router;
