import mongoose, { Schema, Document } from 'mongoose';
import { bilingualField } from './shared-schema';

export interface IGalleryItem extends Document {
  image: string;
  event: { es: string; en: string };
  /** Free-text date (e.g. "Marzo 2024"). Single value, not bilingual. */
  date?: string;
  description: { es: string; en: string };
  createdAt: Date;
  updatedAt: Date;
}

const galleryItemSchema = new Schema<IGalleryItem>(
  {
    image: { type: String, required: true },
    event: { type: bilingualField, required: true },
    date: { type: String, default: '' },
    description: { type: bilingualField, default: () => ({ es: '', en: '' }) },
  },
  {
    timestamps: true,
    collection: 'gallery_items',
  }
);

// Newest first — the gallery is ordered by creation date descending.
galleryItemSchema.index({ createdAt: -1 });

export const GalleryItem = mongoose.model<IGalleryItem>('GalleryItem', galleryItemSchema);
