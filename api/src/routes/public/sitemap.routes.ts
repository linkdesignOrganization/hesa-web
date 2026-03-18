import { Router, Request, Response } from 'express';
import { Product } from '../../models/product.model';
import { Brand } from '../../models/brand.model';

const router = Router();

const BASE_URL = process.env.SITE_URL || 'https://www.hesa.cr';

interface SitemapUrl {
  loc: string;
  lastmod: string;
  priority: string;
}

const CATEGORY_SLUG_MAP: Record<string, { es: string; en: string }> = {
  farmacos: { es: 'farmacos', en: 'pharmaceuticals' },
  alimentos: { es: 'alimentos', en: 'food' },
  equipos: { es: 'equipos', en: 'equipment' },
};

const STATIC_PAGES: { loc: string; priority: string }[] = [
  { loc: '/es', priority: '1.0' },
  { loc: '/en', priority: '1.0' },
  { loc: '/es/catalogo', priority: '0.9' },
  { loc: '/en/catalog', priority: '0.9' },
  { loc: '/es/catalogo/farmacos', priority: '0.8' },
  { loc: '/es/catalogo/alimentos', priority: '0.8' },
  { loc: '/es/catalogo/equipos', priority: '0.8' },
  { loc: '/en/catalog/pharmaceuticals', priority: '0.8' },
  { loc: '/en/catalog/food', priority: '0.8' },
  { loc: '/en/catalog/equipment', priority: '0.8' },
  { loc: '/es/marcas', priority: '0.8' },
  { loc: '/en/brands', priority: '0.8' },
  { loc: '/es/nosotros', priority: '0.6' },
  { loc: '/en/about', priority: '0.6' },
  { loc: '/es/distribuidores', priority: '0.7' },
  { loc: '/en/distributors', priority: '0.7' },
  { loc: '/es/contacto', priority: '0.5' },
  { loc: '/en/contact', priority: '0.5' },
];

function formatDate(date?: Date | string): string {
  if (!date) return new Date().toISOString().split('T')[0];
  return new Date(date).toISOString().split('T')[0];
}

async function getProductUrls(): Promise<SitemapUrl[]> {
  const products = await Product.find({ isActive: true })
    .select('slug category updatedAt')
    .lean();

  return products.flatMap((p) => {
    const catSlugs = CATEGORY_SLUG_MAP[p.category] || { es: p.category, en: p.category };
    return [
      { loc: `/es/catalogo/${catSlugs.es}/${p.slug.es}`, lastmod: formatDate(p.updatedAt), priority: '0.7' },
      { loc: `/en/catalog/${catSlugs.en}/${p.slug.en}`, lastmod: formatDate(p.updatedAt), priority: '0.7' },
    ];
  });
}

async function getBrandUrls(): Promise<SitemapUrl[]> {
  const brands = await Brand.find().select('slug updatedAt').lean();
  return brands.flatMap((b) => [
    { loc: `/es/marcas/${b.slug}`, lastmod: formatDate(b.updatedAt), priority: '0.6' },
    { loc: `/en/brands/${b.slug}`, lastmod: formatDate(b.updatedAt), priority: '0.6' },
  ]);
}

function buildSitemapXml(urls: SitemapUrl[]): string {
  const entries = urls.map(
    (u) => `  <url>\n    <loc>${BASE_URL}${u.loc}</loc>\n    <lastmod>${u.lastmod}</lastmod>\n    <priority>${u.priority}</priority>\n  </url>`
  ).join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries}\n</urlset>`;
}

/**
 * GET /api/public/sitemap.xml
 * NFR-007: Auto-generated XML sitemap
 */
router.get('/', async (_req: Request, res: Response) => {
  try {
    const today = formatDate();
    const staticUrls: SitemapUrl[] = STATIC_PAGES.map(p => ({ ...p, lastmod: today }));

    const [productUrls, brandUrls] = await Promise.all([
      getProductUrls(),
      getBrandUrls(),
    ]);

    const xml = buildSitemapXml([...staticUrls, ...productUrls, ...brandUrls]);
    res.set('Content-Type', 'application/xml');
    res.send(xml);
  } catch (error) {
    console.error('Error generating sitemap:', error);
    res.status(500).send('Failed to generate sitemap');
  }
});

export default router;
