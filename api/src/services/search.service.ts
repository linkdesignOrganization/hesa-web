import { Product } from '../models/product.model';
import { Brand } from '../models/brand.model';
import { Message } from '../models/message.model';

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

/**
 * Admin global search across products, brands, and messages.
 * REQ-220, REQ-221: Search bar in admin header.
 * Searches products by name, brands by name, messages by name/content.
 */
export interface AdminSearchResult {
  products: {
    id: string;
    name: string;
    category: string;
    isActive: boolean;
  }[];
  brands: {
    id: string;
    name: string;
    country: string;
  }[];
  messages: {
    id: string;
    name: string;
    email: string;
    status: string;
    type: string;
  }[];
}

export async function adminSearch(
  term: string,
  limit: number = 5
): Promise<AdminSearchResult> {
  if (!term || term.length < 2) {
    return { products: [], brands: [], messages: [] };
  }

  const safeLimit = Math.min(Math.max(1, limit), 10);
  const regex = buildAccentTolerantRegex(term);

  const [products, brands, messages] = await Promise.all([
    adminSearchProducts(regex, safeLimit),
    adminSearchBrands(regex, safeLimit),
    adminSearchMessages(regex, safeLimit),
  ]);

  return { products, brands, messages };
}

async function adminSearchProducts(regex: RegExp, limit: number) {
  const products = await Product.find({
    $or: [
      { 'name.es': regex },
      { 'name.en': regex },
    ],
  })
    .select('name category isActive')
    .limit(limit)
    .lean();

  return products.map((p) => ({
    id: String(p._id),
    name: p.name.es,
    category: p.category,
    isActive: p.isActive,
  }));
}

async function adminSearchBrands(regex: RegExp, limit: number) {
  const brands = await Brand.find({ name: regex })
    .select('name country')
    .limit(limit)
    .lean();

  return brands.map((b) => ({
    id: String(b._id),
    name: b.name,
    country: b.country,
  }));
}

async function adminSearchMessages(regex: RegExp, limit: number) {
  const messages = await Message.find({
    $or: [
      { name: regex },
      { email: regex },
      { message: regex },
    ],
  })
    .select('name email status type')
    .sort({ createdAt: -1 })
    .limit(limit)
    .lean();

  return messages.map((m) => ({
    id: String(m._id),
    name: m.name,
    email: m.email,
    status: m.status,
    type: m.type,
  }));
}
