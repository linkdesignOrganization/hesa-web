import { Component, inject, signal, OnInit } from '@angular/core';
import { ApiService, ApiCategory } from '../../../shared/services/api.service';
import { ToastService } from '../../../shared/services/toast.service';

@Component({
  selector: 'app-admin-categories',
  standalone: true,
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
                  <button class="category-editor-card__add" (click)="addTag(cat, 'families')">+</button>
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
                  <button class="category-editor-card__add" (click)="addTag(cat, 'species')">+</button>
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
                  <button class="category-editor-card__add" (click)="addTag(cat, 'lifeStages')">+</button>
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
                  <button class="category-editor-card__add" (click)="addTag(cat, 'equipmentTypes')">+</button>
                </div>
              </div>
            }
          </div>
        }
      }
    </div>
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
  `]
})
export class AdminCategoriesComponent implements OnInit {
  private api = inject(ApiService);
  private toast = inject(ToastService);
  categories = signal<ApiCategory[]>([]);
  loading = signal(true);

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

  async addTag(cat: ApiCategory, field: string): Promise<void> {
    const value = prompt('Nuevo valor (espanol):');
    if (!value) return;
    const valueEn = prompt('Traduccion (ingles):') || value;

    const existing = (cat as unknown as Record<string, unknown>)[field] as { es: string; en: string }[] || [];
    const updated = [...existing, { es: value, en: valueEn }];

    try {
      await this.api.adminUpdateCategory(cat.key, { [field]: updated });
      this.toast.success('Valor agregado correctamente');
      await this.loadCategories();
    } catch {
      this.toast.error('Error al agregar el valor');
    }
  }

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
        const confirmed = confirm(
          `El valor "${tagToRemove.es}" esta en uso por ${count} producto(s). ¿Deseas eliminarlo de todos modos?`
        );
        if (!confirmed) return;
      }
    } catch {
      // If check fails, proceed with warning
    }

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
