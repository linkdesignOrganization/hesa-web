import { Component, inject, signal, OnInit, OnDestroy, computed } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BreadcrumbComponent } from '../../../shared/components/breadcrumb/breadcrumb.component';
import { ProductCardComponent } from '../../components/product-card/product-card.component';
import { ApiService, ApiProduct, FilterValues } from '../../../shared/services/api.service';
import { I18nService } from '../../../shared/services/i18n.service';
import { SeoService } from '../../../shared/services/seo.service';
import { getCatalogSegment, getCategoryLabel, getCategorySlug, getHomeLabel } from '../../../shared/utils/route-helpers';

type CatalogCategoryKey = '' | 'farmacos' | 'alimentos' | 'equipos';

@Component({
  selector: 'app-catalog',
  standalone: true,
  imports: [BreadcrumbComponent, ProductCardComponent],
  templateUrl: './catalog.component.html',
  styleUrl: './catalog.component.scss'
})
export class CatalogComponent implements OnInit, OnDestroy {
  private api = inject(ApiService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private seo = inject(SeoService);
  i18n = inject(I18nService);

  products = signal<ApiProduct[]>([]);
  loading = signal(true);
  error = signal(false);
  currentPage = signal(1);
  totalProducts = signal(0);
  totalPages = signal(0);
  pageSize = 24;
  mobileFiltersOpen = signal(false);

  selectedCategory = signal<CatalogCategoryKey>('');
  selectedBrand = signal('');
  selectedSpecies = signal('');
  selectedFamily = signal('');
  selectedLifeStage = signal('');
  selectedEquipmentType = signal('');
  searchTerm = signal('');

  filterValues = signal<FilterValues>({
    brands: [],
    species: [],
    families: [],
    lifeStages: [],
    equipmentTypes: []
  });

  private searchDebounceId: ReturnType<typeof setTimeout> | null = null;

  readonly categoryTabs: Exclude<CatalogCategoryKey, ''>[] = ['farmacos', 'alimentos', 'equipos'];

  activeFilters = computed(() => {
    const filters: { key: string; label: string }[] = [];

    if (this.searchTerm()) {
      filters.push({
        key: 'search',
        label: `${this.i18n.currentLang() === 'es' ? 'Busqueda' : 'Search'}: ${this.searchTerm()}`
      });
    }

    if (this.selectedBrand()) {
      const brand = this.filterValues().brands.find(b => b.id === this.selectedBrand() || b.slug === this.selectedBrand());
      filters.push({ key: 'brand', label: brand?.name || this.selectedBrand() });
    }
    if (this.selectedSpecies()) filters.push({ key: 'species', label: this.selectedSpecies() });
    if (this.selectedFamily()) filters.push({ key: 'family', label: this.selectedFamily() });
    if (this.selectedLifeStage()) filters.push({ key: 'lifeStage', label: this.selectedLifeStage() });
    if (this.selectedEquipmentType()) filters.push({ key: 'equipmentType', label: this.selectedEquipmentType() });

    return filters;
  });

  showSpeciesFilter = computed(() => {
    const category = this.selectedCategory();
    return !category || category === 'farmacos' || category === 'alimentos';
  });

  showFamilyFilter = computed(() => this.selectedCategory() === 'farmacos');
  showLifeStageFilter = computed(() => this.selectedCategory() === 'alimentos');
  showEquipmentTypeFilter = computed(() => this.selectedCategory() === 'equipos');

  currentTheme = computed(() => {
    const category = this.selectedCategory();
    return category || 'all';
  });

  Math = Math;

  get breadcrumbs() {
    const lang = this.i18n.currentLang();
    return [
      { label: getHomeLabel(lang), url: this.i18n.getLangPrefix() },
      { label: lang === 'es' ? 'Catalogo' : 'Catalog' }
    ];
  }

  get pagesArray(): number[] {
    return Array.from({ length: this.totalPages() }, (_, index) => index + 1);
  }

  get heroTitle(): string {
    const lang = this.i18n.currentLang();
    const category = this.selectedCategory();
    if (!category) {
      return lang === 'es' ? 'Catalogo de productos' : 'Product catalog';
    }
    return getCategoryLabel(category, lang);
  }

  get heroDescription(): string {
    const lang = this.i18n.currentLang();
    const category = this.selectedCategory();

    if (category === 'farmacos') {
      return lang === 'es'
        ? 'Farmacos veterinarios con disponibilidad constante, marcas reconocidas y soporte comercial para mover el inventario correcto.'
        : 'Veterinary pharmaceuticals with reliable availability, trusted brands and commercial support to move the right inventory.';
    }

    if (category === 'alimentos') {
      return lang === 'es'
        ? 'Lineas de alimentacion con formulaciones especializadas, portafolio amplio y opciones para multiples especies y etapas.'
        : 'Food lines with specialized formulations, broad assortment and options for multiple species and life stages.';
    }

    if (category === 'equipos') {
      return lang === 'es'
        ? 'Equipos y soluciones para la practica veterinaria con marcas de respaldo y fichas tecnicas listas para consulta.'
        : 'Equipment and solutions for veterinary practice with trusted brands and technical information ready for review.';
    }

    return lang === 'es'
      ? 'Explore un catalogo curado para clinicas, pet shops, agroservicios y operaciones que necesitan productos confiables para cada categoria.'
      : 'Explore a curated catalog for clinics, pet shops, agro stores and operations that need reliable products across every category.';
  }

  get searchPlaceholder(): string {
    return this.i18n.currentLang() === 'es'
      ? 'Buscar por producto, marca o presentacion'
      : 'Search by product, brand or presentation';
  }

  async ngOnInit(): Promise<void> {
    this.restoreFiltersFromUrl();

    const lang = this.i18n.currentLang();
    const catalogSegment = getCatalogSegment(lang);
    this.seo.setMetaTags({
      title: lang === 'es' ? 'Catalogo de Productos' : 'Product Catalog',
      description: lang === 'es'
        ? 'Catalogo completo de farmacos veterinarios, alimentos para animales y equipos veterinarios de HESA.'
        : 'Complete catalog of veterinary pharmaceuticals, animal food, and veterinary equipment. HESA is a leading distributor in Costa Rica with 37+ years of experience.',
      url: `/${lang}/${catalogSegment}`,
    });
    this.seo.setHreflang('/es/catalogo', '/en/catalog');

    await this.loadFilters();
    await this.loadProducts();
  }

  ngOnDestroy(): void {
    this.seo.clearDynamicTags();
    this.clearSearchDebounce();
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

  async selectCategory(category: CatalogCategoryKey): Promise<void> {
    await this.applyFilter('category', category);
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

  private restoreFiltersFromUrl(): void {
    const params = this.route.snapshot.queryParams;
    if (params['category']) this.selectedCategory.set(params['category']);
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

  private clearSearchDebounce(): void {
    if (this.searchDebounceId) {
      clearTimeout(this.searchDebounceId);
      this.searchDebounceId = null;
    }
  }

  private syncFiltersToUrl(): void {
    const queryParams: Record<string, string | null> = {
      category: this.selectedCategory() || null,
      brand: this.selectedBrand() || null,
      species: this.selectedSpecies() || null,
      family: this.selectedFamily() || null,
      lifeStage: this.selectedLifeStage() || null,
      equipmentType: this.selectedEquipmentType() || null,
      search: this.searchTerm() || null,
      page: this.currentPage() > 1 ? String(this.currentPage()) : null
    };

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams,
      queryParamsHandling: 'merge',
      replaceUrl: true
    });
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
      case 'category':
        this.selectedCategory.set((value || '') as CatalogCategoryKey);
        this.selectedBrand.set('');
        this.selectedFamily.set('');
        this.selectedLifeStage.set('');
        this.selectedEquipmentType.set('');
        if (!value || value === 'equipos') {
          this.selectedSpecies.set('');
        }
        await this.loadFilters();
        break;
      case 'brand':
        this.selectedBrand.set(value);
        break;
      case 'species':
        this.selectedSpecies.set(value);
        break;
      case 'family':
        this.selectedFamily.set(value);
        break;
      case 'lifeStage':
        this.selectedLifeStage.set(value);
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
    this.selectedCategory.set('');
    this.selectedBrand.set('');
    this.selectedSpecies.set('');
    this.selectedFamily.set('');
    this.selectedLifeStage.set('');
    this.selectedEquipmentType.set('');
    this.searchTerm.set('');
    this.currentPage.set(1);
    this.syncFiltersToUrl();
    await this.loadFilters();
    await this.loadProducts();
  }

  async goToPage(page: number): Promise<void> {
    this.currentPage.set(page);
    this.syncFiltersToUrl();
    await this.loadProducts();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  toggleMobileFilters(): void {
    this.mobileFiltersOpen.update(current => !current);
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
