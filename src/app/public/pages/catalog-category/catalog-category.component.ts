import { Component, inject, signal, OnInit, computed, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { BreadcrumbComponent } from '../../../shared/components/breadcrumb/breadcrumb.component';
import { ProductCardComponent } from '../../components/product-card/product-card.component';
import { ApiService, ApiProduct, FilterValues } from '../../../shared/services/api.service';
import { I18nService } from '../../../shared/services/i18n.service';
import { SeoService } from '../../../shared/services/seo.service';
import { getCatalogSegment, getCategoryLabel, getCategorySlug, getHomeLabel } from '../../../shared/utils/route-helpers';

type ProductCategoryKey = 'farmacos' | 'alimentos' | 'equipos';

@Component({
  selector: 'app-catalog-category',
  standalone: true,
  imports: [BreadcrumbComponent, ProductCardComponent, RouterLink],
  templateUrl: './catalog-category.component.html',
  styleUrl: './catalog-category.component.scss'
})
export class CatalogCategoryComponent implements OnInit, OnDestroy {
  private api = inject(ApiService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private seo = inject(SeoService);
  i18n = inject(I18nService);

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

  selectedSpecies = signal('');
  selectedFamily = signal('');
  selectedLifeStage = signal('');
  selectedBrand = signal('');
  selectedEquipmentType = signal('');

  categoryDescription = signal('');

  filterValues = signal<FilterValues>({
    brands: [],
    species: [],
    families: [],
    lifeStages: [],
    equipmentTypes: []
  });

  private searchDebounceId: ReturnType<typeof setTimeout> | null = null;
  readonly categoryTabs: ProductCategoryKey[] = ['farmacos', 'alimentos', 'equipos'];

  activeFilters = computed(() => {
    const filters: { key: string; label: string }[] = [];
    if (this.searchTerm()) {
      filters.push({
        key: 'search',
        label: `${this.i18n.currentLang() === 'es' ? 'Busqueda' : 'Search'}: ${this.searchTerm()}`
      });
    }
    if (this.selectedSpecies()) filters.push({ key: 'species', label: this.selectedSpecies() });
    if (this.selectedFamily()) filters.push({ key: 'family', label: this.selectedFamily() });
    if (this.selectedLifeStage()) filters.push({ key: 'lifeStage', label: this.selectedLifeStage() });
    if (this.selectedBrand()) {
      const brand = this.filterValues().brands.find(item => item.id === this.selectedBrand());
      filters.push({ key: 'brand', label: brand?.name || this.selectedBrand() });
    }
    if (this.selectedEquipmentType()) filters.push({ key: 'equipmentType', label: this.selectedEquipmentType() });
    return filters;
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

  async ngOnInit(): Promise<void> {
    const url = this.route.snapshot.url;
    this.categorySlug = url[url.length - 1]?.path || '';
    this.restoreFiltersFromUrl();

    const lang = this.i18n.currentLang();
    const catSlugEs = getCategorySlug(this.categoryType, 'es');
    const catSlugEn = getCategorySlug(this.categoryType, 'en');

    this.seo.setHreflang(`/es/catalogo/${catSlugEs}`, `/en/catalog/${catSlugEn}`);

    await this.loadCategoryDescription();
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

  onSearchInput(term: string): void {
    this.searchTerm.set(term);
    this.currentPage.set(1);
    this.clearSearchDebounce();
    this.searchDebounceId = setTimeout(async () => {
      this.syncFiltersToUrl();
      await this.loadProducts();
    }, 280);
  }

  private clearSearchDebounce(): void {
    if (this.searchDebounceId) {
      clearTimeout(this.searchDebounceId);
      this.searchDebounceId = null;
    }
  }

  private async loadCategoryDescription(): Promise<void> {
    try {
      const categories = await this.api.getCategories();
      const category = categories.find(item => item.key === this.categoryType);
      if (category?.description) {
        this.categoryDescription.set(this.i18n.t(category.description));
      }
    } catch {
      // Non-critical
    }
  }

  private restoreFiltersFromUrl(): void {
    const params = this.route.snapshot.queryParams;
    if (params['brand']) this.selectedBrand.set(params['brand']);
    if (params['species']) this.selectedSpecies.set(params['species']);
    if (params['family']) this.selectedFamily.set(params['family']);
    if (params['lifeStage']) this.selectedLifeStage.set(params['lifeStage']);
    if (params['equipmentType']) this.selectedEquipmentType.set(params['equipmentType']);
    if (params['search']) this.searchTerm.set(params['search']);
    if (params['page']) {
      const page = parseInt(params['page'], 10);
      if (!isNaN(page) && page > 0) this.currentPage.set(page);
    }
  }

  private syncFiltersToUrl(): void {
    const queryParams: Record<string, string | null> = {
      brand: this.selectedBrand() || null,
      species: this.selectedSpecies() || null,
      family: this.selectedFamily() || null,
      lifeStage: this.selectedLifeStage() || null,
      equipmentType: this.selectedEquipmentType() || null,
      search: this.searchTerm() || null,
      page: this.currentPage() > 1 ? String(this.currentPage()) : null,
    };

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams,
      queryParamsHandling: 'merge',
      replaceUrl: true,
    });
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
        brand: this.selectedBrand() || undefined,
        species: this.selectedSpecies() || undefined,
        family: this.selectedFamily() || undefined,
        lifeStage: this.selectedLifeStage() || undefined,
        equipmentType: this.selectedEquipmentType() || undefined,
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

  async applyFilter(key: string, value: string): Promise<void> {
    this.clearSearchDebounce();

    switch (key) {
      case 'species':
        this.selectedSpecies.set(value);
        break;
      case 'family':
        this.selectedFamily.set(value);
        break;
      case 'lifeStage':
        this.selectedLifeStage.set(value);
        break;
      case 'brand':
        this.selectedBrand.set(value);
        break;
      case 'equipmentType':
        this.selectedEquipmentType.set(value);
        break;
      case 'search':
        this.searchTerm.set(value);
        break;
    }

    this.currentPage.set(1);
    this.syncFiltersToUrl();
    await this.loadProducts();
  }

  async removeFilter(key: string): Promise<void> {
    if (key === 'search') {
      this.searchTerm.set('');
      this.currentPage.set(1);
      this.syncFiltersToUrl();
      await this.loadProducts();
      return;
    }
    await this.applyFilter(key, '');
  }

  async clearFilters(): Promise<void> {
    this.clearSearchDebounce();
    this.selectedSpecies.set('');
    this.selectedFamily.set('');
    this.selectedLifeStage.set('');
    this.selectedBrand.set('');
    this.selectedEquipmentType.set('');
    this.searchTerm.set('');
    this.currentPage.set(1);
    this.syncFiltersToUrl();
    await this.loadProducts();
  }

  async goToPage(page: number): Promise<void> {
    this.currentPage.set(page);
    this.syncFiltersToUrl();
    await this.loadProducts();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  toggleMobileFilters(): void {
    this.mobileFiltersOpen.update(value => !value);
  }

  async applyMobileFilters(): Promise<void> {
    this.mobileFiltersOpen.set(false);
    this.syncFiltersToUrl();
    await this.loadProducts();
  }

  async retry(): Promise<void> {
    await this.loadProducts();
  }
}
