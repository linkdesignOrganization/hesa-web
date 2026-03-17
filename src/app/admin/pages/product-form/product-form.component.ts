import { Component, signal, inject, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HasUnsavedChanges } from '../../../shared/guards/unsaved-changes.guard';

@Component({
  selector: 'app-admin-product-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './product-form.component.html',
  styleUrl: './product-form.component.scss'
})
export class AdminProductFormComponent implements HasUnsavedChanges, OnInit {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private fb = inject(FormBuilder);

  selectedCategory = signal<'farmacos' | 'alimentos' | 'equipos' | ''>('');
  activeTab = signal<'es' | 'en'>('es');
  _hasChanges = signal(false);
  showUnsavedModal = signal(false);
  submitted = signal(false);

  productForm!: FormGroup;

  // Promise resolve function for the CanDeactivate guard
  private pendingNavResolve: ((allowed: boolean) => void) | null = null;

  ngOnInit(): void {
    this.productForm = this.fb.group({
      name: ['', [Validators.required]],
      brand: ['', [Validators.required]],
      category: ['', [Validators.required]],
      slug: [''],
      descriptionEs: ['', [Validators.required]],
      descriptionEn: ['', [Validators.required]]
    });

    // Track changes from form interactions
    this.productForm.valueChanges.subscribe(() => {
      this._hasChanges.set(true);
    });
  }

  selectCategory(cat: 'farmacos' | 'alimentos' | 'equipos'): void {
    this.selectedCategory.set(cat);
    this.productForm.get('category')!.setValue(cat);
    this.productForm.get('category')!.markAsTouched();
    this._hasChanges.set(true);
  }

  switchTab(tab: 'es' | 'en'): void {
    this.activeTab.set(tab);
  }

  markChanged(): void {
    this._hasChanges.set(true);
  }

  onFieldBlur(fieldName: string): void {
    const control = this.productForm.get(fieldName);
    if (control) {
      control.markAsTouched();
    }
  }

  isFieldInvalid(fieldName: string): boolean {
    const control = this.productForm.get(fieldName);
    if (!control) return false;
    return control.invalid && (control.touched || this.submitted());
  }

  getFieldError(fieldName: string): string {
    const control = this.productForm.get(fieldName);
    if (!control || !control.errors) return '';
    if (control.errors['required']) {
      const labels: Record<string, string> = {
        name: 'El nombre del producto es obligatorio',
        brand: 'Selecciona una marca',
        category: 'Selecciona una categoria',
        descriptionEs: 'La descripcion en espanol es obligatoria',
        descriptionEn: 'La descripcion en ingles es obligatoria'
      };
      return labels[fieldName] || 'Este campo es obligatorio';
    }
    return '';
  }

  onSubmit(): void {
    this.submitted.set(true);
    this.productForm.markAllAsTouched();

    if (this.productForm.invalid) {
      // Scroll to first invalid field
      const firstInvalid = document.querySelector('.form-control.is-invalid, .form-select.is-invalid');
      if (firstInvalid) {
        firstInvalid.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    // Valid form — would save (mock for now)
    this._hasChanges.set(false);
    this.router.navigate(['/admin/productos']);
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

  // --- Modal actions ---

  onCancel(): void {
    if (this._hasChanges()) {
      this.showUnsavedModal.set(true);
      // For cancel button, resolve navigation after user makes a choice
      this.pendingNavResolve = (allowed: boolean) => {
        if (allowed) {
          this.router.navigate(['/admin/productos']);
        }
      };
    } else {
      this.router.navigate(['/admin/productos']);
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
