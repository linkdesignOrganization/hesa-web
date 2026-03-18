import mongoose, { Schema, Document } from 'mongoose';
import { bilingualField } from './shared-schema';

export interface IHomeConfig extends Document {
  hero: {
    image?: string;
    tag: { es: string; en: string };
    headline: { es: string; en: string };
    subtitle: { es: string; en: string };
    ctaPrimary: { es: string; en: string };
    ctaSecondary: { es: string; en: string };
  };
  featuredProducts: string[]; // Array of product ObjectId strings in display order
  featuredBrands: string[]; // Array of brand ObjectId strings in display order
  updatedAt: Date;
  createdAt: Date;
}

const homeConfigSchema = new Schema<IHomeConfig>(
  {
    hero: {
      image: { type: String },
      tag: { type: bilingualField, default: () => ({ es: 'DESDE 1989', en: 'SINCE 1989' }) },
      headline: {
        type: bilingualField,
        default: () => ({
          es: 'Conectamos la industria veterinaria con las mejores marcas del mundo',
          en: 'Connecting the veterinary industry with the world\'s best brands',
        }),
      },
      subtitle: {
        type: bilingualField,
        default: () => ({
          es: 'Importacion y distribucion de farmacos veterinarios, alimentos para animales y equipos veterinarios en Costa Rica',
          en: 'Import and distribution of veterinary pharmaceuticals, animal food, and veterinary equipment in Costa Rica',
        }),
      },
      ctaPrimary: { type: bilingualField, default: () => ({ es: 'Explorar catalogo', en: 'Explore catalog' }) },
      ctaSecondary: { type: bilingualField, default: () => ({ es: 'Distribuya con nosotros', en: 'Partner with us' }) },
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
