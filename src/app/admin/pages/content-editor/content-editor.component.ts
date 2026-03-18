import { Component, inject, signal, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService, ApiPageContent, ApiPageSection } from '../../../shared/services/api.service';
import { ToastService } from '../../../shared/services/toast.service';

@Component({
  selector: 'app-admin-content-editor',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div>
      <h1 style="font-size: 24px; font-weight: 700; margin-bottom: 24px;">Editor de Contenido — {{ pageLabel() }}</h1>

      @if (loading()) {
        <div style="display: flex; flex-direction: column; gap: 16px;">
          <div class="skeleton-block" style="height: 40px; border-radius: 10px;"></div>
          <div class="skeleton-block" style="height: 120px; border-radius: 10px;"></div>
          <div class="skeleton-block" style="height: 120px; border-radius: 10px;"></div>
        </div>
      } @else if (error()) {
        <div style="text-align: center; padding: 60px 0; color: var(--semantic-danger);">
          <p>Error al cargar el contenido.</p>
          <button class="btn btn-primary" style="margin-top: 16px;" (click)="loadContent()">Reintentar</button>
        </div>
      } @else {
        <!-- Hero Image (for nosotros, distribuidores) -->
        @if (pageKey() === 'nosotros' || pageKey() === 'distribuidores') {
          <div class="content-editor__image-section" style="margin-bottom: 24px;">
            <label class="form-label">Imagen Hero</label>
            @if (heroImage()) {
              <div class="content-editor__image-preview" [style.background-image]="'url(' + heroImage() + ')'">
                <button class="btn btn-outline btn-sm" (click)="imageInput.click()">Cambiar imagen</button>
              </div>
            } @else {
              <div class="content-editor__image-placeholder" (click)="imageInput.click()">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--neutral-300)" stroke-width="1.5"><rect width="18" height="18" x="3" y="3" rx="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>
                <p style="color: var(--neutral-400); margin-top: 8px; font-size: 13px;">Haz clic para subir imagen</p>
              </div>
            }
            <input #imageInput type="file" accept="image/jpeg,image/png,image/webp" style="display: none;" (change)="onImageSelected($event)">
          </div>
        }

        <!-- Language Tabs -->
        <div class="tabs-pill" style="margin-bottom: 24px;">
          <button class="tabs-pill__btn" [class.tabs-pill__btn--active]="activeLang() === 'es'" (click)="activeLang.set('es')">Espanol</button>
          <button class="tabs-pill__btn" [class.tabs-pill__btn--active]="activeLang() === 'en'" (click)="activeLang.set('en')">English</button>
        </div>

        <!-- Sections -->
        @for (section of sections(); track section.key) {
          <div class="product-form__section" style="margin-bottom: 20px;">
            <label class="form-label">{{ activeLang() === 'es' ? section.label.es : section.label.en }}</label>
            @if (section.type === 'text') {
              <input type="text" class="form-control" [ngModel]="activeLang() === 'es' ? section.value.es : section.value.en" (ngModelChange)="updateSectionValue(section.key, $event)">
            } @else {
              <textarea class="form-control" rows="4" [ngModel]="activeLang() === 'es' ? section.value.es : section.value.en" (ngModelChange)="updateSectionValue(section.key, $event)"></textarea>
            }
          </div>
        }

        <button class="btn btn-primary" [disabled]="saving()" (click)="save()">
          @if (saving()) { <span class="spinner-sm"></span> Guardando... } @else { Guardar cambios }
        </button>
      }
    </div>
  `,
  styles: [`
    .form-group { margin-bottom: 16px; }
    .skeleton-block { background: linear-gradient(90deg, var(--neutral-100) 25%, var(--neutral-50) 50%, var(--neutral-100) 75%); background-size: 200% 100%; animation: shimmer 1.5s infinite; }
    @keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }
    .spinner-sm { display: inline-block; width: 16px; height: 16px; border: 2px solid rgba(255,255,255,0.3); border-top-color: white; border-radius: 50%; animation: spin 0.6s linear infinite; margin-right: 8px; }
    @keyframes spin { to { transform: rotate(360deg); } }
    .content-editor__image-preview { height: 200px; background-size: cover; background-position: center; border-radius: 12px; display: flex; align-items: flex-end; justify-content: center; padding-bottom: 12px; }
    .content-editor__image-placeholder { height: 160px; background: var(--neutral-100); border: 2px dashed var(--neutral-200); border-radius: 12px; display: flex; flex-direction: column; align-items: center; justify-content: center; cursor: pointer; transition: border-color 0.2s; }
    .content-editor__image-placeholder:hover { border-color: var(--brand-primary); }
  `]
})
export class AdminContentEditorComponent implements OnInit {
  private api = inject(ApiService);
  private toast = inject(ToastService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  loading = signal(true);
  error = signal(false);
  saving = signal(false);
  activeLang = signal<'es' | 'en'>('es');
  pageKey = signal('');
  pageLabel = signal('');
  sections = signal<ApiPageSection[]>([]);
  heroImage = signal('');

  private static pageLabels: Record<string, string> = {
    nosotros: 'Nosotros',
    distribuidores: 'Distribuidores',
    contacto: 'Contacto',
    politicas: 'Politicas Comerciales',
  };

  async ngOnInit(): Promise<void> {
    // Extract pageKey from route path: contenido/nosotros -> nosotros
    const urlSegments = this.router.url.split('/');
    const key = urlSegments[urlSegments.length - 1] || 'nosotros';
    this.pageKey.set(key);
    this.pageLabel.set(AdminContentEditorComponent.pageLabels[key] || key);
    await this.loadContent();
  }

  async loadContent(): Promise<void> {
    this.loading.set(true);
    this.error.set(false);
    try {
      const content = await this.api.adminGetPageContent(this.pageKey());
      this.sections.set(content.sections || []);
      this.heroImage.set(content.heroImage || '');
    } catch {
      this.error.set(true);
    }
    this.loading.set(false);
  }

  updateSectionValue(key: string, value: string): void {
    this.sections.update(sections =>
      sections.map(s => {
        if (s.key !== key) return s;
        const lang = this.activeLang();
        return {
          ...s,
          value: {
            ...s.value,
            [lang]: value,
          },
        };
      })
    );
  }

  async onImageSelected(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    try {
      const content = await this.api.adminUploadContentImage(this.pageKey(), file);
      this.heroImage.set(content.heroImage || '');
      this.toast.success('Imagen actualizada');
    } catch {
      this.toast.error('Error al subir la imagen');
    }
    input.value = '';
  }

  async save(): Promise<void> {
    this.saving.set(true);
    try {
      await this.api.adminUpdatePageContent(this.pageKey(), {
        sections: this.sections(),
      });
      this.toast.success('Contenido actualizado correctamente');
    } catch {
      this.toast.error('Error al guardar los cambios');
    }
    this.saving.set(false);
  }
}
