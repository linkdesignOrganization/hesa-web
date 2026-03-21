import { Location } from '@angular/common';
import { Component, ElementRef, OnDestroy, OnInit, ViewChild, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { BreadcrumbComponent } from '../../../shared/components/breadcrumb/breadcrumb.component';
import { ProductCardComponent } from '../../components/product-card/product-card.component';
import { ApiProduct, ApiService, FilterValues } from '../../../shared/services/api.service';
import { I18nService } from '../../../shared/services/i18n.service';
import { SeoService } from '../../../shared/services/seo.service';
import { getCatalogSegment, getCategoryLabel, getCategorySlug, getHomeLabel } from '../../../shared/utils/route-helpers';

type ProductCategoryKey = 'farmacos' | 'alimentos' | 'equipos';
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

interface CategorySummaryBadge {
  key: 'products' | 'brands' | 'species';
  label: string;
  value: number;
}

@Component({
  selector: 'app-catalog-category',
  standalone: true,
  imports: [BreadcrumbComponent, ProductCardComponent, RouterLink],
  templateUrl: './catalog-category.component.html',
  styleUrl: './catalog-category.component.scss'
})
export class CatalogCategoryComponent implements OnInit, OnDestroy {
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
  categorySlug = '';
  currentPage = signal(1);
  totalProducts = signal(0);
  totalPages = signal(0);
  pageSize = 24;
  mobileFiltersOpen = signal(false);
  searchTerm = signal('');
  Math = Math;

  selectedSpecies = signal<string[]>([]);
  selectedFamilies = signal<string[]>([]);
  selectedLifeStages = signal<string[]>([]);
  selectedBrandIds = signal<string[]>([]);
  selectedEquipmentTypes = signal<string[]>([]);

  categoryDescription = signal('');
  categoryBaseTotal = signal(0);

  filterValues = signal<FilterValues>({
    brands: [],
    species: [],
    families: [],
    lifeStages: [],
    equipmentTypes: []
  });

  private searchDebounceId: ReturnType<typeof setTimeout> | null = null;
  readonly categoryTabs: ProductCategoryKey[] = ['farmacos', 'alimentos', 'equipos'];

  activeFilters = computed<FilterChip[]>(() => {
    const filters: FilterChip[] = [];

    if (this.searchTerm()) {
      filters.push({
        key: 'search',
        label: `${this.i18n.currentLang() === 'es' ? 'Busqueda' : 'Search'}: ${this.searchTerm()}`
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

    if (this.categoryType === 'farmacos') {
      groups.push(
        {
          key: 'species',
          label: this.i18n.currentLang() === 'es' ? 'Especie' : 'Species',
          options: this.filterValues().species.map(species => ({
            value: species.es,
            label: this.getLocalizedOption(species)
          }))
        },
        {
          key: 'family',
          label: this.i18n.currentLang() === 'es' ? 'Familia' : 'Family',
          options: this.filterValues().families.map(family => ({
            value: family.es,
            label: this.getLocalizedOption(family)
          }))
        }
      );
    }

    if (this.categoryType === 'alimentos') {
      groups.push(
        {
          key: 'species',
          label: this.i18n.currentLang() === 'es' ? 'Especie' : 'Species',
          options: this.filterValues().species.map(species => ({
            value: species.es,
            label: this.getLocalizedOption(species)
          }))
        },
        {
          key: 'lifeStage',
          label: this.i18n.currentLang() === 'es' ? 'Etapa de vida' : 'Life stage',
          options: this.filterValues().lifeStages.map(lifeStage => ({
            value: lifeStage.es,
            label: this.getLocalizedOption(lifeStage)
          }))
        }
      );
    }

    if (this.categoryType === 'equipos') {
      groups.push({
        key: 'equipmentType',
        label: this.i18n.currentLang() === 'es' ? 'Tipo de equipo' : 'Equipment type',
        options: this.filterValues().equipmentTypes.map(equipmentType => ({
          value: equipmentType.es,
          label: this.getLocalizedOption(equipmentType)
        }))
      });
    }

    return groups.filter(group => group.options.length > 0);
  });

  categorySummaryBadges = computed<CategorySummaryBadge[]>(() => {
    const badges: CategorySummaryBadge[] = [
      {
        key: 'products',
        label: this.i18n.currentLang() === 'es' ? 'productos' : 'products',
        value: this.categoryBaseTotal()
      },
      {
        key: 'brands',
        label: this.i18n.currentLang() === 'es' ? 'marcas' : 'brands',
        value: this.filterValues().brands.length
      },
      {
        key: 'species',
        label: this.i18n.currentLang() === 'es' ? 'especies' : 'species',
        value: this.filterValues().species.length
      }
    ];

    return badges.filter(badge => badge.value > 0);
  });

  get categoryName(): string {
    return getCategoryLabel(this.categoryType, this.i18n.currentLang());
  }

  get breadcrumbs() {
    const lang = this.i18n.currentLang();
    return [
      { label: getHomeLabel(lang), url: this.i18n.getLangPrefix() },
      { label: lang === 'es' ? 'Catalogo' : 'Catalog', url: `${this.i18n.getLangPrefix()}/${getCatalogSegment(lang)}` },
      { label: this.categoryName }
    ];
  }

  get pagesArray(): number[] {
    return Array.from({ length: this.totalPages() }, (_, index) => index + 1);
  }

  get categoryType(): ProductCategoryKey {
    if (['farmacos', 'pharmaceuticals'].includes(this.categorySlug)) return 'farmacos';
    if (['alimentos', 'food'].includes(this.categorySlug)) return 'alimentos';
    return 'equipos';
  }

  get searchPlaceholder(): string {
    return this.i18n.currentLang() === 'es'
      ? `Buscar en ${this.categoryName.toLowerCase()}`
      : `Search within ${this.categoryName.toLowerCase()}`;
  }

  get heroDescription(): string {
    if (this.categoryDescription()) {
      return this.categoryDescription();
    }

    if (this.categoryType === 'farmacos') {
      return this.i18n.currentLang() === 'es'
        ? 'Soluciones farmaceuticas con familias terapéuticas claras, marcas activas y fichas listas para decision comercial.'
        : 'Pharmaceutical solutions with clear therapeutic families, active brands and datasheets ready for commercial review.';
    }

    if (this.categoryType === 'alimentos') {
      return this.i18n.currentLang() === 'es'
        ? 'Portafolio de alimentos formulados para especies y etapas especificas, con presentaciones faciles de comparar.'
        : 'Food portfolio tailored to species and life stages, with presentations that are easy to compare.';
    }

    return this.i18n.currentLang() === 'es'
      ? 'Equipos y herramientas con foco tecnico, informacion estructurada y soporte para escoger la solucion adecuada.'
      : 'Equipment and tools with a technical focus, structured information and support to choose the right solution.';
  }

  get resultsCountLabel(): string {
    return this.i18n.currentLang() === 'es'
      ? `${this.totalProducts()} resultados`
      : `${this.totalProducts()} results`;
  }

  async ngOnInit(): Promise<void> {
    const url = this.route.snapshot.url;
    this.categorySlug = url[url.length - 1]?.path || '';
    this.restoreFiltersFromUrl();

    const lang = this.i18n.currentLang();
    const catSlugEs = getCategorySlug(this.categoryType, 'es');
    const catSlugEn = getCategorySlug(this.categoryType, 'en');

    this.seo.setHreflang(`/es/catalogo/${catSlugEs}`, `/en/catalog/${catSlugEn}`);

    await this.loadCategoryMetadata();
    await this.loadFilters();
    await this.loadProducts();

    this.seo.setMetaTags({
      title: this.categoryName,
      description: this.heroDescription,
      url: `/${lang}/${getCatalogSegment(lang)}/${getCategorySlug(this.categoryType, lang)}`,
    });
  }

  ngOnDestroy(): void {
    this.seo.clearDynamicTags();
    this.clearSearchDebounce();
  }

  getCategoryLink(category: ProductCategoryKey): string {
    const lang = this.i18n.currentLang();
    return `/${lang}/${getCatalogSegment(lang)}/${getCategorySlug(category, lang)}`;
  }

  getCategoryIcon(category: ProductCategoryKey | ''): string {
    if (category === 'farmacos') return 'pill';
    if (category === 'alimentos') return 'pets';
    if (category === 'equipos') return 'biotech';
    return 'apps';
  }

  getLocalizedCategoryLabel(category: ProductCategoryKey): string {
    return getCategoryLabel(category, this.i18n.currentLang());
  }

  getCatalogLink(): string {
    const lang = this.i18n.currentLang();
    return `/${lang}/${getCatalogSegment(lang)}`;
  }

  getLocalizedOption(option: { es: string; en: string }): string {
    return this.i18n.currentLang() === 'es' ? option.es : (option.en || option.es);
  }

  isFilterSelected(key: FilterKey, value: string): boolean {
    return this.getSelectedValues(key).includes(value);
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
    this.selectedSpecies.set([]);
    this.selectedFamilies.set([]);
    this.selectedLifeStages.set([]);
    this.selectedBrandIds.set([]);
    this.selectedEquipmentTypes.set([]);
    this.searchTerm.set('');
    this.currentPage.set(1);
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

  private clearSearchDebounce(): void {
    if (this.searchDebounceId) {
      clearTimeout(this.searchDebounceId);
      this.searchDebounceId = null;
    }
  }

  private async loadCategoryMetadata(): Promise<void> {
    try {
      const categories = await this.api.getCategories();
      const category = categories.find(item => item.key === this.categoryType);
      if (!category) return;

      if (category.description) {
        this.categoryDescription.set(this.i18n.t(category.description));
      }

      const baseTotal = category.activeCount || category.totalCount || 0;
      this.categoryBaseTotal.set(baseTotal);

      if (baseTotal === 0) {
        const result = await this.api.getProducts({
          category: this.categoryType,
          limit: 1,
        });
        this.categoryBaseTotal.set(result.total);
      }
    } catch {
      // Non-critical
    }
  }

  private restoreFiltersFromUrl(): void {
    const params = this.route.snapshot.queryParams;
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

  private syncFiltersToUrl(): void {
    const queryParams: Record<string, string | null> = {
      brand: this.serializeParamValues(this.selectedBrandIds()),
      species: this.serializeParamValues(this.selectedSpecies()),
      family: this.serializeParamValues(this.selectedFamilies()),
      lifeStage: this.serializeParamValues(this.selectedLifeStages()),
      equipmentType: this.serializeParamValues(this.selectedEquipmentTypes()),
      search: this.searchTerm() || null,
      page: this.currentPage() > 1 ? String(this.currentPage()) : null,
    };

    const urlTree = this.router.createUrlTree([], {
      relativeTo: this.route,
      queryParams
    });

    this.location.replaceState(this.router.serializeUrl(urlTree));
  }

  private async loadFilters(): Promise<void> {
    try {
      const filters = await this.api.getFilterValues(this.categoryType);
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
        category: this.categoryType,
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
