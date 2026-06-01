import { Component, inject, signal, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiService, ApiGalleryItem } from '../../../shared/services/api.service';
import { ToastService } from '../../../shared/services/toast.service';
import { ConfirmModalComponent } from '../../components/confirm-modal/confirm-modal.component';

@Component({
  selector: 'app-admin-gallery',
  standalone: true,
  imports: [FormsModule, ConfirmModalComponent],
  templateUrl: './gallery.component.html',
  styleUrl: './gallery.component.scss'
})
export class AdminGalleryComponent implements OnInit {
  private api = inject(ApiService);
  private toast = inject(ToastService);

  @ViewChild('deleteModal') deleteModal!: ConfirmModalComponent;

  items = signal<ApiGalleryItem[]>([]);
  loading = signal(true);
  showForm = signal(false);
  savingItem = signal(false);
  editingItem = signal<ApiGalleryItem | null>(null);
  deletingItem = signal<ApiGalleryItem | null>(null);
  formLang = signal<'es' | 'en'>('es');

  formEvent = { es: '', en: '' };
  formDate = '';
  formDescription = { es: '', en: '' };

  // Photo state for both add & edit
  pendingPhotoFile = signal<File | null>(null);
  photoPreviewUrl = signal<string | null>(null);

  async ngOnInit(): Promise<void> {
    await this.loadGallery();
  }

  async loadGallery(): Promise<void> {
    this.loading.set(true);
    try {
      const items = await this.api.adminGetGallery();
      this.items.set(items);
    } catch {
      this.toast.error('Error al cargar la galería');
    }
    this.loading.set(false);
  }

  openAddModal(): void {
    this.editingItem.set(null);
    this.formEvent = { es: '', en: '' };
    this.formDate = '';
    this.formDescription = { es: '', en: '' };
    this.pendingPhotoFile.set(null);
    this.photoPreviewUrl.set(null);
    this.formLang.set('es');
    this.showForm.set(true);
  }

  openEditModal(item: ApiGalleryItem): void {
    this.editingItem.set(item);
    this.formEvent = { ...item.event };
    this.formDate = item.date || '';
    this.formDescription = { ...item.description };
    this.pendingPhotoFile.set(null);
    this.photoPreviewUrl.set(item.image || null);
    this.formLang.set('es');
    this.showForm.set(true);
  }

  async saveItem(): Promise<void> {
    if (!this.formEvent.es.trim() || !this.formEvent.en.trim()) {
      this.formLang.set(!this.formEvent.es.trim() ? 'es' : 'en');
      this.toast.warning('El nombre del evento es obligatorio en español e inglés');
      return;
    }
    if (!this.formDescription.es.trim() || !this.formDescription.en.trim()) {
      this.formLang.set(!this.formDescription.es.trim() ? 'es' : 'en');
      this.toast.warning('La descripción es obligatoria en español e inglés');
      return;
    }
    // Photo is mandatory when creating; on edit the existing one is kept if unchanged.
    if (!this.editingItem() && !this.pendingPhotoFile()) {
      this.toast.warning('La foto es obligatoria');
      return;
    }

    this.savingItem.set(true);
    try {
      const fd = new FormData();
      fd.append('eventEs', this.formEvent.es);
      fd.append('eventEn', this.formEvent.en);
      fd.append('date', this.formDate);
      fd.append('descriptionEs', this.formDescription.es);
      fd.append('descriptionEn', this.formDescription.en);
      if (this.pendingPhotoFile()) {
        fd.append('image', this.pendingPhotoFile()!);
      }

      if (this.editingItem()) {
        await this.api.adminUpdateGalleryItem(this.editingItem()!._id, fd);
        this.toast.success('Evento actualizado');
      } else {
        await this.api.adminCreateGalleryItem(fd);
        this.toast.success('Evento agregado');
      }
      this.showForm.set(false);
      await this.loadGallery();
    } catch (error: any) {
      const message = error?.error?.error || 'Error al guardar';
      this.toast.error(message);
    }
    this.savingItem.set(false);
  }

  confirmDelete(item: ApiGalleryItem): void {
    this.deletingItem.set(item);
    this.deleteModal.open();
  }

  async executeDelete(): Promise<void> {
    const item = this.deletingItem();
    if (!item) return;

    try {
      await this.api.adminDeleteGalleryItem(item._id);
      this.toast.success('Evento eliminado');
      await this.loadGallery();
    } catch {
      this.toast.error('Error al eliminar');
    }
    this.deletingItem.set(null);
  }

  onPhotoSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;
    this.setPhotoFile(file);
    input.value = '';
  }

  onPhotoDragOver(event: DragEvent): void {
    event.preventDefault();
  }

  onPhotoDrop(event: DragEvent): void {
    event.preventDefault();
    const file = event.dataTransfer?.files?.[0];
    if (!file) return;
    this.setPhotoFile(file);
  }

  removePendingPhoto(): void {
    this.pendingPhotoFile.set(null);
    this.photoPreviewUrl.set(null);
  }

  private setPhotoFile(file: File): void {
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      this.toast.error('Solo se permiten imágenes JPG, PNG o WebP');
      return;
    }
    this.pendingPhotoFile.set(file);
    const reader = new FileReader();
    reader.onload = () => {
      this.photoPreviewUrl.set(reader.result as string);
    };
    reader.readAsDataURL(file);
  }
}
