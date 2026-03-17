import { Component, inject, signal, OnInit, computed } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BreadcrumbComponent } from '../../../shared/components/breadcrumb/breadcrumb.component';
import { ProductCardComponent } from '../../components/product-card/product-card.component';
import { MockDataService, Product } from '../../../shared/services/mock-data.service';
import { I18nService } from '../../../shared/services/i18n.service';
import { getHomeLabel, getCatalogSegment } from '../../../shared/utils/route-helpers';

@Component({
  selector: 'app-catalog-category',
  standalone: true,
  imports: [BreadcrumbComponent, ProductCardComponent],
  templateUrl: './catalog-category.component.html',
  styleUrl: './catalog-category.component.scss'
})
export class CatalogCategoryComponent implements OnInit {
  private mockData = inject(MockDataService);
  private route = inject(ActivatedRoute);
  i18n = inject(I18nService);

  allProducts = signal<Product[]>([]);
  loading = signal(true);
  categorySlug = '';
  currentPage = signal(1);
  pageSize = 12;
  Math = Math;

  // Filters
  selectedSpecies = signal('');
  selectedFamily = signal('');
  selectedLifeStage = signal('');
  selectedBrand = signal('');
  selectedEquipmentType = signal('');

  filteredProducts = computed(() => {
    let products = this.allProducts().filter(p => p.isActive);
    if (this.selectedSpecies()) products = products.filter(p => p.species.includes(this.selectedSpecies()));
    if (this.selectedFamily()) products = products.filter(p => p.family === this.selectedFamily());
    if (this.selectedLifeStage()) products = products.filter(p => p.lifeStage === this.selectedLifeStage());
    if (this.selectedBrand()) products = products.filter(p => p.brand === this.selectedBrand());
    if (this.selectedEquipmentType()) products = products.filter(p => p.equipmentType === this.selectedEquipmentType());
    return products;
  });

  paginatedProducts = computed(() => {
    const start = (this.currentPage() - 1) * this.pageSize;
    return this.filteredProducts().slice(start, start + this.pageSize);
  });

  totalPages = computed(() => Math.ceil(this.filteredProducts().length / this.pageSize));

  get categoryName(): string {
    const lang = this.i18n.currentLang();
    const cat = this.mockData.getCategories().find(c => c.slug.es === this.categorySlug || c.slug.en === this.categorySlug);
    return cat ? cat.name[lang] : '';
  }

  get breadcrumbs() {
    const lang = this.i18n.currentLang();
    return [
      { label: getHomeLabel(lang), url: this.i18n.getLangPrefix() },
      { label: lang === 'es' ? 'Catalogo' : 'Catalog', url: this.i18n.getLangPrefix() + '/' + getCatalogSegment(lang) },
      { label: this.categoryName }
    ];
  }

  get uniqueBrands(): string[] {
    return [...new Set(this.allProducts().map(p => p.brand))].sort();
  }

  get activeFilters(): { key: string; label: string }[] {
    const filters: { key: string; label: string }[] = [];
    if (this.selectedSpecies()) filters.push({ key: 'species', label: this.selectedSpecies() });
    if (this.selectedFamily()) filters.push({ key: 'family', label: this.selectedFamily() });
    if (this.selectedLifeStage()) filters.push({ key: 'lifeStage', label: this.selectedLifeStage() });
    if (this.selectedBrand()) filters.push({ key: 'brand', label: this.selectedBrand() });
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
    const products = await this.mockData.getProductsByCategory(this.categorySlug);
    this.allProducts.set(products);
    this.loading.set(false);
  }

  applyFilter(key: string, value: string): void {
    switch (key) {
      case 'species': this.selectedSpecies.set(value); break;
      case 'family': this.selectedFamily.set(value); break;
      case 'lifeStage': this.selectedLifeStage.set(value); break;
      case 'brand': this.selectedBrand.set(value); break;
      case 'equipmentType': this.selectedEquipmentType.set(value); break;
    }
    this.currentPage.set(1);
  }

  removeFilter(key: string): void { this.applyFilter(key, ''); }

  clearFilters(): void {
    this.selectedSpecies.set('');
    this.selectedFamily.set('');
    this.selectedLifeStage.set('');
    this.selectedBrand.set('');
    this.selectedEquipmentType.set('');
    this.currentPage.set(1);
  }

  goToPage(page: number): void {
    this.currentPage.set(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
