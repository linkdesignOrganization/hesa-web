import mongoose, { Schema, Document } from 'mongoose';
import { bilingualField } from './shared-schema';

export interface IHeroSlide {
  tag: { es: string; en: string };
  headline: { es: string; en: string };
  subtitle?: { es: string; en: string };
  ctaText: { es: string; en: string };
  ctaLink: string;
  product?: mongoose.Types.ObjectId | string | null;
  tagsEs?: string[];
  tagsEn?: string[];
  imageDesktop?: string;
  imageMobile?: string;
}

export interface IHomeConfig extends Document {
  hero: {
    mode: 'single' | 'carousel';
    slides: IHeroSlide[];
    // Legacy fields (for migration)
    image?: string;
    tag?: { es: string; en: string };
    headline?: { es: string; en: string };
    subtitle?: { es: string; en: string };
    ctaPrimary?: { es: string; en: string };
    ctaSecondary?: { es: string; en: string };
  };
  featuredProducts: string[];
  featuredBrands: string[];
  updatedAt: Date;
  createdAt: Date;
}

const heroSlideSchema = new Schema(
  {
    tag: { type: bilingualField, required: true },
    headline: { type: bilingualField, required: true },
    subtitle: { type: bilingualField },
    ctaText: { type: bilingualField, required: true },
    ctaLink: { type: String, required: true },
    product: { type: Schema.Types.ObjectId, ref: 'Product', default: null },
    tagsEs: [{ type: String }],
    tagsEn: [{ type: String }],
    imageDesktop: { type: String },
    imageMobile: { type: String },
  },
  { _id: true }
);

const homeConfigSchema = new Schema<IHomeConfig>(
  {
    hero: {
      mode: { type: String, enum: ['single', 'carousel'], default: 'single' },
      slides: { type: [heroSlideSchema], default: [] },
      // Legacy fields kept for backward compat / migration
      image: { type: String },
      tag: { type: bilingualField },
      headline: { type: bilingualField },
      subtitle: { type: bilingualField },
      ctaPrimary: { type: bilingualField },
      ctaSecondary: { type: bilingualField },
    },
    featuredProducts: [{ type: String }],
    featuredBrands: [{ type: String }],
  },
  {
    timestamps: true,
    collection: 'home_config',
  }
);

export const HomeConfig = mongoose.model<IHomeConfig>('HomeConfig', homeConfigSchema);
