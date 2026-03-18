import mongoose, { Schema, Document } from 'mongoose';
import { bilingualField } from './shared-schema';

export interface IProduct extends Document {
  slug: { es: string; en: string };
  name: { es: string; en: string };
  brand: mongoose.Types.ObjectId;
  category: 'farmacos' | 'alimentos' | 'equipos';
  species: string[];
  family?: string;
  lifeStage?: string;
  equipmentType?: string;
  presentations: string[];
  description: { es: string; en: string };
  composition?: { es: string; en: string };
  sanitaryRegistry?: string;
  indications?: { es: string; en: string };
  ingredients?: { es: string; en: string };
  nutritionalInfo?: { es: string; en: string };
  specifications?: { es: string; en: string };
  recommendedUses?: { es: string; en: string };
  warranty?: { es: string; en: string };
  images: string[];
  pdfUrl?: string;
  isActive: boolean;
  isFeatured: boolean;
  featuredOrder?: number;
  storytelling?: {
    image?: string;
    text: { es: string; en: string };
  }[];
  metaTitle?: { es: string; en: string };
  metaDescription?: { es: string; en: string };
  hasEnTranslation: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const productSchema = new Schema<IProduct>(
  {
    slug: { type: bilingualField, required: true },
    name: { type: bilingualField, required: true },
    brand: { type: Schema.Types.ObjectId, ref: 'Brand', required: true },
    category: {
      type: String,
      enum: ['farmacos', 'alimentos', 'equipos'],
      required: true,
    },
    species: [{ type: String }],
    family: { type: String },
    lifeStage: { type: String },
    equipmentType: { type: String },
    presentations: [{ type: String }],
    description: { type: bilingualField, default: () => ({ es: '', en: '' }) },
    composition: { type: bilingualField },
    sanitaryRegistry: { type: String },
    indications: { type: bilingualField },
    ingredients: { type: bilingualField },
    nutritionalInfo: { type: bilingualField },
    specifications: { type: bilingualField },
    recommendedUses: { type: bilingualField },
    warranty: { type: bilingualField },
    images: [{ type: String }],
    pdfUrl: { type: String },
    isActive: { type: Boolean, default: true },
    isFeatured: { type: Boolean, default: false },
    featuredOrder: { type: Number },
    storytelling: [
      {
        image: { type: String },
        text: { type: bilingualField },
      },
    ],
    metaTitle: { type: bilingualField },
    metaDescription: { type: bilingualField },
    hasEnTranslation: { type: Boolean, default: false },
  },
  {
    timestamps: true,
    collection: 'products',
  }
);

// Text index for search (case-insensitive, accent-insensitive)
productSchema.index(
  {
    'name.es': 'text',
    'name.en': 'text',
    'description.es': 'text',
    'description.en': 'text',
  },
  {
    weights: { 'name.es': 10, 'name.en': 10, 'description.es': 2, 'description.en': 2 },
    name: 'product_text_search',
  }
);

// Index for catalog queries
productSchema.index({ category: 1, isActive: 1 });
productSchema.index({ brand: 1, isActive: 1 });
productSchema.index({ 'slug.es': 1 });
productSchema.index({ 'slug.en': 1 });
productSchema.index({ isFeatured: 1, featuredOrder: 1 });
// Cosmos DB MongoDB API requires explicit indexes on sort fields
productSchema.index({ createdAt: -1 });

export const Product = mongoose.model<IProduct>('Product', productSchema);
