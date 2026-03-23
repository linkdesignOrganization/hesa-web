import { Component, signal, inject, OnInit } from '@angular/core';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HasUnsavedChanges } from '../../../shared/guards/unsaved-changes.guard';
import { ApiService, ApiBrand } from '../../../shared/services/api.service';
import { ToastService } from '../../../shared/services/toast.service';

@Component({
  selector: 'app-admin-brand-form',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './brand-form.component.html',
  styleUrl: './brand-form.component.scss'
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
      if (!['image/png', 'image/jpeg', 'image/webp'].includes(file.type)) {
        this.toast.error('Solo se permiten imágenes PNG, JPG o WebP');
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
        this.toast.error('Solo se permiten imágenes PNG, JPG o WebP');
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
        country: 'Selecciona el país de origen',
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
        } catch (error: any) {
          const message = error?.error?.error || 'La marca se guardo pero hubo un error al subir el logo';
          this.toast.warning(message);
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
