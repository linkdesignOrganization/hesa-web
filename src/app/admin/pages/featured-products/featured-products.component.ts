import { Component, inject, signal, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';
import { ApiService, ApiProduct } from '../../../shared/services/api.service';
import { ToastService } from '../../../shared/services/toast.service';

interface FeaturedProduct {
  _id: string;
  name: { es: string; en: string };
  brand: { name: string };
  images: string[];
  category: string;
}

@Component({
  selector: 'app-admin-featured-products',
  standalone: true,
  imports: [FormsModule, DragDropModule],
  templateUrl: './featured-products.component.html',
  styleUrl: './featured-products.component.scss'
})
export class AdminFeaturedProductsComponent implements OnInit {
  private api = inject(ApiService);
  private toast = inject(ToastService);

  products = signal<FeaturedProduct[]>([]);
  loading = signal(true);
  saving = signal(false);
  showModal = signal(false);
  loadingAll = signal(false);
  searchTerm = '';
  filterCategory = signal('');

  private allProducts: ApiProduct[] = [];
  filteredAll = signal<ApiProduct[]>([]);
  private selectedIds = new Set<string>();
  private readonly featuredProductPageSize = 100;

  async ngOnInit(): Promise<void> {
    await this.loadFeatured();
  }

  async loadFeatured(): Promise<void> {
    this.loading.set(true);
    try {
      const config = await this.api.adminGetHomeConfig();
      const featuredProducts = config.featuredProducts
        .filter((product): product is ApiProduct => this.isProductObject(product))
        .map(product => this.toFeaturedProduct(product));

      this.products.set(featuredProducts);
      this.selectedIds = new Set(
        config.featuredProducts.map(product => typeof product === 'string' ? product : product._id)
      );
    } catch {
      this.toast.error('Error al cargar productos destacados');
    }
    this.loading.set(false);
  }

  async openModal(): Promise<void> {
    this.showModal.set(true);
    await this.filterAvailable();
  }

  onDrop(event: CdkDragDrop<FeaturedProduct[]>): void {
    const items = [...this.products()];
    moveItemInArray(items, event.previousIndex, event.currentIndex);
    this.products.set(items);
  }

  removeProduct(id: string): void {
    this.products.update(list => list.filter(p => p._id !== id));
    this.selectedIds.delete(id);
  }

  async save(): Promise<void> {
    this.saving.set(true);
    try {
      const productIds = this.products().map(p => p._id);
      await this.api.adminUpdateFeaturedProducts(productIds);
      this.toast.success('Productos destacados actualizados');
    } catch {
      this.toast.error('Error al guardar');
    }
    this.saving.set(false);
  }

  isSelected(id: string): boolean {
    return this.selectedIds.has(id);
  }

  toggleSelect(id: string): void {
    if (this.selectedIds.has(id)) {
      this.selectedIds.delete(id);
    } else {
      this.selectedIds.add(id);
    }
  }

  async filterAvailable(): Promise<void> {
    await this.ensureAllProductsLoaded();

    let filtered = this.allProducts;
    if (this.filterCategory()) {
      filtered = filtered.filter(p => p.category === this.filterCategory());
    }
    if (this.searchTerm.trim()) {
      const term = this.normalizeSearch(this.searchTerm);
      filtered = filtered.filter(product => this.matchesSearch(product, term));
    }
    this.filteredAll.set(filtered);
  }

  applySelection(): void {
    const currentProducts = [...this.products().filter(product => this.selectedIds.has(product._id))];
    const currentIds = new Set(currentProducts.map(product => product._id));

    for (const id of this.selectedIds) {
      if (!currentIds.has(id)) {
        const product = this.allProducts.find(p => p._id === id);
        if (product) {
          currentProducts.push(this.toFeaturedProduct(product));
        }
      }
    }

    this.products.set(currentProducts);
    this.showModal.set(false);
  }

  private async ensureAllProductsLoaded(): Promise<void> {
    if (this.allProducts.length > 0 || this.loadingAll()) {
      return;
    }

    this.loadingAll.set(true);
    try {
      const firstPage = await this.api.adminGetProducts({ page: 1, limit: this.featuredProductPageSize });
      const pageRequests: Promise<{ data: ApiProduct[] }>[] = [];

      for (let page = 2; page <= firstPage.totalPages; page += 1) {
        pageRequests.push(
          this.api.adminGetProducts({ page, limit: this.featuredProductPageSize })
        );
      }

      const remainingPages = pageRequests.length > 0 ? await Promise.all(pageRequests) : [];
      const mergedProducts = [firstPage.data, ...remainingPages.map(page => page.data)].flat();

      const dedupedProducts = new Map<string, ApiProduct>();
      for (const product of mergedProducts) {
        if (product.isActive) {
          dedupedProducts.set(product._id, product);
        }
      }

      this.allProducts = Array.from(dedupedProducts.values()).sort((a, b) =>
        a.name.es.localeCompare(b.name.es, 'es', { sensitivity: 'base' })
      );
    } catch {
      this.toast.error('Error al cargar productos');
      this.allProducts = [];
    }
    this.loadingAll.set(false);
  }

  private toFeaturedProduct(product: ApiProduct): FeaturedProduct {
    return {
      _id: product._id,
      name: product.name,
      brand: product.brand ? { name: product.brand.name } : { name: '' },
      images: product.images,
      category: product.category,
    };
  }

  private isProductObject(value: string | ApiProduct): value is ApiProduct {
    return typeof value !== 'string' && !!value && typeof value._id === 'string' && !!value.name;
  }

  private matchesSearch(product: ApiProduct, term: string): boolean {
    const fields = [
      product.name.es,
      product.name.en,
      product.brand?.name || '',
      product.category,
      ...this.getCategorySearchTerms(product.category),
    ];

    return fields.some(field => this.normalizeSearch(field).includes(term));
  }

  private getCategorySearchTerms(category: ApiProduct['category']): string[] {
    switch (category) {
      case 'farmacos':
        return ['fármacos', 'farmacos', 'farmaco', 'pharmaceuticals'];
      case 'alimentos':
        return ['alimentos', 'alimento', 'foods', 'food'];
      case 'equipos':
        return ['equipos', 'equipo', 'equipment'];
      default:
        return [];
    }
  }

  private normalizeSearch(value: string): string {
    return value
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .trim();
  }
}
