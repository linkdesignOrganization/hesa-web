import mongoose, { Schema, Document } from 'mongoose';

export interface ICategory extends Document {
  key: 'farmacos' | 'alimentos' | 'equipos';
  name: { es: string; en: string };
  description: { es: string; en: string };
  families?: { es: string; en: string }[];
  species?: { es: string; en: string }[];
  lifeStages?: { es: string; en: string }[];
  equipmentTypes?: { es: string; en: string }[];
  createdAt: Date;
  updatedAt: Date;
}

const bilingualField = {
  es: { type: String, default: '' },
  en: { type: String, default: '' },
};

const categorySchema = new Schema<ICategory>(
  {
    key: {
      type: String,
      enum: ['farmacos', 'alimentos', 'equipos'],
      required: true,
      unique: true,
    },
    name: { type: bilingualField, required: true },
    description: { type: bilingualField, default: () => ({ es: '', en: '' }) },
    families: [{ type: bilingualField }],
    species: [{ type: bilingualField }],
    lifeStages: [{ type: bilingualField }],
    equipmentTypes: [{ type: bilingualField }],
  },
  {
    timestamps: true,
    collection: 'categories',
  }
);

export const Category = mongoose.model<ICategory>('Category', categorySchema);
