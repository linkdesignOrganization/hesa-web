import { Product, IProduct } from '../models/product.model';
import { Brand } from '../models/brand.model';
import mongoose from 'mongoose';

interface ProductQuery {
  category?: string;
  brand?: string | string[];
  species?: string | string[];
  family?: string | string[];
  lifeStage?: string | string[];
  equipmentType?: string | string[];
  isActive?: boolean;
  page?: number;
  limit?: number;
  search?: string;
}

interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export async function getProducts(query: ProductQuery): Promise<PaginatedResult<IProduct>> {
  const page = Math.max(1, query.page || 1);
  const limit = Math.min(Math.max(1, query.limit || 24), 100);
  const filter = await buildProductFilter(query);

  const total = await Product.countDocuments(filter);
  const data = await Product.find(filter)
    .populate('brand', 'name slug logo country categories')
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit)
    .lean();

  return {
    data: data as unknown as IProduct[],
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
}

/**
 * Build a sanitized filter object from query parameters.
 * Validates enum values and escapes regex to prevent NoSQL injection/ReDoS.
 */
async function buildProductFilter(query: ProductQuery): Promise<Record<string, unknown>> {
  const filter: Record<string, unknown> = {};
  const validCategories = ['farmacos', 'alimentos', 'equipos'];

  if (query.isActive !== undefined) filter.isActive = query.isActive;

  if (query.category && validCategories.includes(query.category)) {
    filter.category = query.category;
  }

  const species = normalizeStringValues(query.species);
  const families = normalizeStringValues(query.family);
  const lifeStages = normalizeStringValues(query.lifeStage);
  const equipmentTypes = normalizeStringValues(query.equipmentType);

  if (species.length > 0) {
    filter.species = { $in: species };
  }

  if (families.length > 0) {
    filter.family = { $in: families };
  }

  if (lifeStages.length > 0) {
    filter.lifeStage = { $in: lifeStages };
  }

  if (equipmentTypes.length > 0) {
    filter.equipmentType = { $in: equipmentTypes };
  }

  const brandFilter = await resolveBrandFilter(query.brand);
  if (brandFilter.length > 0) {
    filter.brand = { $in: brandFilter };
  }

  if (query.search && typeof query.search === 'string') {
    const safeSearch = query.search.substring(0, 100);
    const escapedSearch = safeSearch.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const searchRegex = new RegExp(escapedSearch, 'i');
    filter.$or = [
      { 'name.es': searchRegex },
      { 'name.en': searchRegex },
    ];
  }

  return filter;
}

function normalizeStringValues(values?: string | string[]): string[] {
  const rawValues = Array.isArray(values)
    ? values
    : typeof values === 'string'
      ? values.split(',')
      : [];

  return Array.from(
    new Set(
      rawValues
        .filter(value => typeof value === 'string')
        .map(value => value.substring(0, 100).trim())
        .filter(Boolean)
    )
  );
}

async function resolveBrandFilter(values?: string | string[]): Promise<mongoose.Types.ObjectId[]> {
  const normalizedValues = normalizeStringValues(values);
  if (normalizedValues.length === 0) return [];

  const ids: mongoose.Types.ObjectId[] = [];
  const slugs: string[] = [];

  for (const value of normalizedValues) {
    if (mongoose.isValidObjectId(value)) {
      ids.push(new mongoose.Types.ObjectId(value));
    } else {
      slugs.push(value);
    }
  }

  if (slugs.length > 0) {
    const brandDocs = await Brand.find({ slug: { $in: slugs } }, '_id').lean();
    ids.push(...brandDocs.map(doc => new mongoose.Types.ObjectId(String(doc._id))));
  }

  return ids;
}

export async function getProductBySlug(slug: string, lang: 'es' | 'en'): Promise<IProduct | null> {
  const filter = lang === 'en' ? { 'slug.en': slug } : { 'slug.es': slug };
  return Product.findOne({ ...filter, isActive: true })
    .populate('brand', 'name slug logo country categories')
    .lean() as unknown as Promise<IProduct | null>;
}

export async function getProductById(id: string): Promise<IProduct | null> {
  if (!mongoose.isValidObjectId(id)) return null;
  return Product.findById(id)
    .populate('brand', 'name slug logo country categories')
    .lean() as unknown as Promise<IProduct | null>;
}

export async function createProduct(data: Partial<IProduct>): Promise<IProduct> {
  const product = new Product(data);
  await product.save();
  return product.populate('brand', 'name slug logo country categories');
}

export async function updateProduct(id: string, data: Partial<IProduct>): Promise<IProduct | null> {
  if (!mongoose.isValidObjectId(id)) return null;
  return Product.findByIdAndUpdate(id, data, { new: true })
    .populate('brand', 'name slug logo country categories')
    .lean() as unknown as Promise<IProduct | null>;
}

export async function deleteProduct(id: string): Promise<boolean> {
  if (!mongoose.isValidObjectId(id)) return false;
  const result = await Product.findByIdAndDelete(id);
  return result !== null;
}

export async function getRelatedProducts(
  productId: string,
  category: string,
  brandId: string,
  species: string[],
  limit: number = 4
): Promise<IProduct[]> {
  if (!mongoose.isValidObjectId(productId) || !mongoose.isValidObjectId(brandId)) {
    return [];
  }

  const safeLimit = Math.min(Math.max(1, limit), 12);
  const excludeIds: mongoose.Types.ObjectId[] = [new mongoose.Types.ObjectId(productId)];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let related: any[] = [];

  // Priority 1: same brand AND category
  related = await findRelated({ category, brand: new mongoose.Types.ObjectId(brandId) }, excludeIds, safeLimit);
  if (related.length >= safeLimit) return related as unknown as IProduct[];

  // Priority 2: same category with shared species
  if (species.length > 0) {
    const ids = [...excludeIds, ...related.map((r: { _id: mongoose.Types.ObjectId }) => r._id)];
    const more = await findRelated({ category, species: { $in: species.slice(0, 10) } }, ids, safeLimit - related.length);
    related = [...related, ...more];
  }

  // Priority 3: same category (any)
  if (related.length < safeLimit) {
    const ids = [...excludeIds, ...related.map((r: { _id: mongoose.Types.ObjectId }) => r._id)];
    const more = await findRelated({ category }, ids, safeLimit - related.length);
    related = [...related, ...more];
  }

  return related as unknown as IProduct[];
}

async function findRelated(
  additionalFilter: Record<string, unknown>,
  excludeIds: mongoose.Types.ObjectId[],
  limit: number
) {
  return Product.find({
    ...additionalFilter,
    isActive: true,
    _id: { $nin: excludeIds },
  })
    .populate('brand', 'name slug logo country categories')
    .limit(limit)
    .lean();
}

export async function getFeaturedProducts(): Promise<IProduct[]> {
  return Product.find({ isFeatured: true, isActive: true })
    .populate('brand', 'name slug logo country categories')
    .sort({ featuredOrder: 1 })
    .lean() as unknown as Promise<IProduct[]>;
}

export async function getProductCount(filter?: Record<string, unknown>): Promise<number> {
  return Product.countDocuments(filter || {});
}
