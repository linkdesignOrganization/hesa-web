import { Component, inject, signal, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiService, ApiCategory } from '../../../shared/services/api.service';
import { ToastService } from '../../../shared/services/toast.service';
import { ConfirmModalComponent } from '../../components/confirm-modal/confirm-modal.component';

@Component({
  selector: 'app-admin-categories',
  standalone: true,
  imports: [FormsModule, ConfirmModalComponent],
  template: `
    <div class="categories-page">
      <h1 style="font-size: 24px; font-weight: 700; margin-bottom: 24px;">Categorias y Filtros</h1>
      @if (loading()) {
        <div class="category-editor-card">
          <div class="skeleton-block" style="height: 24px; width: 40%; margin-bottom: 16px;"></div>
          <div class="skeleton-block" style="height: 32px; width: 100%; margin-bottom: 12px;"></div>
          <div class="skeleton-block" style="height: 32px; width: 80%;"></div>
        </div>
      } @else {
        @for (cat of categories(); track cat._id) {
          <div class="category-editor-card">
            <div class="category-editor-card__header">
              <h2>{{ cat.name.es }}</h2>
              @if (cat.activeCount !== undefined) {
                <span class="category-editor-card__count">{{ cat.activeCount }} / {{ cat.totalCount }} activos</span>
              }
            </div>
            @if (cat.families && cat.families.length > 0) {
              <div class="category-editor-card__group">
                <h3>Familias farmaceuticas</h3>
                <div class="category-editor-card__tags">
                  @for (val of cat.families; track val.es) {
                    <span class="category-editor-card__tag">
                      {{ val.es }}
                      <button class="category-editor-card__tag-remove" aria-label="Remover" (click)="removeTag(cat, 'families', $index)">&times;</button>
                    </span>
                  }
                  <button class="category-editor-card__add" (click)="openAddModal(cat, 'families')">+</button>
                </div>
              </div>
            }
            @if (cat.species && cat.species.length > 0) {
              <div class="category-editor-card__group">
                <h3>Especies</h3>
                <div class="category-editor-card__tags">
                  @for (val of cat.species; track val.es) {
                    <span class="category-editor-card__tag">
                      {{ val.es }}
                      <button class="category-editor-card__tag-remove" aria-label="Remover" (click)="removeTag(cat, 'species', $index)">&times;</button>
                    </span>
                  }
                  <button class="category-editor-card__add" (click)="openAddModal(cat, 'species')">+</button>
                </div>
              </div>
            }
            @if (cat.lifeStages && cat.lifeStages.length > 0) {
              <div class="category-editor-card__group">
                <h3>Etapas de vida</h3>
                <div class="category-editor-card__tags">
                  @for (val of cat.lifeStages; track val.es) {
                    <span class="category-editor-card__tag">
                      {{ val.es }}
                      <button class="category-editor-card__tag-remove" aria-label="Remover" (click)="removeTag(cat, 'lifeStages', $index)">&times;</button>
                    </span>
                  }
                  <button class="category-editor-card__add" (click)="openAddModal(cat, 'lifeStages')">+</button>
                </div>
              </div>
            }
            @if (cat.equipmentTypes && cat.equipmentTypes.length > 0) {
              <div class="category-editor-card__group">
                <h3>Tipos de equipo</h3>
                <div class="category-editor-card__tags">
                  @for (val of cat.equipmentTypes; track val.es) {
                    <span class="category-editor-card__tag">
                      {{ val.es }}
                      <button class="category-editor-card__tag-remove" aria-label="Remover" (click)="removeTag(cat, 'equipmentTypes', $index)">&times;</button>
                    </span>
                  }
                  <button class="category-editor-card__add" (click)="openAddModal(cat, 'equipmentTypes')">+</button>
                </div>
              </div>
            }
          </div>
        }
      }
    </div>

    <!-- Add Tag Modal (replaces window.prompt) -->
    @if (showAddModal()) {
      <div class="modal-backdrop" (click)="closeAddModal()">
        <div class="modal-content" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <h2 style="font-size: 18px; font-weight: 700;">Agregar nuevo valor</h2>
            <button class="modal-close" (click)="closeAddModal()">&times;</button>
          </div>
          <div class="modal-body">
            <div class="form-group">
              <label class="form-label">Valor (espanol) <span style="color: var(--semantic-danger);">*</span></label>
              <input type="text" class="form-control" [(ngModel)]="addValueEs" placeholder="Nuevo valor en espanol" (keydown.enter)="submitAddTag()">
            </div>
            <div class="form-group">
              <label class="form-label">Traduccion (ingles)</label>
              <input type="text" class="form-control" [(ngModel)]="addValueEn" placeholder="Traduccion al ingles (opcional)" (keydown.enter)="submitAddTag()">
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn btn-outline" (click)="closeAddModal()">Cancelar</button>
            <button class="btn btn-primary" [disabled]="!addValueEs.trim() || savingTag()" (click)="submitAddTag()">
              @if (savingTag()) { <span class="spinner-sm"></span> Guardando... } @else { Guardar }
            </button>
          </div>
        </div>
      </div>
    }

    <!-- Confirm Remove Tag Modal (replaces window.confirm) -->
    @if (showRemoveConfirmModal()) {
      <app-confirm-modal
        title="Eliminar valor"
        [message]="removeConfirmMessage()"
        confirmText="Eliminar"
        variant="danger"
        [autoOpen]="true"
        (confirmed)="executeRemoveTag()"
        (cancelled)="cancelRemoveTag()" />
    }
  `,
  styles: [`
    .category-editor-card { background: white; border: 1px solid var(--neutral-200); border-radius: 12px; padding: 24px; margin-bottom: 20px; }
    .category-editor-card__header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; h2 { font-size: 18px; font-weight: 600; } }
    .category-editor-card__count { font-size: 13px; color: var(--neutral-400); }
    .category-editor-card__group { margin-bottom: 16px; h3 { font-size: 13px; font-weight: 600; text-transform: uppercase; color: var(--neutral-400); margin-bottom: 8px; } }
    .category-editor-card__tags { display: flex; flex-wrap: wrap; gap: 8px; }
    .category-editor-card__tag { display: inline-flex; align-items: center; gap: 6px; padding: 4px 12px; background: var(--neutral-50); border: 1px solid var(--neutral-200); border-radius: 20px; font-size: 13px; }
    .category-editor-card__tag-remove { background: none; border: none; cursor: pointer; color: var(--neutral-400); font-size: 16px; &:hover { color: var(--semantic-danger); } }
    .category-editor-card__add { width: 28px; height: 28px; border-radius: 50%; border: 1px dashed var(--neutral-300); background: none; cursor: pointer; font-size: 16px; color: var(--neutral-400); &:hover { border-color: var(--brand-primary); color: var(--brand-primary); } }
    .modal-backdrop { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); z-index: 500; display: flex; align-items: center; justify-content: center; }
    .modal-content { background: white; border-radius: 16px; max-width: 460px; width: 95%; max-height: 80vh; display: flex; flex-direction: column; }
    .modal-header { display: flex; justify-content: space-between; align-items: center; padding: 20px 24px; border-bottom: 1px solid var(--neutral-200); }
    .modal-close { background: none; border: none; font-size: 24px; color: var(--neutral-400); cursor: pointer; }
    .modal-body { padding: 20px 24px; overflow-y: auto; flex: 1; }
    .modal-footer { display: flex; justify-content: flex-end; gap: 12px; padding: 16px 24px; border-top: 1px solid var(--neutral-200); }
    .form-group { margin-bottom: 16px; }
    .spinner-sm { display: inline-block; width: 16px; height: 16px; border: 2px solid rgba(255,255,255,0.3); border-top-color: white; border-radius: 50%; animation: spin 0.6s linear infinite; margin-right: 8px; }
    @keyframes spin { to { transform: rotate(360deg); } }
  `]
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
      this.toast.error('Error al cargar las categorias');
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
