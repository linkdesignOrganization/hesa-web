import { Component, inject, signal, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';
import { ApiService, ApiTeamMember } from '../../../shared/services/api.service';
import { ToastService } from '../../../shared/services/toast.service';
import { ConfirmModalComponent } from '../../components/confirm-modal/confirm-modal.component';

@Component({
  selector: 'app-admin-team-editor',
  standalone: true,
  imports: [FormsModule, DragDropModule, ConfirmModalComponent],
  templateUrl: './team-editor.component.html',
  styleUrl: './team-editor.component.scss'
})
export class AdminTeamEditorComponent implements OnInit {
  private api = inject(ApiService);
  private toast = inject(ToastService);

  @ViewChild('deleteModal') deleteModal!: ConfirmModalComponent;

  team = signal<ApiTeamMember[]>([]);
  loading = signal(true);
  showForm = signal(false);
  savingMember = signal(false);
  editingMember = signal<ApiTeamMember | null>(null);
  deletingMember = signal<ApiTeamMember | null>(null);
  formLang = signal<'es' | 'en'>('es');

  formName = { es: '', en: '' };
  formTitle = { es: '', en: '' };

  // Photo state for both add & edit
  pendingPhotoFile = signal<File | null>(null);
  photoPreviewUrl = signal<string | null>(null);

  async ngOnInit(): Promise<void> {
    await this.loadTeam();
  }

  async loadTeam(): Promise<void> {
    this.loading.set(true);
    try {
      const members = await this.api.adminGetTeam();
      this.team.set(members);
    } catch {
      this.toast.error('Error al cargar el equipo');
    }
    this.loading.set(false);
  }

  openAddModal(): void {
    this.editingMember.set(null);
    this.formName = { es: '', en: '' };
    this.formTitle = { es: '', en: '' };
    this.pendingPhotoFile.set(null);
    this.photoPreviewUrl.set(null);
    this.formLang.set('es');
    this.showForm.set(true);
  }

  openEditModal(member: ApiTeamMember): void {
    this.editingMember.set(member);
    this.formName = { ...member.name };
    this.formTitle = { ...member.title };
    this.pendingPhotoFile.set(null);
    this.photoPreviewUrl.set(member.photo || null);
    this.formLang.set('es');
    this.showForm.set(true);
  }

  async saveMember(): Promise<void> {
    if (!this.formName.es.trim() || !this.formTitle.es.trim()) {
      this.toast.warning('Nombre y cargo en espanol son requeridos');
      return;
    }

    this.savingMember.set(true);
    try {
      if (this.editingMember()) {
        await this.api.adminUpdateTeamMember(this.editingMember()!._id, {
          name: this.formName,
          title: this.formTitle,
        });
        // Upload photo if a new file was selected during edit
        if (this.pendingPhotoFile()) {
          await this.api.adminUploadTeamPhoto(this.editingMember()!._id, this.pendingPhotoFile()!);
        }
        this.toast.success('Miembro actualizado');
      } else {
        // Create member first, then upload photo if one was selected
        const created = await this.api.adminCreateTeamMember({
          name: this.formName,
          title: this.formTitle,
        });
        if (this.pendingPhotoFile()) {
          await this.api.adminUploadTeamPhoto(created._id, this.pendingPhotoFile()!);
        }
        this.toast.success('Miembro agregado');
      }
      this.showForm.set(false);
      await this.loadTeam();
    } catch {
      this.toast.error('Error al guardar');
    }
    this.savingMember.set(false);
  }

  confirmDelete(member: ApiTeamMember): void {
    this.deletingMember.set(member);
    this.deleteModal.open();
  }

  async executeDelete(): Promise<void> {
    const member = this.deletingMember();
    if (!member) return;

    try {
      await this.api.adminDeleteTeamMember(member._id);
      this.toast.success('Miembro eliminado');
      await this.loadTeam();
    } catch {
      this.toast.error('Error al eliminar');
    }
    this.deletingMember.set(null);
  }

  async onDrop(event: CdkDragDrop<ApiTeamMember[]>): Promise<void> {
    const items = [...this.team()];
    moveItemInArray(items, event.previousIndex, event.currentIndex);
    this.team.set(items);

    try {
      await this.api.adminReorderTeam(items.map(m => m._id));
    } catch {
      this.toast.error('Error al reordenar');
    }
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
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      this.toast.error('Solo se permiten imagenes JPG, PNG o WebP');
      return;
    }
    this.setPhotoFile(file);
  }

  removePendingPhoto(): void {
    this.pendingPhotoFile.set(null);
    this.photoPreviewUrl.set(null);
  }

  private setPhotoFile(file: File): void {
    if (file.size > 5 * 1024 * 1024) {
      this.toast.error('La imagen no debe superar 5MB');
      return;
    }
    this.pendingPhotoFile.set(file);
    // Create preview URL
    const reader = new FileReader();
    reader.onload = () => {
      this.photoPreviewUrl.set(reader.result as string);
    };
    reader.readAsDataURL(file);
  }
}
