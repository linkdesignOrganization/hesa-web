import { Component, inject, signal, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';
import { ApiService, ApiBrand } from '../../../shared/services/api.service';
import { ToastService } from '../../../shared/services/toast.service';

@Component({
  selector: 'app-admin-featured-brands',
  standalone: true,
  imports: [FormsModule, DragDropModule],
  template: `
    <div>
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px;">
        <h1 style="font-size: 24px; font-weight: 700;">Marcas Destacadas</h1>
        <button class="btn btn-primary" (click)="openModal()">+ Agregar marca</button>
      </div>

      @if (loading()) {
        <div style="display: flex; flex-direction: column; gap: 12px;">
          @for (i of [1,2,3,4]; track i) { <div class="skeleton-block" style="height: 64px; border-radius: 8px;"></div> }
        </div>
      } @else if (brands().length === 0) {
        <div style="text-align: center; padding: 60px 0; color: var(--neutral-400);">
          <p>No hay marcas destacadas. La seccion no se mostrara en el home.</p>
          <button class="btn btn-primary" style="margin-top: 16px;" (click)="openModal()">+ Agregar marcas</button>
        </div>
      } @else {
        <div cdkDropList (cdkDropListDropped)="onDrop($event)" style="display: flex; flex-direction: column; gap: 12px;">
          @for (brand of brands(); track brand._id) {
            <div class="featured-item" cdkDrag>
              <span class="featured-item__drag" cdkDragHandle>&#x2630;</span>
              <div class="featured-item__logo">
                @if (brand.logo) {
                  <img [src]="brand.logo" [alt]="brand.name" style="width: 100%; height: 100%; object-fit: contain; border-radius: 50%;">
                } @else {
                  {{ brand.name.charAt(0) }}
                }
              </div>
              <div class="featured-item__info">
                <span class="featured-item__name">{{ brand.name }}</span>
                <span class="featured-item__brand">{{ brand.country }}</span>
              </div>
              <button class="featured-item__remove" aria-label="Remover" (click)="removeBrand(brand._id)">&times;</button>
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
            <h2 style="font-size: 18px; font-weight: 700;">Seleccionar Marcas</h2>
            <button class="modal-close" (click)="showModal.set(false)">&times;</button>
          </div>
          <div class="modal-body">
            <input type="text" class="form-control" placeholder="Buscar por nombre..." [(ngModel)]="searchTerm" (input)="filterAll()" style="margin-bottom: 16px;">
            @if (loadingAll()) {
              <div style="text-align: center; padding: 24px; color: var(--neutral-400);">Cargando marcas...</div>
            } @else {
              <div class="modal-list">
                @for (brand of filteredAll(); track brand._id) {
                  <label class="modal-item">
                    <input type="checkbox" [checked]="isSelected(brand._id)" (change)="toggleSelect(brand._id)">
                    <div class="modal-item__logo">
                      @if (brand.logo) {
                        <img [src]="brand.logo" [alt]="brand.name" style="width: 100%; height: 100%; object-fit: contain;">
                      } @else {
                        {{ brand.name.charAt(0) }}
                      }
                    </div>
                    <div class="modal-item__info">
                      <span class="modal-item__name">{{ brand.name }}</span>
                      <span class="modal-item__brand">{{ brand.country }}</span>
                    </div>
                  </label>
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
    .featured-item { display: flex; align-items: center; gap: 12px; padding: 12px 16px; background: white; border: 1px solid var(--neutral-200); border-radius: 8px; }
    .featured-item__drag { color: var(--neutral-300); cursor: grab; font-size: 18px; }
    .featured-item__logo { width: 40px; height: 40px; background: var(--neutral-100); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 700; color: var(--brand-primary); font-size: 16px; flex-shrink: 0; overflow: hidden; }
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
    .modal-item__logo { width: 32px; height: 32px; background: var(--neutral-100); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 700; color: var(--brand-primary); font-size: 14px; flex-shrink: 0; overflow: hidden; }
    .modal-item__info { flex: 1; }
    .modal-item__name { font-weight: 600; font-size: 13px; display: block; }
    .modal-item__brand { font-size: 11px; color: var(--neutral-500); }
  `]
})
export class AdminFeaturedBrandsComponent implements OnInit {
  private api = inject(ApiService);
  private toast = inject(ToastService);

  brands = signal<ApiBrand[]>([]);
  loading = signal(true);
  saving = signal(false);
  showModal = signal(false);
  loadingAll = signal(false);
  searchTerm = '';

  private allBrands: ApiBrand[] = [];
  filteredAll = signal<ApiBrand[]>([]);
  private selectedIds = new Set<string>();

  async ngOnInit(): Promise<void> {
    await this.loadFeatured();
  }

  async loadFeatured(): Promise<void> {
    this.loading.set(true);
    try {
      const homeData = await this.api.getHomeData();
      this.brands.set(homeData.featuredBrands);
      this.selectedIds = new Set(homeData.featuredBrands.map(b => b._id));
    } catch {
      this.toast.error('Error al cargar marcas destacadas');
    }
    this.loading.set(false);
  }

  onDrop(event: CdkDragDrop<ApiBrand[]>): void {
    const items = [...this.brands()];
    moveItemInArray(items, event.previousIndex, event.currentIndex);
    this.brands.set(items);
  }

  removeBrand(id: string): void {
    this.brands.update(list => list.filter(b => b._id !== id));
    this.selectedIds.delete(id);
  }

  async save(): Promise<void> {
    this.saving.set(true);
    try {
      const brandIds = this.brands().map(b => b._id);
      await this.api.adminUpdateFeaturedBrands(brandIds);
      this.toast.success('Marcas destacadas actualizadas');
    } catch {
      this.toast.error('Error al guardar');
    }
    this.saving.set(false);
  }

  async openModal(): Promise<void> {
    this.showModal.set(true);
    if (this.allBrands.length === 0) {
      this.loadingAll.set(true);
      try {
        this.allBrands = await this.api.adminGetBrands();
      } catch {
        this.toast.error('Error al cargar marcas');
      }
      this.loadingAll.set(false);
    }
    this.filterAll();
  }

  filterAll(): void {
    let filtered = this.allBrands;
    if (this.searchTerm.trim()) {
      const term = this.searchTerm.toLowerCase().trim();
      filtered = filtered.filter(b => b.name.toLowerCase().includes(term));
    }
    this.filteredAll.set(filtered);
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

  applySelection(): void {
    const currentBrands = this.brands();
    const currentIds = new Set(currentBrands.map(b => b._id));

    for (const id of this.selectedIds) {
      if (!currentIds.has(id)) {
        const brand = this.allBrands.find(b => b._id === id);
        if (brand) currentBrands.push(brand);
      }
    }

    const finalBrands = currentBrands.filter(b => this.selectedIds.has(b._id));
    this.brands.set(finalBrands);
    this.showModal.set(false);
  }
}
