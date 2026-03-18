import { Component, inject, signal, OnInit, computed, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BreadcrumbComponent } from '../../../shared/components/breadcrumb/breadcrumb.component';
import { ProductCardComponent } from '../../components/product-card/product-card.component';
import { ApiService, ApiProduct, ApiCategory, FilterValues } from '../../../shared/services/api.service';
import { I18nService } from '../../../shared/services/i18n.service';
import { SeoService } from '../../../shared/services/seo.service';
import { getHomeLabel, getCatalogSegment, getCategoryLabel, getCategorySlug } from '../../../shared/utils/route-helpers';

@Component({
  selector: 'app-catalog-category',
  standalone: true,
  imports: [BreadcrumbComponent, ProductCardComponent],
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
  Math = Math;

  // Filters
  selectedSpecies = signal('');
  selectedFamily = signal('');
  selectedLifeStage = signal('');
  selectedBrand = signal('');
  selectedEquipmentType = signal('');

  // REQ-080: Category description
  categoryDescription = signal('');

  filterValues = signal<FilterValues>({ brands: [], species: [], families: [], lifeStages: [], equipmentTypes: [] });

  get categoryName(): string {
    const lang = this.i18n.currentLang();
    return getCategoryLabel(this.categoryType, lang);
  }

  get breadcrumbs() {
    const lang = this.i18n.currentLang();
    return [
      { label: getHomeLabel(lang), url: this.i18n.getLangPrefix() },
      { label: lang === 'es' ? 'Catalogo' : 'Catalog', url: this.i18n.getLangPrefix() + '/' + getCatalogSegment(lang) },
      { label: this.categoryName }
    ];
  }

  get activeFilters(): { key: string; label: string }[] {
    const filters: { key: string; label: string }[] = [];
    if (this.selectedSpecies()) filters.push({ key: 'species', label: this.selectedSpecies() });
    if (this.selectedFamily()) filters.push({ key: 'family', label: this.selectedFamily() });
    if (this.selectedLifeStage()) filters.push({ key: 'lifeStage', label: this.selectedLifeStage() });
    if (this.selectedBrand()) {
      const brand = this.filterValues().brands.find(b => b.id === this.selectedBrand());
      filters.push({ key: 'brand', label: brand?.name || this.selectedBrand() });
    }
    if (this.selectedEquipmentType()) filters.push({ key: 'equipmentType', label: this.selectedEquipmentType() });
    return filters;
  }

  get pagesArray(): number[] {
    return Array.from({ length: this.totalPages() }, (_, i) => i + 1);
  }

  get categoryType(): string {
    if (['farmacos', 'pharmaceuticals'].includes(this.categorySlug)) return 'farmacos';
    if (['alimentos', 'food'].includes(this.categorySlug)) return 'alimentos';
    return 'equipos';
  }

  async ngOnInit(): Promise<void> {
    const url = this.route.snapshot.url;
    this.categorySlug = url[url.length - 1]?.path || '';
    this.restoreFiltersFromUrl();

    // BUG-005/BUG-006: Set SEO tags BEFORE API calls to preserve language context
    const lang = this.i18n.currentLang();
    const catName = this.categoryName;
    const catSlugEs = getCategorySlug(this.categoryType, 'es');
    const catSlugEn = getCategorySlug(this.categoryType, 'en');

    this.seo.setHreflang(
      `/es/catalogo/${catSlugEs}`,
      `/en/catalog/${catSlugEn}`
    );

    await this.loadCategoryDescription();
    await this.loadFilters();
    await this.loadProducts();

    // REQ-087: Update SEO meta tags after data is loaded (description may have been fetched)
    this.seo.setMetaTags({
      title: catName,
      description: this.categoryDescription() || (lang === 'es'
        ? `${catName} - Catalogo de productos veterinarios HESA`
        : `${catName} - HESA veterinary product catalog`),
      url: `/${lang}/${getCatalogSegment(lang)}/${getCategorySlug(this.categoryType, lang)}`,
    });
  }

  ngOnDestroy(): void {
    this.seo.clearDynamicTags();
  }

  // REQ-080: Load category description from API
  private async loadCategoryDescription(): Promise<void> {
    try {
      const categories = await this.api.getCategories();
      const cat = categories.find(c => c.key === this.categoryType);
      if (cat && cat.description) {
        this.categoryDescription.set(this.i18n.t(cat.description));
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
      case 'species': this.selectedSpecies.set(value); break;
      case 'family': this.selectedFamily.set(value); break;
      case 'lifeStage': this.selectedLifeStage.set(value); break;
      case 'brand': this.selectedBrand.set(value); break;
      case 'equipmentType': this.selectedEquipmentType.set(value); break;
    }
    this.currentPage.set(1);
    this.syncFiltersToUrl();
    await this.loadProducts();
  }

  async removeFilter(key: string): Promise<void> { await this.applyFilter(key, ''); }

  async clearFilters(): Promise<void> {
    this.selectedSpecies.set('');
    this.selectedFamily.set('');
    this.selectedLifeStage.set('');
    this.selectedBrand.set('');
    this.selectedEquipmentType.set('');
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

  async retry(): Promise<void> {
    await this.loadProducts();
  }
}
