import { Component, inject, signal, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';
import { ApiService, ApiBrand } from '../../../shared/services/api.service';
import { ToastService } from '../../../shared/services/toast.service';

@Component({
  selector: 'app-admin-featured-brands',
  standalone: true,
  imports: [FormsModule, DragDropModule],
  templateUrl: './featured-brands.component.html',
  styleUrl: './featured-brands.component.scss'
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
