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
  species: { es: string; en: string }[];
  families: { es: string; en: string }[];
  lifeStages: { es: string; en: string }[];
  equipmentTypes: { es: string; en: string }[];
}> {
  const filter: Record<string, unknown> = { isActive: true };
  if (category) filter.category = category;

  // Get brands from actual products
  const products = await Product.find(filter)
    .populate('brand', 'name slug')
    .select('brand')
    .lean();

  const brandsMap = new Map<string, { id: string; name: string; slug: string }>();
  for (const product of products) {
    const brand = product.brand as unknown as { _id: string; name: string; slug: string };
    if (brand) {
      brandsMap.set(String(brand._id), { id: String(brand._id), name: brand.name, slug: brand.slug });
    }
  }

  // Get species, families, lifeStages, equipmentTypes from CATEGORIES (source of truth)
  const categoryFilter: Record<string, unknown> = {};
  if (category) categoryFilter.key = category;
  const categories = await Category.find(categoryFilter).lean();

  const speciesMap = new Map<string, { es: string; en: string }>();
  const familiesMap = new Map<string, { es: string; en: string }>();
  const lifeStagesMap = new Map<string, { es: string; en: string }>();
  const equipmentTypesMap = new Map<string, { es: string; en: string }>();

  for (const cat of categories) {
    if (cat.species) {
      for (const s of cat.species) speciesMap.set(s.es, s);
    }
    if (cat.families) {
      for (const f of cat.families) familiesMap.set(f.es, f);
    }
    if (cat.lifeStages) {
      for (const l of cat.lifeStages) lifeStagesMap.set(l.es, l);
    }
    if (cat.equipmentTypes) {
      for (const e of cat.equipmentTypes) equipmentTypesMap.set(e.es, e);
    }
  }

  return {
    brands: Array.from(brandsMap.values()).sort((a, b) => a.name.localeCompare(b.name)),
    species: Array.from(speciesMap.values()).sort((a, b) => a.es.localeCompare(b.es)),
    families: Array.from(familiesMap.values()).sort((a, b) => a.es.localeCompare(b.es)),
    lifeStages: Array.from(lifeStagesMap.values()).sort((a, b) => a.es.localeCompare(b.es)),
    equipmentTypes: Array.from(equipmentTypesMap.values()).sort((a, b) => a.es.localeCompare(b.es)),
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
      name: { es: 'Fármacos', en: 'Pharmaceuticals' },
      description: {
        es: 'Medicamentos veterinarios de las mejores marcas internacionales',
        en: 'Veterinary pharmaceuticals from the best international brands',
      },
      families: [
        { es: 'Antibióticos', en: 'Antibiotics' },
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
        es: 'Alimentos premium para mascotas y animales de producción',
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
        { es: 'Diagnóstico', en: 'Diagnostic' },
        { es: 'Cirugía', en: 'Surgery' },
        { es: 'Monitoreo', en: 'Monitoring' },
        { es: 'Laboratorio', en: 'Laboratory' },
      ],
    },
  ];

  await Category.insertMany(defaults);
  console.log('Default categories seeded');
}
