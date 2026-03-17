import { Lang } from '../services/i18n.service';

const CATEGORY_SLUG_MAP: Record<string, Record<Lang, string>> = {
  farmacos: { es: 'farmacos', en: 'pharmaceuticals' },
  alimentos: { es: 'alimentos', en: 'food' },
  equipos: { es: 'equipos', en: 'equipment' },
};

const CATEGORY_LABEL_MAP: Record<string, Record<Lang, string>> = {
  farmacos: { es: 'Farmacos', en: 'Pharmaceuticals' },
  alimentos: { es: 'Alimentos', en: 'Food' },
  equipos: { es: 'Equipos', en: 'Equipment' },
};

/**
 * Returns the localized slug for a product category.
 * e.g. getCategorySlug('farmacos', 'en') => 'pharmaceuticals'
 */
export function getCategorySlug(category: string, lang: Lang): string {
  return CATEGORY_SLUG_MAP[category]?.[lang] || category;
}

/**
 * Returns the localized display label for a product category.
 * e.g. getCategoryLabel('farmacos', 'en') => 'Pharmaceuticals'
 */
export function getCategoryLabel(category: string, lang: Lang): string {
  return CATEGORY_LABEL_MAP[category]?.[lang] || category;
}

/**
 * Returns the localized catalog segment.
 * e.g. getCatalogSegment('en') => 'catalog'
 */
export function getCatalogSegment(lang: Lang): string {
  return lang === 'es' ? 'catalogo' : 'catalog';
}

/**
 * Returns the localized brands segment.
 * e.g. getBrandsSegment('en') => 'brands'
 */
export function getBrandsSegment(lang: Lang): string {
  return lang === 'es' ? 'marcas' : 'brands';
}

/**
 * Returns the localized search segment.
 * e.g. getSearchSegment('en') => 'search'
 */
export function getSearchSegment(lang: Lang): string {
  return lang === 'es' ? 'busqueda' : 'search';
}

/**
 * Returns the localized contact segment.
 * e.g. getContactSegment('en') => 'contact'
 */
export function getContactSegment(lang: Lang): string {
  return lang === 'es' ? 'contacto' : 'contact';
}

/**
 * Returns the localized "Home" label.
 */
export function getHomeLabel(lang: Lang): string {
  return lang === 'es' ? 'Inicio' : 'Home';
}

/**
 * Builds a product detail URL.
 */
export function buildProductUrl(category: string, slug: string, lang: Lang): string {
  return '/' + lang + '/' + getCatalogSegment(lang) + '/' + getCategorySlug(category, lang) + '/' + slug;
}
