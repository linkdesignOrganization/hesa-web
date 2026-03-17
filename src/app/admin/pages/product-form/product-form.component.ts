import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-admin-product-form',
  standalone: true,
  templateUrl: './product-form.component.html',
  styleUrl: './product-form.component.scss'
})
export class AdminProductFormComponent {
  selectedCategory = signal<'farmacos' | 'alimentos' | 'equipos' | ''>('');
  activeTab = signal<'es' | 'en'>('es');
  hasChanges = signal(false);
  showUnsavedModal = signal(false);

  selectCategory(cat: 'farmacos' | 'alimentos' | 'equipos'): void {
    this.selectedCategory.set(cat);
    this.hasChanges.set(true);
  }

  switchTab(tab: 'es' | 'en'): void {
    this.activeTab.set(tab);
  }

  markChanged(): void {
    this.hasChanges.set(true);
  }

  onCancel(): void {
    if (this.hasChanges()) {
      this.showUnsavedModal.set(true);
    }
  }

  confirmLeave(): void {
    this.showUnsavedModal.set(false);
    this.hasChanges.set(false);
    // Shell: navigate back would go here
  }

  stayEditing(): void {
    this.showUnsavedModal.set(false);
  }
}
