import { Product } from '../models/product.model';
import { Brand } from '../models/brand.model';

interface SearchResult {
  products: {
    id: string;
    name: { es: string; en: string };
    slug: { es: string; en: string };
    brand: string;
    category: string;
    image?: string;
  }[];
  brands: {
    id: string;
    name: string;
    slug: string;
    logo?: string;
    country: string;
  }[];
}

/**
 * Build an accent-tolerant regex from a search term.
 * Escapes special characters and maps base letters to accent groups.
 * Limits input to 100 chars to prevent ReDoS.
 */
function buildAccentTolerantRegex(term: string): RegExp {
  const truncated = term.substring(0, 100);
  const normalized = truncated.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  const escaped = normalized.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const accentMap: Record<string, string> = {
    a: '[aáàä]', e: '[eéèë]', i: '[iíìï]', o: '[oóòö]', u: '[uúùü]', n: '[nñ]',
  };
  const pattern = escaped
    .split('')
    .map(c => accentMap[c.toLowerCase()] || c)
    .join('');
  return new RegExp(pattern, 'i');
}

/**
 * Global search across products and brands.
 * Case-insensitive with regex for partial matching.
 * REQ-035 to REQ-041
 */
export async function globalSearch(
  term: string,
  lang: 'es' | 'en' = 'es',
  limit: number = 5
): Promise<SearchResult> {
  if (!term || term.length < 2) {
    return { products: [], brands: [] };
  }

  const safeLimit = Math.min(Math.max(1, limit), 20);
  const regex = buildAccentTolerantRegex(term);

  const [products, brands] = await Promise.all([
    searchProducts(regex, safeLimit),
    searchBrands(regex, safeLimit),
  ]);

  return { products, brands };
}

async function searchProducts(regex: RegExp, limit: number) {
  const productFilter = {
    isActive: true,
    $or: [
      { 'name.es': regex },
      { 'name.en': regex },
      { species: regex },
      { family: regex },
    ],
  };

  const products = await Product.find(productFilter)
    .populate('brand', 'name slug')
    .select('name slug category images brand')
    .limit(limit)
    .lean();

  return products.map((p) => {
    const brand = p.brand as unknown as { name: string; slug: string };
    return {
      id: String(p._id),
      name: p.name,
      slug: p.slug,
      brand: brand?.name || '',
      category: p.category,
      image: p.images?.[0],
    };
  });
}

async function searchBrands(regex: RegExp, limit: number) {
  const brands = await Brand.find({ name: regex })
    .select('name slug logo country')
    .limit(limit)
    .lean();

  return brands.map((b) => ({
    id: String(b._id),
    name: b.name,
    slug: b.slug,
    logo: b.logo,
    country: b.country,
  }));
}
