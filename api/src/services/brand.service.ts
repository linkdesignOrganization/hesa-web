import { Brand, IBrand } from '../models/brand.model';
import { Product } from '../models/product.model';
import mongoose from 'mongoose';

export async function getBrands(): Promise<IBrand[]> {
  return Brand.find().sort({ name: 1 }).lean() as unknown as Promise<IBrand[]>;
}

export async function getBrandBySlug(slug: string): Promise<IBrand | null> {
  return Brand.findOne({ slug }).lean() as unknown as Promise<IBrand | null>;
}

export async function getBrandById(id: string): Promise<IBrand | null> {
  if (!mongoose.isValidObjectId(id)) return null;
  return Brand.findById(id).lean() as unknown as Promise<IBrand | null>;
}

export async function createBrand(data: Partial<IBrand>): Promise<IBrand> {
  const brand = new Brand(data);
  await brand.save();
  return brand.toObject();
}

export async function updateBrand(id: string, data: Partial<IBrand>): Promise<IBrand | null> {
  if (!mongoose.isValidObjectId(id)) return null;
  return Brand.findByIdAndUpdate(id, data, { new: true }).lean() as unknown as Promise<IBrand | null>;
}

export async function deleteBrand(id: string): Promise<boolean> {
  if (!mongoose.isValidObjectId(id)) return false;
  const result = await Brand.findByIdAndDelete(id);
  return result !== null;
}

export async function getBrandProductCount(brandId: string): Promise<number> {
  return Product.countDocuments({ brand: new mongoose.Types.ObjectId(brandId) });
}

export async function getFeaturedBrands(): Promise<IBrand[]> {
  return Brand.find({ isFeatured: true })
    .sort({ featuredOrder: 1 })
    .lean() as unknown as Promise<IBrand[]>;
}

export async function getBrandsWithProductCount(): Promise<(IBrand & { productCount: number })[]> {
  const brands = await Brand.find().sort({ name: 1 }).lean();
  if (brands.length === 0) return [];

  // Single aggregation to get counts for all brands at once (avoids N+1 queries)
  const counts = await Product.aggregate([
    { $group: { _id: '$brand', count: { $sum: 1 } } },
  ]);
  const countMap = new Map(counts.map(c => [String(c._id), c.count as number]));

  return brands.map(brand => ({
    ...brand,
    productCount: countMap.get(String(brand._id)) || 0,
  })) as unknown as (IBrand & { productCount: number })[];
}
