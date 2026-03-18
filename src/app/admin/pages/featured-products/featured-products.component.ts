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

  async ngOnInit(): Promise<void> {
    await this.loadFeatured();
  }

  async loadFeatured(): Promise<void> {
    this.loading.set(true);
    try {
      const homeData = await this.api.getHomeData();
      this.products.set(homeData.featuredProducts as unknown as FeaturedProduct[]);
      this.selectedIds = new Set(homeData.featuredProducts.map((p: ApiProduct) => p._id));
    } catch {
      this.toast.error('Error al cargar productos destacados');
    }
    this.loading.set(false);
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
    if (this.allProducts.length === 0) {
      this.loadingAll.set(true);
      try {
        const result = await this.api.adminGetProducts({ limit: 200 });
        this.allProducts = result.data.filter(p => p.isActive);
      } catch {
        this.toast.error('Error al cargar productos');
      }
      this.loadingAll.set(false);
    }

    let filtered = this.allProducts;
    if (this.filterCategory()) {
      filtered = filtered.filter(p => p.category === this.filterCategory());
    }
    if (this.searchTerm.trim()) {
      const term = this.searchTerm.toLowerCase().trim();
      filtered = filtered.filter(p =>
        p.name.es.toLowerCase().includes(term) ||
        p.name.en.toLowerCase().includes(term)
      );
    }
    this.filteredAll.set(filtered);
  }

  applySelection(): void {
    const currentProducts = this.products();
    const currentIds = new Set(currentProducts.map(p => p._id));

    // Add newly selected products
    for (const id of this.selectedIds) {
      if (!currentIds.has(id)) {
        const product = this.allProducts.find(p => p._id === id);
        if (product) {
          currentProducts.push({
            _id: product._id,
            name: product.name,
            brand: typeof product.brand === 'object' ? product.brand : { name: '' },
            images: product.images,
            category: product.category,
          } as FeaturedProduct);
        }
      }
    }

    // Remove deselected products
    const finalProducts = currentProducts.filter(p => this.selectedIds.has(p._id));
    this.products.set(finalProducts);
    this.showModal.set(false);
  }
}
