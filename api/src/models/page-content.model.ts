import mongoose, { Schema, Document } from 'mongoose';
import { bilingualField } from './shared-schema';

export interface IPageSection {
  key: string;
  label: { es: string; en: string };
  value: { es: string; en: string };
  type: 'text' | 'textarea' | 'image';
}

export interface IPageContent extends Document {
  pageKey: 'nosotros' | 'distribuidores' | 'contacto' | 'politicas';
  sections: IPageSection[];
  heroImage?: string;
  updatedAt: Date;
  createdAt: Date;
}

const pageSectionSchema = new Schema(
  {
    key: { type: String, required: true },
    label: { type: bilingualField, required: true },
    value: { type: bilingualField, default: () => ({ es: '', en: '' }) },
    type: { type: String, enum: ['text', 'textarea', 'image'], default: 'textarea' },
  },
  { _id: false }
);

const pageContentSchema = new Schema<IPageContent>(
  {
    pageKey: {
      type: String,
      enum: ['nosotros', 'distribuidores', 'contacto', 'politicas'],
      required: true,
      unique: true,
    },
    sections: [pageSectionSchema],
    heroImage: { type: String },
  },
  {
    timestamps: true,
    collection: 'page_contents',
  }
);

pageContentSchema.index({ pageKey: 1 });

export const PageContent = mongoose.model<IPageContent>('PageContent', pageContentSchema);
