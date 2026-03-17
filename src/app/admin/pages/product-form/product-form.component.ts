import { Component, signal, inject } from '@angular/core';
import { Router } from '@angular/router';
import { HasUnsavedChanges } from '../../../shared/guards/unsaved-changes.guard';

@Component({
  selector: 'app-admin-product-form',
  standalone: true,
  templateUrl: './product-form.component.html',
  styleUrl: './product-form.component.scss'
})
export class AdminProductFormComponent implements HasUnsavedChanges {
  private router = inject(Router);

  selectedCategory = signal<'farmacos' | 'alimentos' | 'equipos' | ''>('');
  activeTab = signal<'es' | 'en'>('es');
  _hasChanges = signal(false);
  showUnsavedModal = signal(false);

  // Promise resolve function for the CanDeactivate guard
  private pendingNavResolve: ((allowed: boolean) => void) | null = null;

  selectCategory(cat: 'farmacos' | 'alimentos' | 'equipos'): void {
    this.selectedCategory.set(cat);
    this._hasChanges.set(true);
  }

  switchTab(tab: 'es' | 'en'): void {
    this.activeTab.set(tab);
  }

  markChanged(): void {
    this._hasChanges.set(true);
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
