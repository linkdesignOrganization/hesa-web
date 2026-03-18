import { Category, ICategory } from '../models/category.model';
import { Product } from '../models/product.model';

export async function getCategories(): Promise<ICategory[]> {
  return Category.find().lean() as unknown as Promise<ICategory[]>;
}

export async function getCategoryByKey(key: string): Promise<ICategory | null> {
  return Category.findOne({ key }).lean() as unknown as Promise<ICategory | null>;
}

export async function updateCategory(key: string, data: Partial<ICategory>): Promise<ICategory | null> {
  return Category.findOneAndUpdate({ key }, data, { new: true }).lean() as unknown as Promise<ICategory | null>;
}

export async function getCategoryProductCount(categoryKey: string): Promise<number> {
  return Product.countDocuments({ category: categoryKey, isActive: true });
}

export async function getCategoriesWithCounts(): Promise<(ICategory & { activeCount: number; totalCount: number })[]> {
  const categories = await Category.find().lean();
  if (categories.length === 0) return [];

  // Single aggregation for both active and total counts (avoids N+1 queries)
  const [totalAgg, activeAgg] = await Promise.all([
    Product.aggregate([{ $group: { _id: '$category', count: { $sum: 1 } } }]),
    Product.aggregate([{ $match: { isActive: true } }, { $group: { _id: '$category', count: { $sum: 1 } } }]),
  ]);

  const totalMap = new Map(totalAgg.map(c => [c._id as string, c.count as number]));
  const activeMap = new Map(activeAgg.map(c => [c._id as string, c.count as number]));

  return categories.map(cat => ({
    ...cat,
    activeCount: activeMap.get(cat.key) || 0,
    totalCount: totalMap.get(cat.key) || 0,
  })) as unknown as (ICategory & { activeCount: number; totalCount: number })[];
}

/**
 * Get dynamic filter values from actual products in the database.
 * Returns species, families, life stages, equipment types that are actually in use.
 */
export async function getDynamicFilterValues(category?: string): Promise<{
  brands: { id: string; name: string; slug: string }[];
  species: string[];
  families: string[];
  lifeStages: string[];
  equipmentTypes: string[];
}> {
  const filter: Record<string, unknown> = { isActive: true };
  if (category) filter.category = category;

  const products = await Product.find(filter)
    .populate('brand', 'name slug')
    .select('brand species family lifeStage equipmentType')
    .lean();

  const brandsMap = new Map<string, { id: string; name: string; slug: string }>();
  const speciesSet = new Set<string>();
  const familiesSet = new Set<string>();
  const lifeStagesSet = new Set<string>();
  const equipmentTypesSet = new Set<string>();

  for (const product of products) {
    const brand = product.brand as unknown as { _id: string; name: string; slug: string };
    if (brand) {
      brandsMap.set(String(brand._id), { id: String(brand._id), name: brand.name, slug: brand.slug });
    }
    if (product.species) {
      for (const s of product.species) speciesSet.add(s);
    }
    if (product.family) familiesSet.add(product.family);
    if (product.lifeStage) lifeStagesSet.add(product.lifeStage);
    if (product.equipmentType) equipmentTypesSet.add(product.equipmentType);
  }

  return {
    brands: Array.from(brandsMap.values()).sort((a, b) => a.name.localeCompare(b.name)),
    species: Array.from(speciesSet).sort(),
    families: Array.from(familiesSet).sort(),
    lifeStages: Array.from(lifeStagesSet).sort(),
    equipmentTypes: Array.from(equipmentTypesSet).sort(),
  };
}

/**
 * Seed default categories if they don't exist.
 */
export async function seedCategories(): Promise<void> {
  const count = await Category.countDocuments();
  if (count > 0) return;

  const defaults: Partial<ICategory>[] = [
    {
      key: 'farmacos',
      name: { es: 'Farmacos', en: 'Pharmaceuticals' },
      description: {
        es: 'Medicamentos veterinarios de las mejores marcas internacionales',
        en: 'Veterinary pharmaceuticals from the best international brands',
      },
      families: [
        { es: 'Antibioticos', en: 'Antibiotics' },
        { es: 'Desparasitantes', en: 'Dewormers' },
        { es: 'Vitaminas', en: 'Vitamins' },
        { es: 'Antiinflamatorios', en: 'Anti-inflammatories' },
        { es: 'Suplementos', en: 'Supplements' },
      ],
      species: [
        { es: 'Caninos', en: 'Canines' },
        { es: 'Felinos', en: 'Felines' },
        { es: 'Bovinos', en: 'Bovines' },
        { es: 'Equinos', en: 'Equines' },
        { es: 'Aves', en: 'Poultry' },
        { es: 'Porcinos', en: 'Swine' },
      ],
    },
    {
      key: 'alimentos',
      name: { es: 'Alimentos', en: 'Food' },
      description: {
        es: 'Alimentos premium para mascotas y animales de produccion',
        en: 'Premium food for pets and production animals',
      },
      species: [
        { es: 'Caninos', en: 'Canines' },
        { es: 'Felinos', en: 'Felines' },
      ],
      lifeStages: [
        { es: 'Cachorro/Kitten', en: 'Puppy/Kitten' },
        { es: 'Adulto', en: 'Adult' },
        { es: 'Senior', en: 'Senior' },
        { es: 'Todas las etapas', en: 'All Life Stages' },
      ],
    },
    {
      key: 'equipos',
      name: { es: 'Equipos', en: 'Equipment' },
      description: {
        es: 'Equipos e instrumentos veterinarios profesionales',
        en: 'Professional veterinary equipment and instruments',
      },
      equipmentTypes: [
        { es: 'Diagnostico', en: 'Diagnostic' },
        { es: 'Cirugia', en: 'Surgery' },
        { es: 'Monitoreo', en: 'Monitoring' },
        { es: 'Laboratorio', en: 'Laboratory' },
      ],
    },
  ];

  await Category.insertMany(defaults);
  console.log('Default categories seeded');
}
