import { Component, inject, signal, OnInit, OnDestroy, computed } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BreadcrumbComponent } from '../../../shared/components/breadcrumb/breadcrumb.component';
import { ProductCardComponent } from '../../components/product-card/product-card.component';
import { ApiService, ApiProduct, FilterValues } from '../../../shared/services/api.service';
import { I18nService } from '../../../shared/services/i18n.service';
import { SeoService } from '../../../shared/services/seo.service';
import { getHomeLabel, getCatalogSegment } from '../../../shared/utils/route-helpers';

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

  // Filter state
  selectedCategory = signal<string>('');
  selectedBrand = signal<string>('');
  selectedSpecies = signal<string>('');
  selectedFamily = signal<string>('');
  selectedLifeStage = signal<string>('');
  selectedEquipmentType = signal<string>('');

  // Dynamic filter values from API
  filterValues = signal<FilterValues>({ brands: [], species: [], families: [], lifeStages: [], equipmentTypes: [] });

  activeFilters = computed(() => {
    const filters: { key: string; label: string }[] = [];
    if (this.selectedCategory()) filters.push({ key: 'category', label: this.selectedCategory() });
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
    const cat = this.selectedCategory();
    return !cat || cat === 'farmacos' || cat === 'alimentos';
  });

  showFamilyFilter = computed(() => {
    const cat = this.selectedCategory();
    return cat === 'farmacos';
  });

  showLifeStageFilter = computed(() => {
    const cat = this.selectedCategory();
    return cat === 'alimentos';
  });

  showEquipmentTypeFilter = computed(() => {
    const cat = this.selectedCategory();
    return cat === 'equipos';
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
    return Array.from({ length: this.totalPages() }, (_, i) => i + 1);
  }

  async ngOnInit(): Promise<void> {
    this.restoreFiltersFromUrl();
    await this.loadFilters();
    await this.loadProducts();

    // REQ-264f: SEO meta tags for general catalog
    const lang = this.i18n.currentLang();
    const catalogSegment = getCatalogSegment(lang);
    this.seo.setMetaTags({
      title: lang === 'es' ? 'Catalogo de Productos' : 'Product Catalog',
      description: lang === 'es'
        ? 'Catalogo completo de farmacos veterinarios, alimentos para animales y equipos veterinarios de HESA.'
        : 'Complete catalog of veterinary pharmaceuticals, animal food, and veterinary equipment from HESA.',
      url: `/${lang}/${catalogSegment}`,
    });
    this.seo.setHreflang('/es/catalogo', '/en/catalog');
  }

  ngOnDestroy(): void {
    this.seo.clearDynamicTags();
  }

  private restoreFiltersFromUrl(): void {
    const params = this.route.snapshot.queryParams;
    if (params['category']) this.selectedCategory.set(params['category']);
    if (params['brand']) this.selectedBrand.set(params['brand']);
    if (params['species']) this.selectedSpecies.set(params['species']);
    if (params['family']) this.selectedFamily.set(params['family']);
    if (params['lifeStage']) this.selectedLifeStage.set(params['lifeStage']);
    if (params['equipmentType']) this.selectedEquipmentType.set(params['equipmentType']);
    if (params['page']) {
      const page = parseInt(params['page'], 10);
      if (!isNaN(page) && page > 0) this.currentPage.set(page);
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
    switch (key) {
      case 'category':
        this.selectedCategory.set(value);
        this.selectedFamily.set('');
        this.selectedLifeStage.set('');
        this.selectedEquipmentType.set('');
        if (!value || value === 'equipos') {
          this.selectedSpecies.set('');
        }
        await this.loadFilters();
        break;
      case 'brand': this.selectedBrand.set(value); break;
      case 'species': this.selectedSpecies.set(value); break;
      case 'family': this.selectedFamily.set(value); break;
      case 'lifeStage': this.selectedLifeStage.set(value); break;
      case 'equipmentType': this.selectedEquipmentType.set(value); break;
    }
    this.currentPage.set(1);
    this.syncFiltersToUrl();
    await this.loadProducts();
  }

  async removeFilter(key: string): Promise<void> {
    await this.applyFilter(key, '');
  }

  async clearFilters(): Promise<void> {
    this.selectedCategory.set('');
    this.selectedBrand.set('');
    this.selectedSpecies.set('');
    this.selectedFamily.set('');
    this.selectedLifeStage.set('');
    this.selectedEquipmentType.set('');
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
    this.mobileFiltersOpen.update(v => !v);
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
