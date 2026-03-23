import { Component, inject, signal, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiService, ApiCategory } from '../../../shared/services/api.service';
import { ToastService } from '../../../shared/services/toast.service';
import { ConfirmModalComponent } from '../../components/confirm-modal/confirm-modal.component';

@Component({
  selector: 'app-admin-categories',
  standalone: true,
  imports: [FormsModule, ConfirmModalComponent],
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.scss'
})
export class AdminCategoriesComponent implements OnInit {
  private api = inject(ApiService);
  private toast = inject(ToastService);
  categories = signal<ApiCategory[]>([]);
  loading = signal(true);

  // Add Tag modal state
  showAddModal = signal(false);
  savingTag = signal(false);
  addValueEs = '';
  addValueEn = '';
  private addTargetCat: ApiCategory | null = null;
  private addTargetField = '';

  // Remove Tag confirm modal state
  showRemoveConfirmModal = signal(false);
  removeConfirmMessage = signal('');
  private removeTargetCat: ApiCategory | null = null;
  private removeTargetField = '';
  private removeTargetIndex = -1;

  async ngOnInit(): Promise<void> {
    await this.loadCategories();
  }

  private async loadCategories(): Promise<void> {
    this.loading.set(true);
    try {
      const data = await this.api.adminGetCategories();
      this.categories.set(data);
    } catch {
      this.toast.error('Error al cargar las categorías');
    }
    this.loading.set(false);
  }

  // --- Add Tag (inline modal instead of window.prompt) ---
  openAddModal(cat: ApiCategory, field: string): void {
    this.addTargetCat = cat;
    this.addTargetField = field;
    this.addValueEs = '';
    this.addValueEn = '';
    this.showAddModal.set(true);
  }

  closeAddModal(): void {
    this.showAddModal.set(false);
    this.addTargetCat = null;
    this.addTargetField = '';
  }

  async submitAddTag(): Promise<void> {
    if (!this.addValueEs.trim() || !this.addTargetCat) return;

    const cat = this.addTargetCat;
    const field = this.addTargetField;
    const valueEn = this.addValueEn.trim() || this.addValueEs.trim();
    const existing = (cat as unknown as Record<string, unknown>)[field] as { es: string; en: string }[] || [];
    const updated = [...existing, { es: this.addValueEs.trim(), en: valueEn }];

    this.savingTag.set(true);
    try {
      await this.api.adminUpdateCategory(cat.key, { [field]: updated });
      this.toast.success('Valor agregado correctamente');
      this.closeAddModal();
      await this.loadCategories();
    } catch {
      this.toast.error('Error al agregar el valor');
    }
    this.savingTag.set(false);
  }

  // --- Remove Tag (confirm modal instead of window.confirm) ---
  async removeTag(cat: ApiCategory, field: string, index: number): Promise<void> {
    const existing = (cat as unknown as Record<string, unknown>)[field] as { es: string; en: string }[] || [];
    const tagToRemove = existing[index];

    // REQ-273: Check if value is in use by products before deleting
    try {
      const productsResult = await this.api.getProducts({
        category: cat.key,
        [this.getProductFilterKey(field)]: tagToRemove.es,
        limit: 1,
      });
      const count = productsResult.total;
      if (count > 0) {
        this.removeTargetCat = cat;
        this.removeTargetField = field;
        this.removeTargetIndex = index;
        this.removeConfirmMessage.set(
          `El valor "${tagToRemove.es}" esta en uso por ${count} producto(s). Deseas eliminarlo de todos modos?`
        );
        this.showRemoveConfirmModal.set(true);
        return;
      }
    } catch {
      // If check fails, proceed with removal
    }

    await this.doRemoveTag(cat, field, index);
  }

  executeRemoveTag(): void {
    if (this.removeTargetCat && this.removeTargetField && this.removeTargetIndex >= 0) {
      this.doRemoveTag(this.removeTargetCat, this.removeTargetField, this.removeTargetIndex);
    }
    this.showRemoveConfirmModal.set(false);
  }

  cancelRemoveTag(): void {
    this.showRemoveConfirmModal.set(false);
    this.removeTargetCat = null;
  }

  private async doRemoveTag(cat: ApiCategory, field: string, index: number): Promise<void> {
    const existing = (cat as unknown as Record<string, unknown>)[field] as { es: string; en: string }[] || [];
    const updated = existing.filter((_, i) => i !== index);

    try {
      await this.api.adminUpdateCategory(cat.key, { [field]: updated });
      this.toast.success('Valor eliminado');
      await this.loadCategories();
    } catch {
      this.toast.error('Error al eliminar el valor');
    }
  }

  private getProductFilterKey(field: string): string {
    switch (field) {
      case 'families': return 'family';
      case 'species': return 'species';
      case 'lifeStages': return 'lifeStage';
      case 'equipmentTypes': return 'equipmentType';
      default: return field;
    }
  }
}
