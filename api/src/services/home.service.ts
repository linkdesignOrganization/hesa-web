import { HomeConfig, IHomeConfig, IHeroSlide } from '../models/home-config.model';
import { Product } from '../models/product.model';
import { Brand } from '../models/brand.model';
import mongoose from 'mongoose';

function createDefaultSingleHeroSlide(): IHeroSlide {
  return {
    tag: { es: 'Atencion cercana', en: 'Close support' },
    headline: {
      es: 'Soluciones veterinarias que respaldan su operacion diaria',
      en: 'Veterinary solutions that support your daily operation',
    },
    subtitle: {
      es: 'Marcas confiables, disponibilidad constante y un equipo comercial listo para atender a su negocio.',
      en: 'Trusted brands, steady availability, and a commercial team ready to support your business.',
    },
    ctaText: { es: 'Ver catalogo', en: 'View catalog' },
    ctaLink: '/es/catalogo',
    product: null,
    tagsEs: ['Farmacos', 'Alimentos', 'Equipos'],
    tagsEn: ['Pharmaceuticals', 'Food', 'Equipment'],
    imageDesktop: '/hero.jpg',
    imageMobile: '/hero.jpg',
  };
}

function isSingleHeroMissing(slide: IHeroSlide | null | undefined): boolean {
  if (!slide) return true;

  return !slide.tag?.es &&
    !slide.tag?.en &&
    !slide.headline?.es &&
    !slide.headline?.en &&
    !slide.subtitle?.es &&
    !slide.subtitle?.en &&
    !slide.ctaText?.es &&
    !slide.ctaText?.en &&
    !slide.ctaLink &&
    !slide.imageDesktop &&
    !slide.imageMobile;
}

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

  if (isSingleHeroMissing(config.hero?.single)) {
    const defaultSingle = createDefaultSingleHeroSlide();
    const updated = await HomeConfig.findByIdAndUpdate(
      config._id,
      { $set: { 'hero.single': defaultSingle } },
      { new: true }
    ).lean() as unknown as IHomeConfig | null;

    if (updated) {
      config = updated;
    } else {
      config.hero.single = defaultSingle;
    }
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
 * Update hero. Saves single and carousel data independently.
 * - target 'single': saves to hero.single
 * - target 'carousel': saves to hero.slides
 * - mode: which one is active
 */
export async function updateHero(heroData: {
  mode: 'single' | 'carousel';
  target: 'single' | 'carousel';
  single?: IHeroSlide;
  slides?: IHeroSlide[];
}): Promise<IHomeConfig | null> {
  const config = await getHomeConfig();
  const updateFields: Record<string, unknown> = {
    'hero.mode': heroData.mode,
  };
  if (heroData.target === 'single' && heroData.single) {
    updateFields['hero.single'] = heroData.single;
  }
  if (heroData.target === 'carousel' && heroData.slides) {
    updateFields['hero.slides'] = heroData.slides;
  }
  return HomeConfig.findByIdAndUpdate(
    config._id,
    { $set: updateFields },
    { new: true }
  ).lean() as unknown as Promise<IHomeConfig | null>;
}

/**
 * Update a specific image. Supports both single and carousel slides.
 */
export async function updateSlideImage(
  target: 'single' | 'carousel',
  slideIndex: number,
  imageType: 'desktop' | 'mobile',
  imageUrl: string
): Promise<IHomeConfig | null> {
  const config = await getHomeConfig();
  const field = imageType === 'desktop' ? 'imageDesktop' : 'imageMobile';

  if (target === 'single' && isSingleHeroMissing(config.hero?.single)) {
    const singleSlide = {
      ...createDefaultSingleHeroSlide(),
      [field]: imageUrl,
    };

    return HomeConfig.findByIdAndUpdate(
      config._id,
      { $set: { 'hero.single': singleSlide } },
      { new: true }
    ).lean() as unknown as Promise<IHomeConfig | null>;
  }

  const key = target === 'single' ? `hero.single.${field}` : `hero.slides.${slideIndex}.${field}`;
  return HomeConfig.findByIdAndUpdate(
    config._id,
    { $set: { [key]: imageUrl } },
    { new: true }
  ).lean() as unknown as Promise<IHomeConfig | null>;
}

/**
 * Populate a single slide's product reference.
 */
async function populateSlideProduct(slide: IHeroSlide): Promise<Record<string, unknown>> {
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
}

/**
 * Get hero data for public display.
 * Returns the active mode's data as { mode, slides[] }.
 */
export async function getHeroSlidesPopulated(): Promise<{ mode: string; slides: unknown[] }> {
  const config = await getHomeConfig();
  const mode = config.hero?.mode || 'single';

  if (mode === 'single') {
    const singleSlide = config.hero?.single;
    if (singleSlide) {
      const populated = await populateSlideProduct(singleSlide);
      return { mode: 'single', slides: [populated] };
    }
    // Fallback: try first carousel slide
    const fallback = config.hero?.slides?.[0];
    if (fallback) {
      const populated = await populateSlideProduct(fallback);
      return { mode: 'single', slides: [populated] };
    }
    return { mode: 'single', slides: [] };
  }

  // Carousel mode
  const slides = config.hero?.slides || [];
  const populated = await Promise.all(slides.map(populateSlideProduct));
  return { mode: 'carousel', slides: populated };
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
