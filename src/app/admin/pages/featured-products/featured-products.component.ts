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
  template: `
    <div>
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px;">
        <h1 style="font-size: 24px; font-weight: 700;">Productos Destacados</h1>
        <button class="btn btn-primary" (click)="showModal.set(true)">+ Agregar producto</button>
      </div>

      @if (loading()) {
        <div style="display: flex; flex-direction: column; gap: 12px;">
          @for (i of [1,2,3,4]; track i) { <div class="skeleton-block" style="height: 64px; border-radius: 8px;"></div> }
        </div>
      } @else if (products().length === 0) {
        <div style="text-align: center; padding: 60px 0; color: var(--neutral-400);">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--neutral-300)" stroke-width="1.5"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="m16 2 6 6"/><path d="M8 12h8"/></svg>
          <p style="margin-top: 16px;">No hay productos destacados. La seccion no se mostrara en el home.</p>
          <button class="btn btn-primary" style="margin-top: 16px;" (click)="showModal.set(true)">+ Agregar productos</button>
        </div>
      } @else {
        <div cdkDropList (cdkDropListDropped)="onDrop($event)" style="display: flex; flex-direction: column; gap: 12px;">
          @for (product of products(); track product._id) {
            <div class="featured-item" cdkDrag>
              <span class="featured-item__drag" cdkDragHandle>&#x2630;</span>
              <div class="featured-item__thumb">
                @if (product.images.length > 0) {
                  <img [src]="product.images[0]" [alt]="product.name.es" style="width: 100%; height: 100%; object-fit: cover; border-radius: 6px;">
                }
              </div>
              <div class="featured-item__info">
                <span class="featured-item__name">{{ product.name.es }}</span>
                <span class="featured-item__brand">{{ product.brand ? product.brand.name : '-' }}</span>
              </div>
              <button class="featured-item__remove" aria-label="Remover" (click)="removeProduct(product._id)">&times;</button>
            </div>
          }
        </div>
        <button class="btn btn-primary" style="margin-top: 20px;" [disabled]="saving()" (click)="save()">
          @if (saving()) { <span class="spinner-sm"></span> Guardando... } @else { Guardar orden }
        </button>
      }
    </div>

    <!-- Selection Modal -->
    @if (showModal()) {
      <div class="modal-backdrop" (click)="showModal.set(false)">
        <div class="modal-content" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <h2 style="font-size: 18px; font-weight: 700;">Seleccionar Productos</h2>
            <button class="modal-close" (click)="showModal.set(false)">&times;</button>
          </div>
          <div class="modal-body">
            <input type="text" class="form-control" placeholder="Buscar por nombre..." [(ngModel)]="searchTerm" (input)="filterAvailable()" style="margin-bottom: 16px;">
            <div class="modal-filters" style="margin-bottom: 12px; display: flex; gap: 8px;">
              <button class="btn btn-sm" [class.btn-primary]="filterCategory() === ''" (click)="filterCategory.set(''); filterAvailable()">Todos</button>
              <button class="btn btn-sm" [class.btn-primary]="filterCategory() === 'farmacos'" (click)="filterCategory.set('farmacos'); filterAvailable()">Farmacos</button>
              <button class="btn btn-sm" [class.btn-primary]="filterCategory() === 'alimentos'" (click)="filterCategory.set('alimentos'); filterAvailable()">Alimentos</button>
              <button class="btn btn-sm" [class.btn-primary]="filterCategory() === 'equipos'" (click)="filterCategory.set('equipos'); filterAvailable()">Equipos</button>
            </div>
            @if (loadingAll()) {
              <div style="text-align: center; padding: 24px; color: var(--neutral-400);">Cargando productos...</div>
            } @else {
              <div class="modal-list">
                @for (product of filteredAll(); track product._id) {
                  <label class="modal-item">
                    <input type="checkbox" [checked]="isSelected(product._id)" (change)="toggleSelect(product._id)">
                    <div class="modal-item__thumb">
                      @if (product.images.length > 0) {
                        <img [src]="product.images[0]" [alt]="product.name.es" style="width: 100%; height: 100%; object-fit: cover; border-radius: 4px;">
                      }
                    </div>
                    <div class="modal-item__info">
                      <span class="modal-item__name">{{ product.name.es }}</span>
                      <span class="modal-item__brand">{{ product.brand ? product.brand.name : '-' }} | {{ product.category }}</span>
                    </div>
                  </label>
                }
                @if (filteredAll().length === 0) {
                  <p style="text-align: center; padding: 24px; color: var(--neutral-400);">No se encontraron productos.</p>
                }
              </div>
            }
          </div>
          <div class="modal-footer">
            <button class="btn btn-outline" (click)="showModal.set(false)">Cancelar</button>
            <button class="btn btn-primary" (click)="applySelection()">Aplicar seleccion</button>
          </div>
        </div>
      </div>
    }
  `,
  styles: [`
    .featured-item { display: flex; align-items: center; gap: 12px; padding: 12px 16px; background: white; border: 1px solid var(--neutral-200); border-radius: 8px; cursor: default; }
    .featured-item__drag { color: var(--neutral-300); cursor: grab; font-size: 18px; }
    .featured-item__thumb { width: 40px; height: 40px; background: var(--neutral-100); border-radius: 6px; flex-shrink: 0; overflow: hidden; }
    .featured-item__info { flex: 1; }
    .featured-item__name { font-weight: 600; font-size: 14px; display: block; }
    .featured-item__brand { font-size: 12px; color: var(--neutral-500); }
    .featured-item__remove { background: none; border: none; font-size: 20px; color: var(--neutral-400); cursor: pointer; &:hover { color: var(--semantic-danger); } }
    .skeleton-block { background: linear-gradient(90deg, var(--neutral-100) 25%, var(--neutral-50) 50%, var(--neutral-100) 75%); background-size: 200% 100%; animation: shimmer 1.5s infinite; }
    @keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }
    .spinner-sm { display: inline-block; width: 16px; height: 16px; border: 2px solid rgba(255,255,255,0.3); border-top-color: white; border-radius: 50%; animation: spin 0.6s linear infinite; margin-right: 8px; }
    @keyframes spin { to { transform: rotate(360deg); } }
    .cdk-drag-preview { box-shadow: 0 4px 12px rgba(0,0,0,0.15); border-radius: 8px; background: white; }
    .cdk-drag-placeholder { opacity: 0.3; }
    .modal-backdrop { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); z-index: 500; display: flex; align-items: center; justify-content: center; }
    .modal-content { background: white; border-radius: 16px; max-width: 600px; width: 95%; max-height: 80vh; display: flex; flex-direction: column; }
    .modal-header { display: flex; justify-content: space-between; align-items: center; padding: 20px 24px; border-bottom: 1px solid var(--neutral-200); }
    .modal-close { background: none; border: none; font-size: 24px; color: var(--neutral-400); cursor: pointer; }
    .modal-body { padding: 20px 24px; overflow-y: auto; flex: 1; }
    .modal-footer { display: flex; justify-content: flex-end; gap: 12px; padding: 16px 24px; border-top: 1px solid var(--neutral-200); }
    .modal-list { display: flex; flex-direction: column; gap: 8px; max-height: 300px; overflow-y: auto; }
    .modal-item { display: flex; align-items: center; gap: 12px; padding: 8px 12px; border: 1px solid var(--neutral-200); border-radius: 8px; cursor: pointer; transition: background 0.15s; }
    .modal-item:hover { background: var(--neutral-50); }
    .modal-item__thumb { width: 32px; height: 32px; background: var(--neutral-100); border-radius: 4px; flex-shrink: 0; overflow: hidden; }
    .modal-item__info { flex: 1; }
    .modal-item__name { font-weight: 600; font-size: 13px; display: block; }
    .modal-item__brand { font-size: 11px; color: var(--neutral-500); }
  `]
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
