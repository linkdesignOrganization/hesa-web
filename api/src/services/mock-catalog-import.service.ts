import fs from 'fs/promises';
import path from 'path';
import { Brand } from '../models/brand.model';
import { Category } from '../models/category.model';
import { HomeConfig } from '../models/home-config.model';
import { Product } from '../models/product.model';
import { seedCategories } from './category.service';
import { generateProductSlugs } from '../utils/slug';

type CategoryKey = 'farmacos' | 'alimentos' | 'equipos';

interface MockBrandDefinition {
  name: string;
  slug: string;
  category: CategoryKey;
  dir?: string;
  country?: string;
  description?: { es: string; en: string };
}

interface CatalogEntry {
  fileName: string;
  productName: string;
  section?: string;
  subsection?: string;
}

interface AssetRecord {
  relativePath: string;
  fileName: string;
  folderName?: string;
  info?: CatalogEntry;
}

interface ImportedProductRecord {
  _id: string;
  category: CategoryKey;
  nameEs: string;
}

export interface MockCatalogImportSummary {
  brands: number;
  products: number;
  featuredProducts: number;
  featuredBrands: number;
  byCategory: Record<CategoryKey, number>;
}

const IMAGE_EXTENSIONS = new Set(['.png', '.jpg', '.jpeg', '.webp', '.svg']);
const IGNORED_FILE_NAMES = new Set(['.DS_Store', 'catalogo-productos.md']);
const FEATURED_BRAND_NAMES = [
  'Orion Pharma Animal Health',
  'Unimedical',
  'Biozoo',
  'New Born Animal Care',
  'Kruuse',
  'Europlex',
  'FionaVet',
  'Balance',
];

const FOOD_BRANDS: MockBrandDefinition[] = [
  { name: 'NutriSource', slug: 'nutrisource', category: 'alimentos', country: 'Estados Unidos' },
  { name: 'Balance', slug: 'balance', category: 'alimentos', country: 'Costa Rica' },
  { name: 'Dukan', slug: 'dukan', category: 'alimentos', country: 'Costa Rica' },
  { name: 'Duketas', slug: 'duketas', category: 'alimentos', country: 'Costa Rica' },
  { name: 'Dukat', slug: 'dukat', category: 'alimentos', country: 'Costa Rica' },
  { name: 'Bigotes', slug: 'bigotes', category: 'alimentos', country: 'Costa Rica' },
  { name: 'Gourmet Mix', slug: 'gourmet-mix', category: 'alimentos', country: 'Costa Rica' },
  { name: 'AcuaOro', slug: 'acuaoro', category: 'alimentos', country: 'Costa Rica' },
  { name: 'Rabbit Plus', slug: 'rabbit-plus', category: 'alimentos', country: 'Costa Rica' },
  { name: 'Pegasso', slug: 'pegasso', category: 'alimentos', country: 'Costa Rica' },
];

const PHARMA_BRANDS: MockBrandDefinition[] = [
  { name: 'Biozoo', slug: 'biozoo', category: 'farmacos', dir: 'biozoo' },
  { name: 'New Born Animal Care', slug: 'new-born', category: 'farmacos', dir: 'new-born' },
  { name: 'Orion Pharma Animal Health', slug: 'orion-pharma', category: 'farmacos', dir: 'orion-pharma' },
  { name: 'Unimedical', slug: 'unimedical', category: 'farmacos', dir: 'unimedical' },
  { name: 'Vemedim', slug: 'vemedim', category: 'farmacos', dir: 'vemedim' },
  { name: 'Zoofarma', slug: 'zoofarma', category: 'farmacos', dir: 'zoofarma' },
];

const EQUIPMENT_BRANDS: MockBrandDefinition[] = [
  { name: 'Emcoclavos S.A.', slug: 'emcoclavos', category: 'equipos', dir: 'emcoclavos' },
  { name: 'Europlex', slug: 'europlex', category: 'equipos', dir: 'europlex' },
  { name: 'FionaVet', slug: 'fionavet', category: 'equipos', dir: 'fionavet' },
  { name: 'Kruuse', slug: 'kruuse', category: 'equipos', dir: 'kruuse' },
  { name: 'Mustad', slug: 'mustad', category: 'equipos', dir: 'mustad' },
];

const FOOD_SPECIES_MAP: Record<string, { es: string; en: string }> = {
  perros: { es: 'Caninos', en: 'Canines' },
  gatos: { es: 'Felinos', en: 'Felines' },
  peces: { es: 'Peces', en: 'Fish' },
  conejos: { es: 'Conejos', en: 'Rabbits' },
  caballos: { es: 'Equinos', en: 'Equines' },
};

function normalizeKey(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

async function pathExists(targetPath: string): Promise<boolean> {
  try {
    await fs.access(targetPath);
    return true;
  } catch {
    return false;
  }
}

async function resolvePublicDir(): Promise<string> {
  const candidates = [
    path.resolve(__dirname, '../../../public'),
    path.resolve(__dirname, '../../public'),
  ];

  for (const candidate of candidates) {
    if (await pathExists(candidate)) {
      return candidate;
    }
  }

  throw new Error('No se encontró el directorio public para importar el catálogo mock');
}

function encodePublicPath(relativePath: string): string {
  return encodeURI('/' + relativePath.split(path.sep).join('/'));
}

async function parseCatalogMarkdown(markdownPath: string): Promise<Map<string, CatalogEntry>> {
  const entries = new Map<string, CatalogEntry>();
  const raw = await fs.readFile(markdownPath, 'utf8');
  let currentSection = '';
  let currentSubsection = '';

  for (const rawLine of raw.split(/\r?\n/)) {
    const line = rawLine.trim();

    if (line.startsWith('## ')) {
      currentSection = line.replace(/^## /, '').trim();
      currentSubsection = '';
      continue;
    }

    if (line.startsWith('### ')) {
      currentSubsection = line.replace(/^### /, '').trim();
      continue;
    }

    if (!line.startsWith('|')) continue;
    if (line.includes('|---|')) continue;

    const cells = line.split('|').map(cell => cell.trim()).filter(Boolean);
    if (cells.length < 2) continue;

    const fileName = cells[0];
    const extension = path.extname(fileName).toLowerCase();
    if (!IMAGE_EXTENSIONS.has(extension)) continue;

    entries.set(fileName, {
      fileName,
      productName: cells[1],
      section: currentSection || undefined,
      subsection: currentSubsection || undefined,
    });
  }

  return entries;
}

async function walkImageAssets(baseDir: string): Promise<string[]> {
  const results: string[] = [];

  async function visit(currentDir: string) {
    const entries = await fs.readdir(currentDir, { withFileTypes: true });
    for (const entry of entries) {
      const absolutePath = path.join(currentDir, entry.name);
      if (entry.isDirectory()) {
        await visit(absolutePath);
        continue;
      }

      if (IGNORED_FILE_NAMES.has(entry.name)) continue;
      const ext = path.extname(entry.name).toLowerCase();
      if (!IMAGE_EXTENSIONS.has(ext)) continue;
      const stats = await fs.stat(absolutePath);
      if (stats.size === 0) continue;
      results.push(absolutePath);
    }
  }

  await visit(baseDir);
  return results.sort((a, b) => a.localeCompare(b));
}

function extractBrandInfo(raw: string): { country?: string; descriptionEs?: string; descriptionEn?: string } {
  const countryMatch = raw.match(/- \*\*Pais de origen:\*\*\s*(.+)/);
  const descriptionEsMatch = raw.match(/## Descripcion \(ES\)\s*([\s\S]*?)## Descripcion \(EN\)/);
  const descriptionEnMatch = raw.match(/## Descripcion \(EN\)\s*([\s\S]*?)## Logo/);

  return {
    country: countryMatch?.[1]?.trim(),
    descriptionEs: descriptionEsMatch?.[1]?.trim().replace(/\s+/g, ' '),
    descriptionEn: descriptionEnMatch?.[1]?.trim().replace(/\s+/g, ' '),
  };
}

async function resolveBrandLogo(publicDir: string, directoryName?: string): Promise<string | undefined> {
  if (!directoryName) return undefined;
  const brandDir = path.join(publicDir, 'brands', directoryName);
  if (!(await pathExists(brandDir))) return undefined;

  const files = await fs.readdir(brandDir);
  const candidates = files
    .filter(file => !IGNORED_FILE_NAMES.has(file))
    .filter(file => IMAGE_EXTENSIONS.has(path.extname(file).toLowerCase()))
    .sort((a, b) => {
      const aLower = a.toLowerCase();
      const bLower = b.toLowerCase();
      const aLogoScore = aLower.includes('logo') ? 0 : 1;
      const bLogoScore = bLower.includes('logo') ? 0 : 1;
      if (aLogoScore !== bLogoScore) return aLogoScore - bLogoScore;

      const extOrder = (fileName: string) => {
        const ext = path.extname(fileName).toLowerCase();
        if (ext === '.svg') return 0;
        if (ext === '.webp') return 1;
        if (ext === '.png') return 2;
        if (ext === '.jpg' || ext === '.jpeg') return 3;
        return 4;
      };

      const extScore = extOrder(a) - extOrder(b);
      if (extScore !== 0) return extScore;
      return a.localeCompare(b);
    });

  if (!candidates.length) return undefined;
  return encodePublicPath(path.join('brands', directoryName, candidates[0]));
}

async function resolveBrandDetails(publicDir: string, definition: MockBrandDefinition): Promise<MockBrandDefinition & {
  description: { es: string; en: string };
  country: string;
  logo?: string;
}> {
  let country = definition.country || 'Internacional';
  let description = definition.description || {
      es: `${definition.name} forma parte del catálogo mock de HESA y se utiliza para pruebas de navegación, filtros y contenido comercial en la categoría de ${definition.category}.`,
    en: `${definition.name} is part of HESA's mock catalog and is used for navigation, filter, and commercial content testing in the ${definition.category} category.`,
  };

  if (definition.dir) {
    const infoPath = path.join(publicDir, 'brands', definition.dir, 'info.md');
    if (await pathExists(infoPath)) {
      const info = extractBrandInfo(await fs.readFile(infoPath, 'utf8'));
      country = info.country || country;
      if (info.descriptionEs && info.descriptionEn) {
        description = {
          es: info.descriptionEs,
          en: info.descriptionEn,
        };
      }
    }
  }

  const logo = await resolveBrandLogo(publicDir, definition.dir);

  return {
    ...definition,
    country,
    description,
    logo,
  };
}

function deriveFoodLifeStage(name: string, speciesKey: string): { es: string; en: string } {
  const lower = normalizeKey(name);

  if (['peces', 'conejos', 'caballos'].includes(speciesKey)) {
    return { es: 'Todas las etapas', en: 'All Life Stages' };
  }
  if (/(puppy|cachorro|kitten|gatitos)/.test(lower)) {
    return { es: 'Cachorro/Kitten', en: 'Puppy/Kitten' };
  }
  if (/senior/.test(lower)) {
    return { es: 'Senior', en: 'Senior' };
  }
  return { es: 'Adulto', en: 'Adult' };
}

function deriveFoodPresentations(name: string, speciesKey: string): string[] {
  const lower = normalizeKey(name);
  if (/(can|stew|salsa|pate|humed)/.test(lower)) {
    return ['Lata individual', 'Caja máster'];
  }
  if (speciesKey === 'peces') return ['Saco 10 kg', 'Saco 25 kg'];
  if (speciesKey === 'caballos') return ['Saco 20 kg', 'Saco 40 kg'];
  if (speciesKey === 'conejos') return ['Bolsa 1 kg', 'Bolsa 5 kg'];
  return ['Bolsa 2 kg', 'Bolsa 8 kg'];
}

function deriveFoodDescriptions(nameEs: string, brandName: string, speciesEs: string, lifeStageEs: string) {
  return {
    description: {
      es: `${nameEs} es un alimento mock de ${brandName} creado para pruebas del catálogo HESA. Su propuesta nutricional se orienta a ${speciesEs.toLowerCase()} en etapa ${lifeStageEs.toLowerCase()}, con enfoque en digestibilidad, energía sostenida y buena aceptación.`,
      en: `${nameEs} is a mock ${brandName} nutrition product created for HESA catalog testing. It is positioned for ${speciesEs.toLowerCase()} in the ${lifeStageEs.toLowerCase()} stage, with emphasis on digestibility, steady energy, and strong palatability.`,
    },
    ingredients: {
      es: `Proteína animal seleccionada, cereales funcionales, grasas estabilizadas, vitaminas, minerales y fibras fermentables en una formulación mock pensada para pruebas de contenido.`,
      en: `Selected animal protein, functional grains, stabilized fats, vitamins, minerals, and fermentable fibers in a mock formulation designed for content testing.`,
    },
    nutritionalInfo: {
      es: `Proteína: 28%. Grasa: 16%. Fibra: 3%. Humedad: 10%. Energía metabolizable estimada: 3,650 kcal/kg.`,
      en: `Protein: 28%. Fat: 16%. Fiber: 3%. Moisture: 10%. Estimated metabolizable energy: 3,650 kcal/kg.`,
    },
  };
}

function derivePharmaSpecies(name: string): string[] {
  const lower = normalizeKey(name);
  if (/(gato|felovite|apeticat|gatuno)/.test(lower)) return ['Felinos'];
  if (/(cachorro|perro|visorbits|sustile)/.test(lower)) return ['Caninos'];
  if (/equi/.test(lower)) return ['Equinos'];
  return ['Caninos', 'Felinos'];
}

function derivePharmaPresentations(name: string): string[] {
  const matches = name.match(/(\d+(?:\.\d+)?\s?(?:mg|ml|gr|oz))/gi) || [];
  const packaging = name.match(/(Caja x\d+|Blister x\d+|frasco de \d+\s?ml|frasco \d+\s?ml)/gi) || [];
  const values = [...matches, ...packaging].map(value => value.trim());
  return values.length ? Array.from(new Set(values)) : ['Unidad comercial'];
}

function derivePharmaDescriptions(nameEs: string, brandName: string, family: string, index: number) {
  return {
    description: {
      es: `${nameEs} es un fármaco mock de ${brandName} preparado para pruebas funcionales del sitio. Se presenta dentro de la familia ${family.toLowerCase()} y comunica una propuesta comercial enfocada en disponibilidad y consistencia terapéutica.`,
      en: `${nameEs} is a mock ${brandName} pharmaceutical created for site testing. It belongs to the ${family.toLowerCase()} family and communicates a commercial proposition focused on availability and therapeutic consistency.`,
    },
    composition: {
      es: `Composición mock de referencia para ${nameEs}: principio activo principal, excipientes funcionales y vehículo c.s.p. para fines de demostración.`,
      en: `Mock reference composition for ${nameEs}: main active ingredient, functional excipients, and vehicle q.s. for demonstration purposes.`,
    },
    indications: {
      es: `Indicado de forma mock para protocolos veterinarios relacionados con ${family.toLowerCase()}, bajo supervisión profesional y con adaptación según especie y condición clínica.`,
      en: `Mock indication for veterinary protocols related to ${family.toLowerCase()}, under professional supervision and adapted to species and clinical condition.`,
    },
    sanitaryRegistry: `MOCK-VET-${String(index + 1).padStart(4, '0')}`,
  };
}

function deriveEquipmentDescriptions(nameEs: string, brandName: string, equipmentType: string) {
  return {
    description: {
      es: `${nameEs} es un equipo mock de ${brandName} creado para pruebas del catálogo HESA. Se ubica en la línea de ${equipmentType.toLowerCase()} y comunica una propuesta profesional para clínicas, hospitales y distribuidores.`,
      en: `${nameEs} is a mock ${brandName} equipment product created for HESA catalog testing. It belongs to the ${equipmentType.toLowerCase()} line and communicates a professional proposition for clinics, hospitals, and distributors.`,
    },
    specifications: {
      es: `Especificaciones mock: estructura de uso clínico, materiales de grado profesional, configuración estable y compatibilidad con rutinas veterinarias de ${equipmentType.toLowerCase()}.`,
      en: `Mock specifications: clinical-use structure, professional-grade materials, stable configuration, and compatibility with veterinary ${equipmentType.toLowerCase()} workflows.`,
    },
    recommendedUses: {
      es: `Recomendado de forma mock para procedimientos, atención diaria y expansión operativa dentro de áreas de ${equipmentType.toLowerCase()}.`,
      en: `Mock-recommended for procedures, daily care, and operational expansion within ${equipmentType.toLowerCase()} environments.`,
    },
    warranty: {
      es: `Garantía mock de 12 meses con acompañamiento técnico y capacitación inicial para fines de demostración del sitio.`,
      en: `Mock 12-month warranty with technical guidance and initial training for site demonstration purposes.`,
    },
  };
}

function buildStorytelling(nameEs: string, brandName: string, relativePath: string) {
  const image = encodePublicPath(relativePath);
  return [
    {
      image,
      text: {
        es: `${nameEs} forma parte de una seleccion mock de ${brandName} creada para probar narrativa, fichas de producto y lectura extendida en el sitio.`,
        en: `${nameEs} is part of a mock ${brandName} selection created to test storytelling, product sheets, and extended reading experiences on the site.`,
      },
    },
  ];
}

function buildMeta(nameEs: string, brandName: string, category: CategoryKey) {
  const categoryLabels: Record<CategoryKey, { es: string; en: string }> = {
    farmacos: { es: 'Fármacos', en: 'Pharmaceuticals' },
    alimentos: { es: 'Alimentos', en: 'Food' },
    equipos: { es: 'Equipos', en: 'Equipment' },
  };

  return {
    metaTitle: {
      es: `${nameEs} | ${brandName} | HESA`,
      en: `${nameEs} | ${brandName} | HESA`,
    },
    metaDescription: {
      es: `${nameEs} dentro del catálogo mock de ${categoryLabels[category].es} de HESA para pruebas de navegación, detalle y filtros.`,
      en: `${nameEs} inside HESA's mock ${categoryLabels[category].en} catalog for navigation, detail, and filter testing.`,
    },
  };
}

async function pause(ms: number): Promise<void> {
  await new Promise(resolve => setTimeout(resolve, ms));
}

function isRetryableWriteError(error: unknown): boolean {
  if (!(error instanceof Error)) return false;
  return error.message.includes('16500') || error.message.toLowerCase().includes('batch write error');
}

async function withRetries<T>(fn: () => Promise<T>, attempts = 5, delayMs = 1200): Promise<T> {
  let lastError: unknown;

  for (let attempt = 0; attempt < attempts; attempt += 1) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      if (!isRetryableWriteError(error) || attempt === attempts - 1) {
        throw error;
      }
      await pause(delayMs * (attempt + 1));
    }
  }

  throw lastError;
}

async function insertInChunks<T extends object>(
  model: { insertMany: (docs: T[], options?: { ordered?: boolean }) => Promise<any[]> },
  docs: T[],
  chunkSize: number
): Promise<any[]> {
  const inserted: any[] = [];

  for (let index = 0; index < docs.length; index += chunkSize) {
    const chunk = docs.slice(index, index + chunkSize);
    const result = await withRetries(() => model.insertMany(chunk, { ordered: true }));
    inserted.push(...result);

    if (index + chunkSize < docs.length) {
      await pause(450);
    }
  }

  return inserted;
}

function ensureUniqueSlugs(
  usedSlugs: Set<string>,
  base: { es: string; en: string }
): { es: string; en: string } {
  let candidate = { ...base };
  let counter = 2;

  while (usedSlugs.has(candidate.es) || usedSlugs.has(candidate.en)) {
    candidate = {
      es: `${base.es}-${counter}`,
      en: `${base.en}-${counter}`,
    };
    counter += 1;
  }

  usedSlugs.add(candidate.es);
  usedSlugs.add(candidate.en);
  return candidate;
}

function createSyntheticPharmaAsset(baseAsset: AssetRecord, index: number): AssetRecord {
  const baseName = baseAsset.info?.productName || path.basename(baseAsset.fileName, path.extname(baseAsset.fileName));
  const syntheticName = `${baseName} Fórmula Clínica ${index + 1}`;
  return {
    ...baseAsset,
    info: {
      fileName: baseAsset.fileName,
      productName: syntheticName,
      section: baseAsset.info?.section || 'Suplementos y Vitaminas',
      subsection: baseAsset.info?.subsection,
    },
  };
}

function createSyntheticAsset(
  baseAsset: AssetRecord,
  index: number,
  suffix: string,
  fallbackSection: string
): AssetRecord {
  const baseName = baseAsset.info?.productName || path.basename(baseAsset.fileName, path.extname(baseAsset.fileName));
  return {
    ...baseAsset,
    info: {
      fileName: baseAsset.fileName,
      productName: `${baseName} ${suffix} ${index + 1}`,
      section: baseAsset.info?.section || fallbackSection,
      subsection: baseAsset.info?.subsection,
    },
  };
}

async function buildFoodAssets(publicDir: string): Promise<AssetRecord[]> {
  const baseDir = path.join(publicDir, 'Alimentos');
  const markdownEntries = await parseCatalogMarkdown(path.join(baseDir, 'catalogo-productos.md'));
  const files = await walkImageAssets(baseDir);

  const rawAssets = files.map(absolutePath => {
    const relativePath = path.relative(publicDir, absolutePath);
    const fileName = path.basename(absolutePath);
    const folderName = path.basename(path.dirname(absolutePath));
    return {
      relativePath,
      fileName,
      folderName,
      info: markdownEntries.get(fileName),
    };
  });

  const seen = new Set<string>();
  return rawAssets.filter(asset => {
    const productName = asset.info?.productName || path.basename(asset.fileName, path.extname(asset.fileName));
    const dedupeKey = `${normalizeKey(asset.folderName || '')}::${normalizeKey(productName)}`;
    if (seen.has(dedupeKey)) return false;
    seen.add(dedupeKey);
    return true;
  });
}

async function buildFlatAssets(baseDir: string, markdownPath: string, publicDir: string): Promise<AssetRecord[]> {
  const markdownEntries = await parseCatalogMarkdown(markdownPath);
  const files = await walkImageAssets(baseDir);

  return files.map(absolutePath => {
    const relativePath = path.relative(publicDir, absolutePath);
    const fileName = path.basename(absolutePath);
    return {
      relativePath,
      fileName,
      info: markdownEntries.get(fileName),
    };
  });
}

export async function importMockCatalog(): Promise<MockCatalogImportSummary> {
  const publicDir = await resolvePublicDir();
  await seedCategories();

  const [foodAssets, pharmaAssetsRaw, equipmentAssets] = await Promise.all([
    buildFoodAssets(publicDir),
    buildFlatAssets(path.join(publicDir, 'farmacos'), path.join(publicDir, 'farmacos', 'catalogo-productos.md'), publicDir),
    buildFlatAssets(path.join(publicDir, 'equipo'), path.join(publicDir, 'equipo', 'catalogo-productos.md'), publicDir),
  ]);

  const pharmaAssets = [...pharmaAssetsRaw];
  while (pharmaAssets.length < 20 && pharmaAssetsRaw.length > 0) {
    pharmaAssets.push(createSyntheticPharmaAsset(pharmaAssetsRaw[pharmaAssets.length % pharmaAssetsRaw.length], pharmaAssets.length - pharmaAssetsRaw.length));
  }

  const baseFoodAssets = [...foodAssets];
  while (foodAssets.length < 96 && baseFoodAssets.length > 0) {
    const syntheticIndex = foodAssets.length - baseFoodAssets.length;
    foodAssets.push(createSyntheticAsset(baseFoodAssets[syntheticIndex % baseFoodAssets.length], syntheticIndex, 'Seleccion Especial', 'PERROS'));
  }

  const brandDefinitions = [...FOOD_BRANDS, ...PHARMA_BRANDS, ...EQUIPMENT_BRANDS];
  const brandDocs = await Promise.all(brandDefinitions.map(def => resolveBrandDetails(publicDir, def)));
  const featuredBrandOrder = new Map(FEATURED_BRAND_NAMES.map((name, index) => [name, index + 1]));

  await withRetries(() => Product.deleteMany({}));
  await pause(600);
  await withRetries(() => Brand.deleteMany({}));
  await pause(600);

  const insertedBrands = await insertInChunks(
    Brand,
    brandDocs.map(brand => ({
      slug: brand.slug,
      name: brand.name,
      country: brand.country,
      categories: [brand.category],
      description: brand.description,
      logo: brand.logo,
      isFeatured: featuredBrandOrder.has(brand.name),
      featuredOrder: featuredBrandOrder.get(brand.name),
    })),
    5
  );

  const brandMap = new Map(insertedBrands.map(brand => [brand.name, brand]));
  const usedSlugs = new Set<string>();
  const importedProducts: ImportedProductRecord[] = [];

  const foods = await insertInChunks(Product, foodAssets.map((asset, index) => {
    const folderName = asset.folderName || '';
    const [speciesFolderRaw, brandNameRaw] = folderName.split(' - ').map(part => part.trim());
    const speciesKey = normalizeKey(speciesFolderRaw);
    const brandName = brandNameRaw || 'Balance';
    const brand = brandMap.get(brandName);
    const species = FOOD_SPECIES_MAP[speciesKey] || { es: 'Caninos', en: 'Canines' };
    const nameEs = asset.info?.productName || path.basename(asset.fileName, path.extname(asset.fileName));
    const nameEn = nameEs;
    const lifeStage = deriveFoodLifeStage(nameEs, speciesKey);
    const texts = deriveFoodDescriptions(nameEs, brandName, species.es, lifeStage.es);
    const slugs = ensureUniqueSlugs(usedSlugs, generateProductSlugs(nameEs, nameEn));
    const meta = buildMeta(nameEs, brandName, 'alimentos');

    return {
      slug: slugs,
      name: { es: nameEs, en: nameEn },
      brand: brand?._id || null,
      category: 'alimentos',
      species: [species.es],
      lifeStage: lifeStage.es,
      presentations: deriveFoodPresentations(nameEs, speciesKey),
      description: texts.description,
      ingredients: texts.ingredients,
      nutritionalInfo: texts.nutritionalInfo,
      images: [encodePublicPath(asset.relativePath)],
      isActive: true,
      isFeatured: false,
      storytelling: buildStorytelling(nameEs, brandName, asset.relativePath),
      ...meta,
      hasEnTranslation: true,
      createdAt: new Date(Date.now() + index),
    };
  }), 5);
  importedProducts.push(...foods.map(product => ({ _id: String(product._id), category: 'alimentos' as const, nameEs: product.name.es })));

  const pharmaBrands = PHARMA_BRANDS.map(brand => brandMap.get(brand.name)).filter(Boolean);
  const farmacos = await insertInChunks(Product, pharmaAssets.map((asset, index) => {
    const brand = pharmaBrands[index % pharmaBrands.length]!;
    const nameEs = asset.info?.productName || path.basename(asset.fileName, path.extname(asset.fileName));
    const nameEn = nameEs;
    const family = asset.info?.section || 'Suplementos y Vitaminas';
    const descriptions = derivePharmaDescriptions(nameEs, brand.name, family, index);
    const slugs = ensureUniqueSlugs(usedSlugs, generateProductSlugs(nameEs, nameEn));
    const meta = buildMeta(nameEs, brand.name, 'farmacos');

    return {
      slug: slugs,
      name: { es: nameEs, en: nameEn },
      brand: brand._id,
      category: 'farmacos',
      species: derivePharmaSpecies(nameEs),
      family,
      presentations: derivePharmaPresentations(nameEs),
      description: descriptions.description,
      composition: descriptions.composition,
      sanitaryRegistry: descriptions.sanitaryRegistry,
      indications: descriptions.indications,
      images: [encodePublicPath(asset.relativePath)],
      isActive: true,
      isFeatured: false,
      storytelling: buildStorytelling(nameEs, brand.name, asset.relativePath),
      ...meta,
      hasEnTranslation: true,
      createdAt: new Date(Date.now() + 200 + index),
    };
  }), 5);
  importedProducts.push(...farmacos.map(product => ({ _id: String(product._id), category: 'farmacos' as const, nameEs: product.name.es })));

  const equipmentBrands = EQUIPMENT_BRANDS.map(brand => brandMap.get(brand.name)).filter(Boolean);
  const equipos = await insertInChunks(Product, equipmentAssets.map((asset, index) => {
    const brand = equipmentBrands[index % equipmentBrands.length]!;
    const nameEs = asset.info?.productName || path.basename(asset.fileName, path.extname(asset.fileName));
    const nameEn = nameEs;
    const equipmentType = asset.info?.section || 'Diagnostico';
    const descriptions = deriveEquipmentDescriptions(nameEs, brand.name, equipmentType);
    const slugs = ensureUniqueSlugs(usedSlugs, generateProductSlugs(nameEs, nameEn));
    const meta = buildMeta(nameEs, brand.name, 'equipos');

    return {
      slug: slugs,
      name: { es: nameEs, en: nameEn },
      brand: brand._id,
      category: 'equipos',
      equipmentType,
      presentations: ['Unidad completa'],
      description: descriptions.description,
      specifications: descriptions.specifications,
      recommendedUses: descriptions.recommendedUses,
      warranty: descriptions.warranty,
      images: [encodePublicPath(asset.relativePath)],
      isActive: true,
      isFeatured: false,
      storytelling: buildStorytelling(nameEs, brand.name, asset.relativePath),
      ...meta,
      hasEnTranslation: true,
      createdAt: new Date(Date.now() + 400 + index),
    };
  }), 5);
  importedProducts.push(...equipos.map(product => ({ _id: String(product._id), category: 'equipos' as const, nameEs: product.name.es })));

  await withRetries(() => Category.findOneAndUpdate(
    { key: 'alimentos' },
    {
      $set: {
        species: [
          { es: 'Caninos', en: 'Canines' },
          { es: 'Felinos', en: 'Felines' },
          { es: 'Peces', en: 'Fish' },
          { es: 'Conejos', en: 'Rabbits' },
          { es: 'Equinos', en: 'Equines' },
        ],
      },
    }
  ));

  const pharmaFamilies = Array.from(new Set(pharmaAssets.map(asset => asset.info?.section).filter(Boolean) as string[]));
  await withRetries(() => Category.findOneAndUpdate(
    { key: 'farmacos' },
    {
      $set: {
        families: pharmaFamilies.map(family => ({ es: family, en: family })),
      },
    }
  ));

  const equipmentTypes = Array.from(new Set(equipmentAssets.map(asset => asset.info?.section).filter(Boolean) as string[]));
  await withRetries(() => Category.findOneAndUpdate(
    { key: 'equipos' },
    {
      $set: {
        equipmentTypes: equipmentTypes.map(type => ({ es: type, en: type })),
      },
    }
  ));

  const featuredProducts = [
    ...importedProducts.filter(product => product.category === 'farmacos').slice(0, 4),
    ...importedProducts.filter(product => product.category === 'alimentos').slice(0, 4),
    ...importedProducts.filter(product => product.category === 'equipos').slice(0, 4),
  ];

  for (let index = 0; index < featuredProducts.length; index += 1) {
    await withRetries(() => Product.findByIdAndUpdate(featuredProducts[index]._id, {
      $set: { isFeatured: true, featuredOrder: index + 1 },
    }));
  }

  const featuredBrandIds = FEATURED_BRAND_NAMES
    .map(name => brandMap.get(name))
    .filter(Boolean)
    .map(brand => String(brand!._id));

  let homeConfig = await HomeConfig.findOne();
  if (!homeConfig) {
    homeConfig = await HomeConfig.create({});
  }

  await withRetries(() => HomeConfig.findByIdAndUpdate(homeConfig!._id, {
    $set: {
      featuredProducts: featuredProducts.map(product => product._id),
      featuredBrands: featuredBrandIds,
    },
  }));

  return {
    brands: insertedBrands.length,
    products: importedProducts.length,
    featuredProducts: featuredProducts.length,
    featuredBrands: featuredBrandIds.length,
    byCategory: {
      farmacos: importedProducts.filter(product => product.category === 'farmacos').length,
      alimentos: importedProducts.filter(product => product.category === 'alimentos').length,
      equipos: importedProducts.filter(product => product.category === 'equipos').length,
    },
  };
}
