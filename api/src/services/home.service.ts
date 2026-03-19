import { HomeConfig, IHomeConfig, IHeroSlide } from '../models/home-config.model';
import { Product } from '../models/product.model';
import { Brand } from '../models/brand.model';
import mongoose from 'mongoose';

/**
 * Get the singleton home configuration document.
 * Creates one with defaults if it doesn't exist.
 * Includes migration from legacy hero format to new slides format.
 */
export async function getHomeConfig(): Promise<IHomeConfig> {
  let config = await HomeConfig.findOne().lean() as unknown as IHomeConfig | null;
  if (!config) {
    const created = await HomeConfig.create({
      hero: {
        mode: 'single',
        slides: [{
          tag: { es: 'DESDE 1987', en: 'SINCE 1987' },
          headline: { es: 'Conectamos la industria veterinaria con las mejores marcas del mundo', en: 'Connecting the veterinary industry with the world\'s best brands' },
          subtitle: { es: 'Importacion y distribucion de farmacos veterinarios, alimentos para animales y equipos veterinarios en Costa Rica', en: 'Import and distribution of veterinary pharmaceuticals, animal food, and veterinary equipment in Costa Rica' },
          ctaText: { es: 'Explorar catalogo', en: 'Explore catalog' },
          ctaLink: '/es/catalogo',
        }],
      },
    });
    config = created.toObject() as unknown as IHomeConfig;
  }

  // Migration: convert legacy hero format to new slides format
  if (config.hero && (!config.hero.slides || config.hero.slides.length === 0) && config.hero.tag) {
    const legacySlide: Partial<IHeroSlide> = {
      tag: config.hero.tag,
      headline: config.hero.headline,
      subtitle: config.hero.subtitle,
      ctaText: config.hero.ctaPrimary || { es: 'Explorar catalogo', en: 'Explore catalog' },
      ctaLink: '/es/catalogo',
    };
    if (config.hero.image) {
      legacySlide.imageDesktop = config.hero.image;
      legacySlide.imageMobile = config.hero.image;
    }
    await HomeConfig.findByIdAndUpdate(config._id, {
      $set: {
        'hero.mode': 'single',
        'hero.slides': [legacySlide],
      },
    });
    config.hero.mode = 'single';
    config.hero.slides = [legacySlide as IHeroSlide];
  }

  return config;
}

/**
 * BUG-002 FIX: Ensure home config has featured brands/products populated.
 */
export async function ensureFeaturedItemsPopulated(): Promise<void> {
  const config = await getHomeConfig();
  let needsUpdate = false;
  const updateFields: Record<string, unknown> = {};

  if (!config.featuredBrands || config.featuredBrands.length === 0) {
    const featuredBrands = await Brand.find({ isFeatured: true })
      .sort({ featuredOrder: 1 })
      .lean();
    if (featuredBrands.length > 0) {
      updateFields.featuredBrands = featuredBrands.map(b => String(b._id));
      needsUpdate = true;
    }
  }

  if (!config.featuredProducts || config.featuredProducts.length === 0) {
    const featuredProducts = await Product.find({ isFeatured: true, isActive: true })
      .sort({ featuredOrder: 1 })
      .lean();
    if (featuredProducts.length > 0) {
      updateFields.featuredProducts = featuredProducts.map(p => String(p._id));
      needsUpdate = true;
    }
  }

  if (needsUpdate) {
    await HomeConfig.findByIdAndUpdate(config._id, { $set: updateFields });
  }
}

/**
 * Update the hero section with new mode + slides structure.
 */
export async function updateHero(heroData: { mode: 'single' | 'carousel'; slides: IHeroSlide[] }): Promise<IHomeConfig | null> {
  const config = await getHomeConfig();
  return HomeConfig.findByIdAndUpdate(
    config._id,
    {
      $set: {
        'hero.mode': heroData.mode,
        'hero.slides': heroData.slides,
      },
    },
    { new: true }
  ).lean() as unknown as Promise<IHomeConfig | null>;
}

/**
 * Update a specific slide's image (desktop or mobile).
 */
export async function updateSlideImage(
  slideIndex: number,
  imageType: 'desktop' | 'mobile',
  imageUrl: string
): Promise<IHomeConfig | null> {
  const config = await getHomeConfig();
  const field = imageType === 'desktop' ? 'imageDesktop' : 'imageMobile';
  const key = `hero.slides.${slideIndex}.${field}`;
  return HomeConfig.findByIdAndUpdate(
    config._id,
    { $set: { [key]: imageUrl } },
    { new: true }
  ).lean() as unknown as Promise<IHomeConfig | null>;
}

/**
 * Get hero slides with product populated for public display.
 */
export async function getHeroSlidesPopulated(): Promise<{ mode: string; slides: unknown[] }> {
  const config = await getHomeConfig();
  const slides = config.hero?.slides || [];
  const mode = config.hero?.mode || 'single';

  const populated = await Promise.all(
    slides.map(async (slide: IHeroSlide) => {
      const result: Record<string, unknown> = { ...slide };
      if (slide.product) {
        const productId = typeof slide.product === 'string' ? slide.product : String(slide.product);
        if (mongoose.Types.ObjectId.isValid(productId)) {
          const product = await Product.findById(productId)
            .populate('brand', 'name slug logo country categories')
            .lean();
          if (product && (product as any).isActive) {
            result.product = product;
          } else {
            result.product = null;
          }
        }
      }
      return result;
    })
  );

  return { mode, slides: populated };
}

// ---- Featured Products/Brands (unchanged) ----

export async function updateFeaturedProducts(productIds: string[]): Promise<IHomeConfig | null> {
  const config = await getHomeConfig();
  return HomeConfig.findByIdAndUpdate(
    config._id,
    { $set: { featuredProducts: productIds } },
    { new: true }
  ).lean() as unknown as Promise<IHomeConfig | null>;
}

export async function updateFeaturedBrands(brandIds: string[]): Promise<IHomeConfig | null> {
  const config = await getHomeConfig();
  return HomeConfig.findByIdAndUpdate(
    config._id,
    { $set: { featuredBrands: brandIds } },
    { new: true }
  ).lean() as unknown as Promise<IHomeConfig | null>;
}

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

  const productMap = new Map(products.map(p => [String(p._id), p]));
  return config.featuredProducts
    .map(id => productMap.get(id))
    .filter(Boolean);
}

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
