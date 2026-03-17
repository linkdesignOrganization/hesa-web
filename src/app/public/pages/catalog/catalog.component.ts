import { Component, inject, signal, OnInit, computed } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BreadcrumbComponent } from '../../../shared/components/breadcrumb/breadcrumb.component';
import { ProductCardComponent } from '../../components/product-card/product-card.component';
import { MockDataService, Product } from '../../../shared/services/mock-data.service';
import { I18nService } from '../../../shared/services/i18n.service';
import { getHomeLabel } from '../../../shared/utils/route-helpers';

@Component({
  selector: 'app-catalog',
  standalone: true,
  imports: [BreadcrumbComponent, ProductCardComponent],
  templateUrl: './catalog.component.html',
  styleUrl: './catalog.component.scss'
})
export class CatalogComponent implements OnInit {
  private mockData = inject(MockDataService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  i18n = inject(I18nService);

  allProducts = signal<Product[]>([]);
  loading = signal(true);
  currentPage = signal(1);
  pageSize = 12;
  mobileFiltersOpen = signal(false);

  // Filter state
  selectedCategory = signal<string>('');
  selectedBrand = signal<string>('');
  selectedSpecies = signal<string>('');
  selectedFamily = signal<string>('');
  selectedLifeStage = signal<string>('');
  selectedEquipmentType = signal<string>('');

  filteredProducts = computed(() => {
    let products = this.allProducts().filter(p => p.isActive);
    if (this.selectedCategory()) {
      products = products.filter(p => p.category === this.selectedCategory());
    }
    if (this.selectedBrand()) {
      products = products.filter(p => p.brand === this.selectedBrand());
    }
    if (this.selectedSpecies()) {
      products = products.filter(p => p.species.includes(this.selectedSpecies()));
    }
    if (this.selectedFamily()) {
      products = products.filter(p => p.family === this.selectedFamily());
    }
    if (this.selectedLifeStage()) {
      products = products.filter(p => p.lifeStage === this.selectedLifeStage());
    }
    if (this.selectedEquipmentType()) {
      products = products.filter(p => p.equipmentType === this.selectedEquipmentType());
    }
    return products;
  });

  paginatedProducts = computed(() => {
    const start = (this.currentPage() - 1) * this.pageSize;
    return this.filteredProducts().slice(start, start + this.pageSize);
  });

  totalPages = computed(() => Math.ceil(this.filteredProducts().length / this.pageSize));
  Math = Math;

  get pagesArray(): number[] {
    return Array.from({ length: this.totalPages() }, (_, i) => i + 1);
  }

  activeFilters = computed(() => {
    const filters: { key: string; label: string }[] = [];
    if (this.selectedCategory()) filters.push({ key: 'category', label: this.selectedCategory() });
    if (this.selectedBrand()) filters.push({ key: 'brand', label: this.selectedBrand() });
    if (this.selectedSpecies()) filters.push({ key: 'species', label: this.selectedSpecies() });
    if (this.selectedFamily()) filters.push({ key: 'family', label: this.selectedFamily() });
    if (this.selectedLifeStage()) filters.push({ key: 'lifeStage', label: this.selectedLifeStage() });
    if (this.selectedEquipmentType()) filters.push({ key: 'equipmentType', label: this.selectedEquipmentType() });
    return filters;
  });

  // Adaptive filters: determine which secondary filters to show based on selected category
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

  get breadcrumbs() {
    const lang = this.i18n.currentLang();
    return [
      { label: getHomeLabel(lang), url: this.i18n.getLangPrefix() },
      { label: lang === 'es' ? 'Catalogo' : 'Catalog' }
    ];
  }

  get uniqueBrands(): string[] {
    let products = this.allProducts().filter(p => p.isActive);
    if (this.selectedCategory()) {
      products = products.filter(p => p.category === this.selectedCategory());
    }
    return [...new Set(products.map(p => p.brand))].sort();
  }

  async ngOnInit(): Promise<void> {
    const products = await this.mockData.getProducts();
    this.allProducts.set(products);
    this.loading.set(false);

    // Restore filters from URL query params
    this.restoreFiltersFromUrl();
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

  applyFilter(key: string, value: string): void {
    switch (key) {
      case 'category':
        this.selectedCategory.set(value);
        // Clear secondary filters when category changes (adaptive filters)
        this.selectedFamily.set('');
        this.selectedLifeStage.set('');
        this.selectedEquipmentType.set('');
        if (!value || value === 'equipos') {
          this.selectedSpecies.set('');
        }
        // Clear brand if it no longer exists in the filtered category
        if (this.selectedBrand()) {
          const availableBrands = this.uniqueBrands;
          if (!availableBrands.includes(this.selectedBrand())) {
            this.selectedBrand.set('');
          }
        }
        break;
      case 'brand': this.selectedBrand.set(value); break;
      case 'species': this.selectedSpecies.set(value); break;
      case 'family': this.selectedFamily.set(value); break;
      case 'lifeStage': this.selectedLifeStage.set(value); break;
      case 'equipmentType': this.selectedEquipmentType.set(value); break;
    }
    this.currentPage.set(1);
    this.syncFiltersToUrl();
  }

  removeFilter(key: string): void {
    this.applyFilter(key, '');
  }

  clearFilters(): void {
    this.selectedCategory.set('');
    this.selectedBrand.set('');
    this.selectedSpecies.set('');
    this.selectedFamily.set('');
    this.selectedLifeStage.set('');
    this.selectedEquipmentType.set('');
    this.currentPage.set(1);
    this.syncFiltersToUrl();
  }

  goToPage(page: number): void {
    this.currentPage.set(page);
    this.syncFiltersToUrl();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  toggleMobileFilters(): void {
    this.mobileFiltersOpen.update(v => !v);
  }

  applyMobileFilters(): void {
    this.mobileFiltersOpen.set(false);
    this.syncFiltersToUrl();
  }
}
