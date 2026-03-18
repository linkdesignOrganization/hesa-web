import mongoose, { Schema, Document } from 'mongoose';
import { bilingualField } from './shared-schema';

export interface ISiteConfig extends Document {
  key: 'general' | 'contacto' | 'redes' | 'seo';
  // General
  siteName?: string;
  defaultLang?: string;
  logoUrl?: string;
  // Contact
  phone?: string;
  email?: string;
  address?: { es: string; en: string };
  hours?: { es: string; en: string };
  whatsapp?: string;
  // Social
  facebook?: string;
  instagram?: string;
  linkedin?: string;
  youtube?: string;
  // SEO
  metaTitle?: { es: string; en: string };
  metaDescription?: { es: string; en: string };
  ogImage?: string;
  // Analytics (prepared, deactivated)
  ga4Id?: string;
  ga4Enabled?: boolean;
  fbPixelId?: string;
  fbPixelEnabled?: boolean;
  updatedAt: Date;
}

const siteConfigSchema = new Schema<ISiteConfig>(
  {
    key: {
      type: String,
      enum: ['general', 'contacto', 'redes', 'seo'],
      required: true,
      unique: true,
    },
    siteName: { type: String, default: 'HESA - Herrera y Elizondo S.A.' },
    defaultLang: { type: String, default: 'es' },
    logoUrl: { type: String },
    phone: { type: String, default: '+506 2260-9020' },
    email: { type: String, default: 'hola@linkdesign.cr' },
    address: { type: bilingualField, default: { es: 'Calle 2, av 12. Heredia, Costa Rica', en: 'Calle 2, av 12. Heredia, Costa Rica' } },
    hours: { type: bilingualField, default: { es: 'Lunes a Viernes: 8:00 - 17:00', en: 'Monday to Friday: 8:00 - 17:00' } },
    whatsapp: { type: String, default: '+50622390000' },
    facebook: { type: String, default: '' },
    instagram: { type: String, default: '' },
    linkedin: { type: String },
    youtube: { type: String },
    metaTitle: { type: bilingualField, default: { es: 'HESA - Farmacos, Alimentos y Equipos Veterinarios', en: 'HESA - Veterinary Pharmaceuticals, Food & Equipment' } },
    metaDescription: { type: bilingualField, default: { es: 'Importacion y distribucion de farmacos veterinarios, alimentos para animales y equipos veterinarios en Costa Rica. 37+ anos de experiencia.', en: 'Import and distribution of veterinary pharmaceuticals, animal food and veterinary equipment in Costa Rica. 37+ years of experience.' } },
    ogImage: { type: String },
    ga4Id: { type: String, default: '' },
    ga4Enabled: { type: Boolean, default: false },
    fbPixelId: { type: String, default: '' },
    fbPixelEnabled: { type: Boolean, default: false },
  },
  {
    timestamps: true,
    collection: 'site_config',
  }
);

export const SiteConfig = mongoose.model<ISiteConfig>('SiteConfig', siteConfigSchema);
