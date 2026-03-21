import { Component, signal, inject, OnInit } from '@angular/core';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HasUnsavedChanges } from '../../../shared/guards/unsaved-changes.guard';
import { ApiService, ApiProduct, ApiBrand, ApiCategory } from '../../../shared/services/api.service';
import { ToastService } from '../../../shared/services/toast.service';

@Component({
  selector: 'app-admin-product-form',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './product-form.component.html',
  styleUrl: './product-form.component.scss'
})
export class AdminProductFormComponent implements HasUnsavedChanges, OnInit {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private fb = inject(FormBuilder);
  private api = inject(ApiService);
  private toast = inject(ToastService);

  selectedCategory = signal<'farmacos' | 'alimentos' | 'equipos' | ''>('');
  activeTab = signal<'es' | 'en'>('es');
  _hasChanges = signal(false);
  showUnsavedModal = signal(false);
  showDeleteModal = signal(false);
  submitted = signal(false);
  saving = signal(false);
  isEditing = signal(false);
  productId = signal<string | null>(null);
  brands = signal<ApiBrand[]>([]);
  categories = signal<ApiCategory[]>([]);
  existingProduct = signal<ApiProduct | null>(null);

  // Species from category (available options) & selected species
  availableSpecies = signal<{ es: string; en: string }[]>([]);
  speciesList = signal<string[]>([]);
  presentationsList = signal<string[]>([]);

  // Image & PDF upload state
  existingImages = signal<string[]>([]);
  pendingImageFiles = signal<File[]>([]);
  pendingImagePreviews = signal<string[]>([]);
  existingPdfUrl = signal<string | null>(null);
  existingPdfName = signal<string>('Ficha tecnica');
  pendingPdfFile = signal<File | null>(null);
  pendingPdfName = signal<string>('');
  uploadingImages = signal(false);
  uploadingPdf = signal(false);

  productForm!: FormGroup;
  private pendingNavResolve: ((allowed: boolean) => void) | null = null;

  async ngOnInit(): Promise<void> {
    this.productForm = this.fb.group({
      nameEs: ['', [Validators.required]],
      nameEn: [''],
      brand: [''],
      category: ['', [Validators.required]],
      family: [''],
      lifeStage: [''],
      equipmentType: [''],
      descriptionEs: [''],
      descriptionEn: [''],
      compositionEs: [''],
      compositionEn: [''],
      ingredientsEs: [''],
      ingredientsEn: [''],
      nutritionalInfoEs: [''],
      nutritionalInfoEn: [''],
      specificationsEs: [''],
      specificationsEn: [''],
      recommendedUsesEs: [''],
      recommendedUsesEn: [''],
      warrantyEs: [''],
      warrantyEn: [''],
      isActive: [false],
    });

    this.productForm.valueChanges.subscribe(() => {
      this._hasChanges.set(true);
    });

    // Load brands and categories
    try {
      const [brands, categories] = await Promise.all([
        this.api.adminGetBrands(),
        this.api.adminGetCategories(),
      ]);
      this.brands.set(brands);
      this.categories.set(categories);
    } catch {
      this.toast.error('Error al cargar los datos');
    }

    // Check if editing
    const id = this.route.snapshot.params['id'];
    if (id) {
      this.isEditing.set(true);
      this.productId.set(id);
      await this.loadProduct(id);
    }
  }

  private async loadProduct(id: string): Promise<void> {
    try {
      const product = await this.api.adminGetProduct(id);
      this.existingProduct.set(product);
      this.selectedCategory.set(product.category as 'farmacos' | 'alimentos' | 'equipos');

      this.productForm.patchValue({
        nameEs: product.name.es,
        nameEn: product.name.en,
        brand: product.brand && typeof product.brand === 'object' ? product.brand._id : (product.brand || ''),
        category: product.category,
        family: product.family || '',
        lifeStage: product.lifeStage || '',
        equipmentType: product.equipmentType || '',
        descriptionEs: product.description?.es || '',
        descriptionEn: product.description?.en || '',
        compositionEs: product.composition?.es || '',
        compositionEn: product.composition?.en || '',
        ingredientsEs: product.ingredients?.es || '',
        ingredientsEn: product.ingredients?.en || '',
        nutritionalInfoEs: product.nutritionalInfo?.es || '',
        nutritionalInfoEn: product.nutritionalInfo?.en || '',
        specificationsEs: product.specifications?.es || '',
        specificationsEn: product.specifications?.en || '',
        recommendedUsesEs: product.recommendedUses?.es || '',
        recommendedUsesEn: product.recommendedUses?.en || '',
        warrantyEs: product.warranty?.es || '',
        warrantyEn: product.warranty?.en || '',
        isActive: product.isActive,
      });

      this.speciesList.set(product.species || []);
      this.presentationsList.set(product.presentations || []);
      if (product.category) {
        this.updateAvailableSpecies(product.category);
      }
      this.existingImages.set(product.images || []);
      this.existingPdfUrl.set(product.pdfUrl || null);
      if (product.pdfUrl) {
        const parts = product.pdfUrl.split('/');
        this.existingPdfName.set(decodeURIComponent(parts[parts.length - 1]) || 'Ficha tecnica.pdf');
      }

      this._hasChanges.set(false);
    } catch {
      this.toast.error('Error al cargar el producto');
      this.router.navigate(['/admin/productos']);
    }
  }

  selectCategory(cat: 'farmacos' | 'alimentos' | 'equipos'): void {
    this.selectedCategory.set(cat);
    this.productForm.get('category')!.setValue(cat);
    this.productForm.get('category')!.markAsTouched();
    this._hasChanges.set(true);
    this.updateAvailableSpecies(cat);
  }

  private updateAvailableSpecies(cat: string): void {
    const category = this.categories().find(c => c.key === cat);
    this.availableSpecies.set(category?.species || []);
  }

  toggleSpecies(speciesEs: string): void {
    this.speciesList.update(list => {
      if (list.includes(speciesEs)) {
        return list.filter(s => s !== speciesEs);
      } else {
        return [...list, speciesEs];
      }
    });
    this._hasChanges.set(true);
  }

  switchTab(tab: 'es' | 'en'): void {
    this.activeTab.set(tab);
  }

  markChanged(): void {
    this._hasChanges.set(true);
  }

  // Species selection is now handled by toggleSpecies() above

  // --- Presentation management ---
  addPresentation(event: Event): void {
    event.preventDefault();
    const input = event.target as HTMLInputElement;
    const value = input.value.trim();
    if (value && !this.presentationsList().includes(value)) {
      this.presentationsList.update(list => [...list, value]);
      this._hasChanges.set(true);
    }
    input.value = '';
  }

  addPresentationFromButton(input: HTMLInputElement): void {
    const value = input.value.trim();
    if (value && !this.presentationsList().includes(value)) {
      this.presentationsList.update(list => [...list, value]);
      this._hasChanges.set(true);
    }
    input.value = '';
    input.focus();
  }

  removePresentation(index: number): void {
    this.presentationsList.update(list => list.filter((_, i) => i !== index));
    this._hasChanges.set(true);
  }

  // --- Image Upload (REQ-243, REQ-244, REQ-254) ---
  async onImagesSelected(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;
    const files = Array.from(input.files);
    if (this.productId()) {
      await this.uploadImages(files);
    } else {
      this.queueImageFiles(files);
    }
    input.value = '';
  }

  onImageDrop(event: DragEvent): void {
    event.preventDefault();
    if (!event.dataTransfer?.files) return;
    const files = Array.from(event.dataTransfer.files);
    const imageFiles = files.filter(f => ['image/png', 'image/jpeg', 'image/webp'].includes(f.type));
    if (imageFiles.length === 0) {
      this.toast.error('Solo se permiten imagenes PNG, JPG o WebP');
      return;
    }
    if (this.productId()) {
      this.uploadImages(imageFiles);
    } else {
      this.queueImageFiles(imageFiles);
    }
  }

  private queueImageFiles(files: File[]): void {
    const maxRemaining = 6 - this.existingImages().length - this.pendingImageFiles().length;
    const filesToQueue = files.slice(0, maxRemaining);
    this.pendingImageFiles.update(list => [...list, ...filesToQueue]);
    for (const file of filesToQueue) {
      const reader = new FileReader();
      reader.onload = () => {
        this.pendingImagePreviews.update(list => [...list, reader.result as string]);
      };
      reader.readAsDataURL(file);
    }
    this._hasChanges.set(true);
  }

  removePendingImage(index: number): void {
    this.pendingImageFiles.update(list => list.filter((_, i) => i !== index));
    this.pendingImagePreviews.update(list => list.filter((_, i) => i !== index));
    this._hasChanges.set(true);
  }

  private async uploadImages(files: File[]): Promise<void> {

    const maxRemaining = 6 - this.existingImages().length;
    const filesToUpload = files.slice(0, maxRemaining);

    if (files.length > maxRemaining) {
      this.toast.warning(`Solo se pueden subir ${maxRemaining} imagenes mas.`);
    }

    this.uploadingImages.set(true);
    try {
      const updatedProduct = await this.api.adminUploadProductImages(this.productId()!, filesToUpload);
      this.existingImages.set(updatedProduct.images || []);
      this.toast.success('Imagenes subidas correctamente');
    } catch (error: any) {
      const message = error?.error?.error || 'Error al subir las imagenes';
      this.toast.error(message);
    } finally {
      this.uploadingImages.set(false);
    }
  }

  async deleteImage(index: number): Promise<void> {
    if (!this.productId()) return;
    try {
      const updatedProduct = await this.api.adminDeleteProductImage(this.productId()!, index);
      this.existingImages.set(updatedProduct.images || []);
      this.toast.success('Imagen eliminada');
    } catch {
      this.toast.error('Error al eliminar la imagen');
    }
  }

  // --- PDF Upload (REQ-245) ---
  async onPdfSelected(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;
    if (!input.files || !input.files[0]) return;
    const file = input.files[0];
    if (this.productId()) {
      await this.uploadPdf(file);
    } else {
      this.queuePdfFile(file);
    }
    input.value = '';
  }

  onPdfDrop(event: DragEvent): void {
    event.preventDefault();
    if (!event.dataTransfer?.files || !event.dataTransfer.files[0]) return;
    const file = event.dataTransfer.files[0];
    if (file.type !== 'application/pdf') {
      this.toast.error('Solo se permiten archivos PDF');
      return;
    }
    if (this.productId()) {
      this.uploadPdf(file);
    } else {
      this.queuePdfFile(file);
    }
  }

  private queuePdfFile(file: File): void {
    if (file.size > 10 * 1024 * 1024) {
      this.toast.error('El archivo no debe superar 10MB');
      return;
    }
    this.pendingPdfFile.set(file);
    this.pendingPdfName.set(file.name);
    this._hasChanges.set(true);
  }

  removePendingPdf(): void {
    this.pendingPdfFile.set(null);
    this.pendingPdfName.set('');
    this._hasChanges.set(true);
  }

  private async uploadPdf(file: File): Promise<void> {
    if (file.size > 10 * 1024 * 1024) {
      this.toast.error('El archivo no debe superar 10MB');
      return;
    }
    this.uploadingPdf.set(true);
    try {
      const updatedProduct = await this.api.adminUploadProductPdf(this.productId()!, file);
      this.existingPdfUrl.set(updatedProduct.pdfUrl || null);
      this.existingPdfName.set(file.name);
      this.toast.success('Ficha tecnica subida correctamente');
    } catch {
      this.toast.error('Error al subir la ficha tecnica');
    } finally {
      this.uploadingPdf.set(false);
    }
  }

  async deletePdf(): Promise<void> {
    if (!this.productId()) return;
    try {
      await this.api.adminDeleteProductPdf(this.productId()!);
      this.existingPdfUrl.set(null);
      this.toast.success('Ficha tecnica eliminada');
    } catch {
      this.toast.error('Error al eliminar la ficha tecnica');
    }
  }

  // --- Form validation ---
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
        nameEs: 'El nombre del producto es obligatorio',
        category: 'Selecciona una categoria',
      };
      return labels[fieldName] || 'Este campo es obligatorio';
    }
    return '';
  }

  async onSubmit(): Promise<void> {
    this.submitted.set(true);
    this.productForm.markAllAsTouched();

    if (this.productForm.invalid) {
      const firstInvalid = document.querySelector('.form-control.is-invalid, .form-select.is-invalid');
      if (firstInvalid) {
        firstInvalid.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    this.saving.set(true);
    const productData = this.buildProductData();

    try {
      let savedProduct: ApiProduct;
      if (this.isEditing() && this.productId()) {
        savedProduct = await this.api.adminUpdateProduct(this.productId()!, productData);
        this.toast.success('Producto actualizado correctamente');
      } else {
        savedProduct = await this.api.adminCreateProduct(productData);
        this.productId.set(savedProduct._id);

        // Upload queued files after product creation
        if (this.pendingImageFiles().length > 0) {
          try {
            await this.uploadImages(this.pendingImageFiles());
          } catch {
            this.toast.warning('Producto creado, pero hubo un error al subir las imagenes.');
          }
        }
        if (this.pendingPdfFile()) {
          try {
            await this.uploadPdf(this.pendingPdfFile()!);
          } catch {
            this.toast.warning('Producto creado, pero hubo un error al subir el PDF.');
          }
        }

        this.toast.success('Producto creado correctamente');
      }
      this._hasChanges.set(false);
      this.router.navigate(['/admin/productos']);
    } catch {
      this.toast.error('Error al guardar el producto. Intenta de nuevo.');
    } finally {
      this.saving.set(false);
    }
  }

  private buildProductData(): Record<string, unknown> {
    const v = this.productForm.value;
    const data: Record<string, unknown> = {
      name: { es: v.nameEs, en: v.nameEn || '' },
      category: v.category,
      description: { es: v.descriptionEs || '', en: v.descriptionEn || '' },
      species: this.speciesList(),
      presentations: this.presentationsList(),
      isActive: v.isActive,
    };

    // Brand is optional — only send if selected
    if (v.brand) {
      data['brand'] = v.brand;
    } else {
      data['brand'] = null;
    }

    if (v.family) data['family'] = v.family;
    if (v.lifeStage) data['lifeStage'] = v.lifeStage;
    if (v.equipmentType) data['equipmentType'] = v.equipmentType;

    this.addCategorySpecificFields(data, v);
    return data;
  }

  private addCategorySpecificFields(data: Record<string, unknown>, v: Record<string, string>): void {
    if (v['category'] === 'farmacos') {
      data['composition'] = { es: v['compositionEs'] || '', en: v['compositionEn'] || '' };
    } else if (v['category'] === 'alimentos') {
      data['ingredients'] = { es: v['ingredientsEs'] || '', en: v['ingredientsEn'] || '' };
      data['nutritionalInfo'] = { es: v['nutritionalInfoEs'] || '', en: v['nutritionalInfoEn'] || '' };
    } else if (v['category'] === 'equipos') {
      data['specifications'] = { es: v['specificationsEs'] || '', en: v['specificationsEn'] || '' };
      data['recommendedUses'] = { es: v['recommendedUsesEs'] || '', en: v['recommendedUsesEn'] || '' };
      data['warranty'] = { es: v['warrantyEs'] || '', en: v['warrantyEn'] || '' };
    }
  }

  // --- Delete Product (REQ-250) ---
  requestDeleteProduct(): void {
    this.showDeleteModal.set(true);
  }

  cancelDelete(): void {
    this.showDeleteModal.set(false);
  }

  async confirmDeleteProduct(): Promise<void> {
    if (!this.productId()) return;
    try {
      await this.api.adminDeleteProduct(this.productId()!);
      this.toast.success('Producto eliminado correctamente');
      this._hasChanges.set(false);
      this.router.navigate(['/admin/productos']);
    } catch {
      this.toast.error('Error al eliminar el producto');
    } finally {
      this.showDeleteModal.set(false);
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
