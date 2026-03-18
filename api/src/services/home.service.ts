import { HomeConfig, IHomeConfig } from '../models/home-config.model';
import { Product } from '../models/product.model';
import { Brand } from '../models/brand.model';
import mongoose from 'mongoose';

/**
 * Get the singleton home configuration document.
 * Creates one with defaults if it doesn't exist.
 */
export async function getHomeConfig(): Promise<IHomeConfig> {
  let config = await HomeConfig.findOne().lean() as unknown as IHomeConfig | null;
  if (!config) {
    const created = await HomeConfig.create({});
    config = created.toObject() as unknown as IHomeConfig;
  }
  return config;
}

/**
 * Update the hero section of the home config.
 * Flattens bilingual fields into dot-notation for partial $set updates.
 */
export async function updateHero(heroData: Partial<IHomeConfig['hero']>): Promise<IHomeConfig | null> {
  const config = await getHomeConfig();
  const updateFields: Record<string, unknown> = {};

  if (heroData.image !== undefined) {
    updateFields['hero.image'] = heroData.image;
  }

  const bilingualKeys = ['tag', 'headline', 'subtitle', 'ctaPrimary', 'ctaSecondary'] as const;
  for (const key of bilingualKeys) {
    const field = heroData[key];
    if (field) {
      if (field.es !== undefined) updateFields[`hero.${key}.es`] = field.es;
      if (field.en !== undefined) updateFields[`hero.${key}.en`] = field.en;
    }
  }

  return HomeConfig.findByIdAndUpdate(
    config._id,
    { $set: updateFields },
    { new: true }
  ).lean() as unknown as Promise<IHomeConfig | null>;
}

/**
 * Update featured products list.
 */
export async function updateFeaturedProducts(productIds: string[]): Promise<IHomeConfig | null> {
  const config = await getHomeConfig();
  return HomeConfig.findByIdAndUpdate(
    config._id,
    { $set: { featuredProducts: productIds } },
    { new: true }
  ).lean() as unknown as Promise<IHomeConfig | null>;
}

/**
 * Update featured brands list.
 */
export async function updateFeaturedBrands(brandIds: string[]): Promise<IHomeConfig | null> {
  const config = await getHomeConfig();
  return HomeConfig.findByIdAndUpdate(
    config._id,
    { $set: { featuredBrands: brandIds } },
    { new: true }
  ).lean() as unknown as Promise<IHomeConfig | null>;
}

/**
 * Get featured products in order, with brand populated.
 * REQ-066 to REQ-073: Only active products, in the order set by admin.
 */
export async function getFeaturedProductsPopulated(): Promise<unknown[]> {
  const config = await getHomeConfig();
  if (!config.featuredProducts || config.featuredProducts.length === 0) return [];

  const objectIds = config.featuredProducts
    .filter(id => mongoose.Types.ObjectId.isValid(id))
    .map(id => new mongoose.Types.ObjectId(id));

  const products = await Product.find({
    _id: { $in: objectIds },
    isActive: true,
  })
    .populate('brand', 'name slug logo country categories')
    .lean();

  // Maintain the admin-defined order
  const productMap = new Map(products.map(p => [String(p._id), p]));
  return config.featuredProducts
    .map(id => productMap.get(id))
    .filter(Boolean);
}

/**
 * Get featured brands in order.
 * REQ-057 to REQ-061: Brands in the order set by admin.
 */
export async function getFeaturedBrandsPopulated(): Promise<unknown[]> {
  const config = await getHomeConfig();
  if (!config.featuredBrands || config.featuredBrands.length === 0) return [];

  const objectIds = config.featuredBrands
    .filter(id => mongoose.Types.ObjectId.isValid(id))
    .map(id => new mongoose.Types.ObjectId(id));

  const brands = await Brand.find({ _id: { $in: objectIds } }).lean();

  const brandMap = new Map(brands.map(b => [String(b._id), b]));
  return config.featuredBrands
    .map(id => brandMap.get(id))
    .filter(Boolean);
}
