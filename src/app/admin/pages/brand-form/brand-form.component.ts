import { Component, signal, inject, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HasUnsavedChanges } from '../../../shared/guards/unsaved-changes.guard';
import { ApiService, ApiBrand } from '../../../shared/services/api.service';
import { ToastService } from '../../../shared/services/toast.service';

@Component({
  selector: 'app-admin-brand-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `
    <div class="product-form-page">
      <div class="product-form-page__header">
        <h1>{{ isEditing() ? 'Editar Marca' : 'Crear Marca' }}</h1>
        <div class="product-form-page__actions">
          <button class="btn btn-outline-gray" (click)="onCancel()">Cancelar</button>
          <button class="btn btn-primary" [disabled]="saving()" (click)="onSubmit()">
            {{ saving() ? 'Guardando...' : (isEditing() ? 'Guardar cambios' : 'Guardar marca') }}
          </button>
        </div>
      </div>

      <form class="product-form" [formGroup]="brandForm" (ngSubmit)="onSubmit()">
        <div class="product-form__section">
          <h2 class="product-form__section-title">Informacion de la Marca</h2>
          <div class="form-grid">
            <div class="form-group">
              <label class="form-label" for="brand-name">Nombre <span class="required">*</span></label>
              <input type="text" id="brand-name" class="form-control" [class.is-invalid]="isFieldInvalid('name')" formControlName="name" placeholder="Nombre de la marca" (blur)="onFieldBlur('name')">
              @if (isFieldInvalid('name')) {
                <div class="form-error" role="alert">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                  {{ getFieldError('name') }}
                </div>
              }
            </div>
            <div class="form-group">
              <label class="form-label" for="brand-country">Pais de origen <span class="required">*</span></label>
              <select id="brand-country" class="form-select" [class.is-invalid]="isFieldInvalid('country')" formControlName="country" (blur)="onFieldBlur('country')">
                <option value="" disabled>Seleccionar pais</option>
                <option value="Estados Unidos">Estados Unidos</option>
                <option value="Canada">Canada</option>
                <option value="Alemania">Alemania</option>
                <option value="Francia">Francia</option>
                <option value="Suiza">Suiza</option>
                <option value="Holanda">Holanda</option>
                <option value="Italia">Italia</option>
                <option value="Espana">Espana</option>
                <option value="Reino Unido">Reino Unido</option>
                <option value="Brasil">Brasil</option>
                <option value="Argentina">Argentina</option>
                <option value="Mexico">Mexico</option>
                <option value="Colombia">Colombia</option>
                <option value="Costa Rica">Costa Rica</option>
                <option value="China">China</option>
                <option value="India">India</option>
                <option value="Corea del Sur">Corea del Sur</option>
                <option value="Japon">Japon</option>
                <option value="Australia">Australia</option>
                <option value="Otro">Otro</option>
              </select>
              @if (isFieldInvalid('country')) {
                <div class="form-error" role="alert">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                  {{ getFieldError('country') }}
                </div>
              }
            </div>
            <div class="form-group form-group-full">
              <label class="form-label">Categorias</label>
              <div style="display: flex; gap: 16px;">
                <label style="display: flex; align-items: center; gap: 6px; cursor: pointer;">
                  <input type="checkbox" [checked]="categoryChecked('farmacos')" (change)="toggleCategory('farmacos')"> Farmacos
                </label>
                <label style="display: flex; align-items: center; gap: 6px; cursor: pointer;">
                  <input type="checkbox" [checked]="categoryChecked('alimentos')" (change)="toggleCategory('alimentos')"> Alimentos
                </label>
                <label style="display: flex; align-items: center; gap: 6px; cursor: pointer;">
                  <input type="checkbox" [checked]="categoryChecked('equipos')" (change)="toggleCategory('equipos')"> Equipos
                </label>
              </div>
            </div>
            <div class="form-group form-group-full">
              <label class="form-label" for="brand-desc-es">Descripcion (ES)</label>
              <textarea id="brand-desc-es" class="form-control" formControlName="descriptionEs" placeholder="Descripcion de la marca..." rows="3"></textarea>
            </div>
            <div class="form-group form-group-full">
              <label class="form-label" for="brand-desc-en">Descripcion (EN)</label>
              <textarea id="brand-desc-en" class="form-control" formControlName="descriptionEn" placeholder="Brand description..." rows="3"></textarea>
            </div>
          </div>
        </div>

        <hr class="product-form__divider">

        <div class="product-form__section">
          <h2 class="product-form__section-title">Logo</h2>
          <div class="image-uploader">
            @if (logoPreview()) {
              <div class="image-uploader__preview">
                <img [src]="logoPreview()!" alt="Logo preview" style="max-width: 200px; max-height: 200px; object-fit: contain; border-radius: 8px; border: 1px solid var(--neutral-200);">
                <div class="image-uploader__preview-actions" style="margin-top: 12px; display: flex; gap: 8px;">
                  <button type="button" class="btn btn-outline-gray btn-sm" (click)="logoInput.click()">Cambiar logo</button>
                  <button type="button" class="btn btn-outline-gray btn-sm" style="color: var(--semantic-danger);" (click)="removeLogo()">Eliminar</button>
                </div>
              </div>
            } @else {
              <div class="image-uploader__dropzone" (click)="logoInput.click()" (dragover)="$event.preventDefault()" (drop)="onLogoDrop($event)">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--neutral-400)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                <p>Arrastra el logo aqui o <span>selecciona archivo</span></p>
                <span class="image-uploader__hint">PNG, JPG hasta 5MB</span>
              </div>
            }
            <input #logoInput type="file" accept="image/png,image/jpeg,image/webp" style="display: none;" (change)="onLogoSelected($event)">
            @if (uploadingLogo()) {
              <div class="image-uploader__progress">
                <div class="image-uploader__progress-bar"><div class="image-uploader__progress-fill" style="width: 100%;"></div></div>
                <span class="image-uploader__progress-text">Subiendo logo...</span>
              </div>
            }
          </div>
        </div>
      </form>

      <!-- Mobile sticky actions -->
      <div class="product-form-page__sticky-actions">
        <button class="btn btn-outline-gray btn-block" (click)="onCancel()">Cancelar</button>
        <button class="btn btn-primary btn-block" [disabled]="saving()" (click)="onSubmit()">{{ saving() ? 'Guardando...' : 'Guardar' }}</button>
      </div>
    </div>

    <!-- Unsaved Changes Modal -->
    @if (showUnsavedModal()) {
      <div class="modal-backdrop" (click)="stayEditing()">
        <div class="modal-dialog" (click)="$event.stopPropagation()">
          <div class="modal-dialog__icon" aria-hidden="true">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--semantic-warning)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
          </div>
          <h3 class="modal-dialog__title">Tienes cambios sin guardar</h3>
          <p class="modal-dialog__desc">Si sales ahora, perderas los cambios realizados en esta marca.</p>
          <div class="modal-dialog__actions">
            <button class="btn btn-outline-gray" (click)="confirmLeave()">Salir sin guardar</button>
            <button class="btn btn-primary" (click)="stayEditing()">Seguir editando</button>
          </div>
        </div>
      </div>
    }
  `,
  styleUrl: '../product-form/product-form.component.scss'
})
export class AdminBrandFormComponent implements HasUnsavedChanges, OnInit {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private fb = inject(FormBuilder);
  private api = inject(ApiService);
  private toast = inject(ToastService);

  isEditing = signal(false);
  brandId = signal<string | null>(null);
  saving = signal(false);
  submitted = signal(false);
  _hasChanges = signal(false);
  showUnsavedModal = signal(false);
  selectedCategories = signal<string[]>([]);
  logoPreview = signal<string | null>(null);
  logoFile = signal<File | null>(null);
  uploadingLogo = signal(false);

  brandForm!: FormGroup;
  private pendingNavResolve: ((allowed: boolean) => void) | null = null;

  async ngOnInit(): Promise<void> {
    this.brandForm = this.fb.group({
      name: ['', [Validators.required]],
      country: ['', [Validators.required]],
      descriptionEs: [''],
      descriptionEn: [''],
    });

    this.brandForm.valueChanges.subscribe(() => {
      this._hasChanges.set(true);
    });

    const id = this.route.snapshot.params['id'];
    if (id) {
      this.isEditing.set(true);
      this.brandId.set(id);
      await this.loadBrand(id);
    }
  }

  private async loadBrand(id: string): Promise<void> {
    try {
      const brand = await this.api.adminGetBrand(id);
      this.brandForm.patchValue({
        name: brand.name,
        country: brand.country,
        descriptionEs: brand.description?.es || '',
        descriptionEn: brand.description?.en || '',
      });
      this.selectedCategories.set(brand.categories || []);
      if (brand.logo) {
        this.logoPreview.set(brand.logo);
      }
      this._hasChanges.set(false);
    } catch {
      this.toast.error('Error al cargar la marca');
      this.router.navigate(['/admin/marcas']);
    }
  }

  categoryChecked(cat: string): boolean {
    return this.selectedCategories().includes(cat);
  }

  toggleCategory(cat: string): void {
    const current = this.selectedCategories();
    if (current.includes(cat)) {
      this.selectedCategories.set(current.filter(c => c !== cat));
    } else {
      this.selectedCategories.set([...current, cat]);
    }
    this._hasChanges.set(true);
  }

  onLogoSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      if (file.size > 5 * 1024 * 1024) {
        this.toast.error('El archivo no debe superar 5MB');
        return;
      }
      this.logoFile.set(file);
      this._hasChanges.set(true);
      const reader = new FileReader();
      reader.onload = () => {
        this.logoPreview.set(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  }

  onLogoDrop(event: DragEvent): void {
    event.preventDefault();
    if (event.dataTransfer?.files && event.dataTransfer.files[0]) {
      const file = event.dataTransfer.files[0];
      if (!['image/png', 'image/jpeg', 'image/webp'].includes(file.type)) {
        this.toast.error('Solo se permiten imagenes PNG, JPG o WebP');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        this.toast.error('El archivo no debe superar 5MB');
        return;
      }
      this.logoFile.set(file);
      this._hasChanges.set(true);
      const reader = new FileReader();
      reader.onload = () => {
        this.logoPreview.set(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  }

  removeLogo(): void {
    this.logoFile.set(null);
    this.logoPreview.set(null);
    this._hasChanges.set(true);
  }

  onFieldBlur(fieldName: string): void {
    const control = this.brandForm.get(fieldName);
    if (control) control.markAsTouched();
  }

  isFieldInvalid(fieldName: string): boolean {
    const control = this.brandForm.get(fieldName);
    if (!control) return false;
    return control.invalid && (control.touched || this.submitted());
  }

  getFieldError(fieldName: string): string {
    const control = this.brandForm.get(fieldName);
    if (!control || !control.errors) return '';
    if (control.errors['required']) {
      const labels: Record<string, string> = {
        name: 'El nombre de la marca es obligatorio',
        country: 'Selecciona el pais de origen',
      };
      return labels[fieldName] || 'Este campo es obligatorio';
    }
    return '';
  }

  async onSubmit(): Promise<void> {
    this.submitted.set(true);
    this.brandForm.markAllAsTouched();

    if (this.brandForm.invalid) {
      const firstInvalid = document.querySelector('.form-control.is-invalid, .form-select.is-invalid');
      if (firstInvalid) {
        firstInvalid.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    this.saving.set(true);
    const formValue = this.brandForm.value;

    const brandData: Record<string, unknown> = {
      name: formValue.name,
      country: formValue.country,
      categories: this.selectedCategories(),
      description: {
        es: formValue.descriptionEs || '',
        en: formValue.descriptionEn || '',
      },
    };

    try {
      let savedBrand: ApiBrand;
      if (this.isEditing() && this.brandId()) {
        savedBrand = await this.api.adminUpdateBrand(this.brandId()!, brandData);
        this.toast.success('Marca actualizada correctamente');
      } else {
        savedBrand = await this.api.adminCreateBrand(brandData);
        this.toast.success('Marca creada correctamente');
      }

      // Upload logo if a new file was selected
      if (this.logoFile()) {
        try {
          this.uploadingLogo.set(true);
          await this.api.adminUploadBrandLogo(savedBrand._id, this.logoFile()!);
        } catch {
          this.toast.warning('La marca se guardo pero hubo un error al subir el logo');
        } finally {
          this.uploadingLogo.set(false);
        }
      }

      this._hasChanges.set(false);
      this.router.navigate(['/admin/marcas']);
    } catch {
      this.toast.error('Error al guardar la marca. Intenta de nuevo.');
    } finally {
      this.saving.set(false);
    }
  }

  // --- HasUnsavedChanges interface ---
  hasUnsavedChanges(): boolean {
    return this._hasChanges();
  }

  promptUnsavedChanges(): Promise<boolean> {
    this.showUnsavedModal.set(true);
    return new Promise<boolean>(resolve => {
      this.pendingNavResolve = resolve;
    });
  }

  onCancel(): void {
    if (this._hasChanges()) {
      this.showUnsavedModal.set(true);
      this.pendingNavResolve = (allowed: boolean) => {
        if (allowed) {
          this.router.navigate(['/admin/marcas']);
        }
      };
    } else {
      this.router.navigate(['/admin/marcas']);
    }
  }

  confirmLeave(): void {
    this.showUnsavedModal.set(false);
    this._hasChanges.set(false);
    if (this.pendingNavResolve) {
      this.pendingNavResolve(true);
      this.pendingNavResolve = null;
    }
  }

  stayEditing(): void {
    this.showUnsavedModal.set(false);
    if (this.pendingNavResolve) {
      this.pendingNavResolve(false);
      this.pendingNavResolve = null;
    }
  }
}
