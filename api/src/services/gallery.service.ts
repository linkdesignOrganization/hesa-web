import { GalleryItem, IGalleryItem } from '../models/gallery-item.model';

export interface GalleryItemInput {
  image: string;
  event: { es: string; en: string };
  date?: string;
  description: { es: string; en: string };
}

/**
 * Get all gallery items, newest first (ordered by createdAt descending).
 */
export async function getGalleryItems(): Promise<IGalleryItem[]> {
  const items = await GalleryItem.find().sort({ createdAt: -1 }).lean() as unknown as IGalleryItem[];
  return items;
}

/**
 * Get a single gallery item by ID.
 */
export async function getGalleryItemById(id: string): Promise<IGalleryItem | null> {
  return GalleryItem.findById(id).lean() as unknown as Promise<IGalleryItem | null>;
}

/**
 * Create a new gallery item.
 */
export async function createGalleryItem(data: GalleryItemInput): Promise<IGalleryItem> {
  return GalleryItem.create(data);
}

/**
 * Update a gallery item.
 */
export async function updateGalleryItem(
  id: string,
  data: Partial<GalleryItemInput>
): Promise<IGalleryItem | null> {
  return GalleryItem.findByIdAndUpdate(id, { $set: data }, { new: true }).lean() as unknown as Promise<IGalleryItem | null>;
}

/**
 * Delete a gallery item.
 */
export async function deleteGalleryItem(id: string): Promise<boolean> {
  const result = await GalleryItem.findByIdAndDelete(id);
  return !!result;
}
