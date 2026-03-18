import mongoose, { Schema, Document } from 'mongoose';

export interface IBrand extends Document {
  slug: string;
  name: string;
  country: string;
  categories: ('farmacos' | 'alimentos' | 'equipos')[];
  description: { es: string; en: string };
  logo?: string;
  isFeatured: boolean;
  featuredOrder?: number;
  createdAt: Date;
  updatedAt: Date;
}

const brandSchema = new Schema<IBrand>(
  {
    slug: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    country: { type: String, required: true },
    categories: [
      {
        type: String,
        enum: ['farmacos', 'alimentos', 'equipos'],
      },
    ],
    description: {
      es: { type: String, default: '' },
      en: { type: String, default: '' },
    },
    logo: { type: String },
    isFeatured: { type: Boolean, default: false },
    featuredOrder: { type: Number },
  },
  {
    timestamps: true,
    collection: 'brands',
  }
);

brandSchema.index({ name: 'text' }, { name: 'brand_text_search' });
brandSchema.index({ slug: 1 });
brandSchema.index({ isFeatured: 1, featuredOrder: 1 });
// Cosmos DB MongoDB API requires explicit indexes on sort fields
brandSchema.index({ name: 1 });
brandSchema.index({ createdAt: -1 });

export const Brand = mongoose.model<IBrand>('Brand', brandSchema);
