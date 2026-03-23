import { Location } from '@angular/common';
import { Component, ElementRef, OnDestroy, OnInit, ViewChild, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BreadcrumbComponent } from '../../../shared/components/breadcrumb/breadcrumb.component';
import { ProductCardComponent } from '../../components/product-card/product-card.component';
import { ApiProduct, ApiService, FilterValues } from '../../../shared/services/api.service';
import { I18nService } from '../../../shared/services/i18n.service';
import { SeoService } from '../../../shared/services/seo.service';
import { getCatalogSegment, getCategoryLabel, getCategorySlug, getHomeLabel } from '../../../shared/utils/route-helpers';

type CatalogCategoryKey = '' | 'farmacos' | 'alimentos' | 'equipos';
type FilterKey = 'brand' | 'species' | 'family' | 'lifeStage' | 'equipmentType';

interface FilterChip {
  key: FilterKey | 'search';
  value?: string;
  label: string;
}

interface FilterGroup {
  key: FilterKey;
  label: string;
  options: Array<{
    value: string;
    label: string;
  }>;
}

interface CatalogSummaryBadge {
  key: 'products' | 'brands' | 'categories';
  label: string;
  value: number;
}

@Component({
  selector: 'app-catalog',
  standalone: true,
  imports: [BreadcrumbComponent, ProductCardComponent],
  templateUrl: './catalog.component.html',
  styleUrl: './catalog.component.scss'
})
export class CatalogComponent implements OnInit, OnDestroy {
  private api = inject(ApiService);
  private location = inject(Location);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private seo = inject(SeoService);
  i18n = inject(I18nService);
  @ViewChild('resultsStart') private resultsStart?: ElementRef<HTMLElement>;

  products = signal<ApiProduct[]>([]);
  loading = signal(true);
  error = signal(false);
  currentPage = signal(1);
  totalProducts = signal(0);
  totalPages = signal(0);
  pageSize = 12;
  mobileFiltersOpen = signal(false);
  catalogBaseTotal = signal(0);
  isMobileViewport = signal(typeof window !== 'undefined' ? window.innerWidth <= 767 : false);

  selectedCategory = signal<CatalogCategoryKey>('');
  selectedBrandIds = signal<string[]>([]);
  selectedSpecies = signal<string[]>([]);
  selectedFamilies = signal<string[]>([]);
  selectedLifeStages = signal<string[]>([]);
  selectedEquipmentTypes = signal<string[]>([]);
  searchTerm = signal('');

  filterValues = signal<FilterValues>({
    brands: [],
    species: [],
    families: [],
    lifeStages: [],
    equipmentTypes: []
  });

  private searchDebounceId: ReturnType<typeof setTimeout> | null = null;
  private readonly viewportResizeHandler = () => this.syncViewportMode();

  readonly categoryTabs: Exclude<CatalogCategoryKey, ''>[] = ['farmacos', 'alimentos', 'equipos'];

  activeFilters = computed<FilterChip[]>(() => {
    const filters: FilterChip[] = [];

    if (this.searchTerm()) {
      filters.push({
        key: 'search',
        label: `${this.i18n.currentLang() === 'es' ? 'Búsqueda' : 'Search'}: ${this.searchTerm()}`
      });
    }

    for (const value of this.selectedBrandIds()) {
      filters.push({ key: 'brand', value, label: this.getOptionLabel('brand', value) });
    }

    for (const value of this.selectedSpecies()) {
      filters.push({ key: 'species', value, label: this.getOptionLabel('species', value) });
    }

    for (const value of this.selectedFamilies()) {
      filters.push({ key: 'family', value, label: this.getOptionLabel('family', value) });
    }

    for (const value of this.selectedLifeStages()) {
      filters.push({ key: 'lifeStage', value, label: this.getOptionLabel('lifeStage', value) });
    }

    for (const value of this.selectedEquipmentTypes()) {
      filters.push({ key: 'equipmentType', value, label: this.getOptionLabel('equipmentType', value) });
    }

    return filters;
  });

  filterGroups = computed<FilterGroup[]>(() => {
    const groups: FilterGroup[] = [
      {
        key: 'brand',
        label: this.i18n.currentLang() === 'es' ? 'Marca' : 'Brand',
        options: this.filterValues().brands.map(brand => ({
          value: brand.id,
          label: brand.name
        }))
      }
    ];

    if (this.showSpeciesFilter() && this.filterValues().species.length > 0) {
      groups.push({
        key: 'species',
        label: this.i18n.currentLang() === 'es' ? 'Especie' : 'Species',
        options: this.filterValues().species.map(species => ({
          value: species.es,
          label: this.getLocalizedOption(species)
        }))
      });
    }

    if (this.showFamilyFilter() && this.filterValues().families.length > 0) {
      groups.push({
        key: 'family',
        label: this.i18n.currentLang() === 'es' ? 'Familia' : 'Family',
        options: this.filterValues().families.map(family => ({
          value: family.es,
          label: this.getLocalizedOption(family)
        }))
      });
    }

    if (this.showLifeStageFilter() && this.filterValues().lifeStages.length > 0) {
      groups.push({
        key: 'lifeStage',
        label: this.i18n.currentLang() === 'es' ? 'Etapa de vida' : 'Life stage',
        options: this.filterValues().lifeStages.map(lifeStage => ({
          value: lifeStage.es,
          label: this.getLocalizedOption(lifeStage)
        }))
      });
    }

    if (this.showEquipmentTypeFilter() && this.filterValues().equipmentTypes.length > 0) {
      groups.push({
        key: 'equipmentType',
        label: this.i18n.currentLang() === 'es' ? 'Tipo de equipo' : 'Equipment type',
        options: this.filterValues().equipmentTypes.map(equipmentType => ({
          value: equipmentType.es,
          label: this.getLocalizedOption(equipmentType)
        }))
      });
    }

    return groups;
  });

  catalogSummaryBadges = computed<CatalogSummaryBadge[]>(() => {
    const badges: CatalogSummaryBadge[] = [
      {
        key: 'products',
        label: this.i18n.currentLang() === 'es' ? 'productos' : 'products',
        value: this.catalogBaseTotal()
      },
      {
        key: 'brands',
        label: this.i18n.currentLang() === 'es' ? 'marcas' : 'brands',
        value: this.filterValues().brands.length
      },
      {
        key: 'categories',
        label: this.i18n.currentLang() === 'es' ? 'categorías' : 'categories',
        value: this.selectedCategory() ? 1 : this.categoryTabs.length
      }
    ];

    return badges.filter(badge => badge.value > 0);
  });

  currentTheme = computed(() => {
    const category = this.selectedCategory();
    return category || 'all';
  });

  Math = Math;

  get breadcrumbs() {
    const lang = this.i18n.currentLang();
    return [
      { label: getHomeLabel(lang), url: this.i18n.getLangPrefix() },
      { label: lang === 'es' ? 'Catálogo' : 'Catalog' }
    ];
  }

  get pagesArray(): number[] {
    return Array.from({ length: this.totalPages() }, (_, index) => index + 1);
  }

  get heroTitle(): string {
    const lang = this.i18n.currentLang();
    const category = this.selectedCategory();
    if (!category) {
      return lang === 'es' ? 'Catálogo de productos' : 'Product catalog';
    }
    return getCategoryLabel(category, lang);
  }

  get heroDescription(): string {
    const lang = this.i18n.currentLang();
    const category = this.selectedCategory();

    if (category === 'farmacos') {
      return lang === 'es'
        ? 'Fármacos veterinarios con disponibilidad constante, marcas reconocidas y soporte comercial para mover el inventario correcto.'
        : 'Veterinary pharmaceuticals with reliable availability, trusted brands and commercial support to move the right inventory.';
    }

    if (category === 'alimentos') {
      return lang === 'es'
        ? 'Líneas de alimentación con formulaciones especializadas, portafolio amplio y opciones para múltiples especies y etapas.'
        : 'Food lines with specialized formulations, broad assortment and options for multiple species and life stages.';
    }

    if (category === 'equipos') {
      return lang === 'es'
        ? 'Equipos y soluciones para la práctica veterinaria con marcas de respaldo y fichas técnicas listas para consulta.'
        : 'Equipment and solutions for veterinary practice with trusted brands and technical information ready for review.';
    }

    return lang === 'es'
      ? 'Explore un catálogo curado para clínicas, pet shops, agroservicios y operaciones que necesitan productos confiables para cada categoría.'
      : 'Explore a curated catalog for clinics, pet shops, agro stores and operations that need reliable products across every category.';
  }

  get searchPlaceholder(): string {
    return this.i18n.currentLang() === 'es'
      ? 'Buscar por producto, marca o presentación'
      : 'Search by product, brand or presentation';
  }

  get resultsCountLabel(): string {
    return this.i18n.currentLang() === 'es'
      ? `${this.totalProducts()} resultados`
      : `${this.totalProducts()} results`;
  }

  async ngOnInit(): Promise<void> {
    this.syncViewportMode();
    if (typeof window !== 'undefined') {
      window.addEventListener('resize', this.viewportResizeHandler);
    }
    this.restoreFiltersFromUrl();

    const lang = this.i18n.currentLang();
    const catalogSegment = getCatalogSegment(lang);
    this.seo.setMetaTags({
      title: lang === 'es' ? 'Catálogo de Productos' : 'Product Catalog',
      description: lang === 'es'
        ? 'Catálogo completo de fármacos veterinarios, alimentos para animales y equipos veterinarios de HESA.'
        : 'Complete catalog of veterinary pharmaceuticals, animal food, and veterinary equipment. HESA is a leading distributor in Costa Rica with 37+ years of experience.',
      url: `/${lang}/${catalogSegment}`,
    });
    this.seo.setHreflang('/es/catalogo', '/en/catalog');

    await this.loadCategoryMetadata();
    await this.loadFilters();
    await this.loadProducts();
  }

  ngOnDestroy(): void {
    this.seo.clearDynamicTags();
    this.clearSearchDebounce();
    if (typeof window !== 'undefined') {
      window.removeEventListener('resize', this.viewportResizeHandler);
    }
  }

  getLocalizedCategoryLabel(category: Exclude<CatalogCategoryKey, ''>): string {
    return getCategoryLabel(category, this.i18n.currentLang());
  }

  getCategoryLink(category: Exclude<CatalogCategoryKey, ''>): string {
    const lang = this.i18n.currentLang();
    return `/${lang}/${getCatalogSegment(lang)}/${getCategorySlug(category, lang)}`;
  }

  getCategoryIcon(category: CatalogCategoryKey): string {
    if (category === 'farmacos') return 'pill';
    if (category === 'alimentos') return 'pets';
    if (category === 'equipos') return 'biotech';
    return 'apps';
  }

  getLocalizedOption(option: { es: string; en: string }): string {
    return this.i18n.currentLang() === 'es' ? option.es : (option.en || option.es);
  }

  isFilterSelected(key: FilterKey, value: string): boolean {
    return this.getSelectedValues(key).includes(value);
  }

  showSpeciesFilter(): boolean {
    const category = this.selectedCategory();
    return !category || category === 'farmacos' || category === 'alimentos';
  }

  showFamilyFilter(): boolean {
    return this.selectedCategory() === 'farmacos';
  }

  showLifeStageFilter(): boolean {
    return this.selectedCategory() === 'alimentos';
  }

  showEquipmentTypeFilter(): boolean {
    return this.selectedCategory() === 'equipos';
  }

  private syncViewportMode(): void {
    if (typeof window === 'undefined') return;
    this.isMobileViewport.set(window.innerWidth <= 767);
  }

  async selectCategory(category: CatalogCategoryKey): Promise<void> {
    this.clearSearchDebounce();
    this.selectedCategory.set(category);
    this.clearCategoryScopedFilters(category);
    this.currentPage.set(1);
    await this.loadFilters();
    this.syncFiltersToUrl();
    await this.loadProducts();
    this.scrollToResults();
  }

  onSearchInput(term: string): void {
    this.searchTerm.set(term);
    this.currentPage.set(1);
    this.clearSearchDebounce();
    this.searchDebounceId = setTimeout(async () => {
      this.syncFiltersToUrl();
      await this.loadProducts();
    }, 280);
  }

  async toggleFilterValue(key: FilterKey, value: string, shouldLoad: boolean = true): Promise<void> {
    this.clearSearchDebounce();
    const nextValues = this.toggleListValue(this.getSelectedValues(key), value);
    this.setSelectedValues(key, nextValues);
    this.currentPage.set(1);

    if (!shouldLoad) return;

    this.syncFiltersToUrl();
    await this.loadProducts();
    this.scrollToResults();
  }

  async removeFilter(key: FilterKey | 'search', value?: string): Promise<void> {
    if (key === 'search') {
      this.searchTerm.set('');
      this.currentPage.set(1);
      this.syncFiltersToUrl();
      await this.loadProducts();
      return;
    }

    if (!value) return;

    this.setSelectedValues(
      key,
      this.getSelectedValues(key).filter(item => item !== value)
    );
    this.currentPage.set(1);
    this.syncFiltersToUrl();
    await this.loadProducts();
    this.scrollToResults();
  }

  async clearFilters(): Promise<void> {
    this.clearSearchDebounce();
    this.selectedCategory.set('');
    this.selectedBrandIds.set([]);
    this.selectedSpecies.set([]);
    this.selectedFamilies.set([]);
    this.selectedLifeStages.set([]);
    this.selectedEquipmentTypes.set([]);
    this.searchTerm.set('');
    this.currentPage.set(1);
    await this.loadFilters();
    this.syncFiltersToUrl();
    await this.loadProducts();
    this.scrollToResults();
  }

  async goToPage(page: number): Promise<void> {
    this.currentPage.set(page);
    this.syncFiltersToUrl();
    await this.loadProducts();
    this.scrollToResults();
  }

  toggleMobileFilters(): void {
    this.mobileFiltersOpen.update(value => !value);
  }

  async applyMobileFilters(): Promise<void> {
    this.mobileFiltersOpen.set(false);
  }

  async retry(): Promise<void> {
    await this.loadProducts();
  }

  private restoreFiltersFromUrl(): void {
    const params = this.route.snapshot.queryParams;
    const category = params['category'] as CatalogCategoryKey | undefined;
    if (category) this.selectedCategory.set(category);

    this.selectedBrandIds.set(this.parseParamValues(params['brand']));
    this.selectedSpecies.set(this.parseParamValues(params['species']));
    this.selectedFamilies.set(this.parseParamValues(params['family']));
    this.selectedLifeStages.set(this.parseParamValues(params['lifeStage']));
    this.selectedEquipmentTypes.set(this.parseParamValues(params['equipmentType']));

    if (params['search']) this.searchTerm.set(params['search']);
    if (params['page']) {
      const page = parseInt(params['page'], 10);
      if (!isNaN(page) && page > 0) this.currentPage.set(page);
    }
  }

  private clearSearchDebounce(): void {
    if (this.searchDebounceId) {
      clearTimeout(this.searchDebounceId);
      this.searchDebounceId = null;
    }
  }

  private syncFiltersToUrl(): void {
    const queryParams: Record<string, string | null> = {
      category: this.selectedCategory() || null,
      brand: this.serializeParamValues(this.selectedBrandIds()),
      species: this.serializeParamValues(this.selectedSpecies()),
      family: this.serializeParamValues(this.selectedFamilies()),
      lifeStage: this.serializeParamValues(this.selectedLifeStages()),
      equipmentType: this.serializeParamValues(this.selectedEquipmentTypes()),
      search: this.searchTerm() || null,
      page: this.currentPage() > 1 ? String(this.currentPage()) : null
    };

    const urlTree = this.router.createUrlTree([], {
      relativeTo: this.route,
      queryParams
    });

    this.location.replaceState(this.router.serializeUrl(urlTree));
  }

  private async loadCategoryMetadata(): Promise<void> {
    try {
      const categories = await this.api.getCategories();
      const baseTotal = categories.reduce((sum, category) => sum + (category.activeCount || category.totalCount || 0), 0);
      this.catalogBaseTotal.set(baseTotal);

      if (baseTotal === 0) {
        const result = await this.api.getProducts({ limit: 1 });
        this.catalogBaseTotal.set(result.total);
      }
    } catch {
      // Non-critical
    }
  }

  private async loadFilters(): Promise<void> {
    try {
      const category = this.selectedCategory() || undefined;
      const filters = await this.api.getFilterValues(category);
      this.filterValues.set(filters);
    } catch {
      console.error('Error loading filters');
    }
  }

  private async loadProducts(): Promise<void> {
    this.loading.set(true);
    this.error.set(false);

    try {
      const result = await this.api.getProducts({
        category: this.selectedCategory() || undefined,
        brand: this.selectedBrandIds().length > 0 ? this.selectedBrandIds() : undefined,
        species: this.selectedSpecies().length > 0 ? this.selectedSpecies() : undefined,
        family: this.selectedFamilies().length > 0 ? this.selectedFamilies() : undefined,
        lifeStage: this.selectedLifeStages().length > 0 ? this.selectedLifeStages() : undefined,
        equipmentType: this.selectedEquipmentTypes().length > 0 ? this.selectedEquipmentTypes() : undefined,
        search: this.searchTerm() || undefined,
        page: this.currentPage(),
        limit: this.pageSize,
      });
      this.products.set(result.data);
      this.totalProducts.set(result.total);
      this.totalPages.set(result.totalPages);
    } catch {
      this.error.set(true);
    } finally {
      this.loading.set(false);
    }
  }

  private clearCategoryScopedFilters(category: CatalogCategoryKey): void {
    if (category !== 'farmacos') {
      this.selectedFamilies.set([]);
    }

    if (category !== 'alimentos') {
      this.selectedLifeStages.set([]);
    }

    if (category !== 'equipos') {
      this.selectedEquipmentTypes.set([]);
    }

    if (category === 'equipos') {
      this.selectedSpecies.set([]);
    }
  }

  private getSelectedValues(key: FilterKey): string[] {
    switch (key) {
      case 'brand':
        return this.selectedBrandIds();
      case 'species':
        return this.selectedSpecies();
      case 'family':
        return this.selectedFamilies();
      case 'lifeStage':
        return this.selectedLifeStages();
      case 'equipmentType':
        return this.selectedEquipmentTypes();
    }
  }

  private setSelectedValues(key: FilterKey, values: string[]): void {
    switch (key) {
      case 'brand':
        this.selectedBrandIds.set(values);
        break;
      case 'species':
        this.selectedSpecies.set(values);
        break;
      case 'family':
        this.selectedFamilies.set(values);
        break;
      case 'lifeStage':
        this.selectedLifeStages.set(values);
        break;
      case 'equipmentType':
        this.selectedEquipmentTypes.set(values);
        break;
    }
  }

  private toggleListValue(values: string[], value: string): string[] {
    return values.includes(value)
      ? values.filter(item => item !== value)
      : [...values, value];
  }

  private parseParamValues(value: string | undefined): string[] {
    if (!value) return [];
    return value
      .split(',')
      .map(item => item.trim())
      .filter(Boolean);
  }

  private serializeParamValues(values: string[]): string | null {
    return values.length > 0 ? values.join(',') : null;
  }

  private getOptionLabel(key: FilterKey, value: string): string {
    if (key === 'brand') {
      const brand = this.filterValues().brands.find(item => item.id === value || item.slug === value);
      return brand?.name || value;
    }

    const categoryOptions = this.getCategoryOptions(key);
    return categoryOptions.find(option => option.es === value)?.[this.i18n.currentLang()] || value;
  }

  private getCategoryOptions(key: Exclude<FilterKey, 'brand'>): Array<{ es: string; en: string }> {
    if (key === 'species') return this.filterValues().species;
    if (key === 'family') return this.filterValues().families;
    if (key === 'lifeStage') return this.filterValues().lifeStages;
    return this.filterValues().equipmentTypes;
  }

  private scrollToResults(): void {
    if (typeof window === 'undefined') return;

    const target = this.resultsStart?.nativeElement;
    if (!target) return;

    const top = target.getBoundingClientRect().top + window.scrollY - 24;
    window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });
  }
}
