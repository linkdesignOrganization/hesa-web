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
  template: `
    <div>
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px;">
        <h1 style="font-size: 24px; font-weight: 700;">Equipo de Liderazgo</h1>
        <button class="btn btn-primary" (click)="openAddModal()">+ Agregar miembro</button>
      </div>

      @if (loading()) {
        <div class="team-grid">
          @for (i of [1,2,3,4,5,6]; track i) { <div class="skeleton-card" style="height: 120px;"></div> }
        </div>
      } @else if (team().length === 0) {
        <div style="text-align: center; padding: 60px 0; color: var(--neutral-400);">
          <p>No hay miembros del equipo. La seccion no se mostrara en el sitio publico.</p>
          <button class="btn btn-primary" style="margin-top: 16px;" (click)="openAddModal()">+ Agregar miembro</button>
        </div>
      } @else {
        <div class="team-grid" cdkDropList (cdkDropListDropped)="onDrop($event)">
          @for (member of team(); track member._id) {
            <div class="team-card" cdkDrag>
              <span class="team-card__drag" cdkDragHandle>&#x2630;</span>
              <div class="team-card__avatar">
                @if (member.photo) {
                  <img [src]="member.photo" [alt]="member.name.es" style="width: 100%; height: 100%; object-fit: cover; border-radius: 50%;">
                } @else {
                  {{ member.name.es.charAt(0) }}
                }
              </div>
              <div class="team-card__info">
                <span class="team-card__name">{{ member.name.es }}</span>
                <span class="team-card__title">{{ member.title.es }}</span>
              </div>
              <div class="team-card__actions">
                <button class="team-card__edit" aria-label="Editar" (click)="openEditModal(member)">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/></svg>
                </button>
                <button class="team-card__delete" aria-label="Eliminar" (click)="confirmDelete(member)">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                </button>
              </div>
            </div>
          }
        </div>
      }
    </div>

    <!-- Add/Edit Modal -->
    @if (showForm()) {
      <div class="modal-backdrop" (click)="showForm.set(false)">
        <div class="modal-content" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <h2 style="font-size: 18px; font-weight: 700;">{{ editingMember() ? 'Editar Miembro' : 'Agregar Miembro' }}</h2>
            <button class="modal-close" (click)="showForm.set(false)">&times;</button>
          </div>
          <div class="modal-body">
            <div class="tabs-pill" style="margin-bottom: 16px;">
              <button class="tabs-pill__btn" [class.tabs-pill__btn--active]="formLang() === 'es'" (click)="formLang.set('es')">Espanol</button>
              <button class="tabs-pill__btn" [class.tabs-pill__btn--active]="formLang() === 'en'" (click)="formLang.set('en')">English</button>
            </div>

            @if (formLang() === 'es') {
              <div class="form-group"><label class="form-label">Nombre <span style="color: var(--semantic-danger);">*</span></label><input type="text" class="form-control" [(ngModel)]="formName.es" placeholder="Nombre completo"></div>
              <div class="form-group"><label class="form-label">Cargo <span style="color: var(--semantic-danger);">*</span></label><input type="text" class="form-control" [(ngModel)]="formTitle.es" placeholder="Cargo o posicion"></div>
            } @else {
              <div class="form-group"><label class="form-label">Name</label><input type="text" class="form-control" [(ngModel)]="formName.en" placeholder="Full name"></div>
              <div class="form-group"><label class="form-label">Title</label><input type="text" class="form-control" [(ngModel)]="formTitle.en" placeholder="Position or title"></div>
            }

            <!-- Photo upload for editing existing member -->
            @if (editingMember()) {
              <div class="form-group">
                <label class="form-label">Foto</label>
                @if (editingMember()?.photo) {
                  <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 8px;">
                    <img [src]="editingMember()!.photo" style="width: 60px; height: 60px; border-radius: 50%; object-fit: cover;">
                    <button class="btn btn-outline btn-sm" (click)="photoInput.click()">Cambiar foto</button>
                  </div>
                } @else {
                  <button class="btn btn-outline btn-sm" (click)="photoInput.click()">Subir foto</button>
                }
                <input #photoInput type="file" accept="image/jpeg,image/png,image/webp" style="display: none;" (change)="onPhotoSelected($event)">
              </div>
            }
          </div>
          <div class="modal-footer">
            <button class="btn btn-outline" (click)="showForm.set(false)">Cancelar</button>
            <button class="btn btn-primary" [disabled]="savingMember()" (click)="saveMember()">
              @if (savingMember()) { <span class="spinner-sm"></span> Guardando... } @else { Guardar }
            </button>
          </div>
        </div>
      </div>
    }

    <!-- Confirm Delete Modal -->
    <app-confirm-modal #deleteModal
      [title]="'Eliminar miembro'"
      [description]="'Estas seguro de eliminar a ' + (deletingMember()?.name?.es || '') + '?'"
      (confirmed)="executeDelete()" />
  `,
  styles: [`
    .team-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 16px; }
    .team-card { display: flex; align-items: center; gap: 12px; padding: 16px; background: white; border: 1px solid var(--neutral-200); border-radius: 10px; }
    .team-card__drag { color: var(--neutral-300); cursor: grab; }
    .team-card__avatar { width: 48px; height: 48px; border-radius: 50%; background: var(--neutral-100); display: flex; align-items: center; justify-content: center; font-weight: 700; color: var(--brand-primary); flex-shrink: 0; overflow: hidden; }
    .team-card__info { flex: 1; min-width: 0; }
    .team-card__name { font-weight: 600; font-size: 14px; display: block; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .team-card__title { font-size: 12px; color: var(--neutral-500); }
    .team-card__actions { display: flex; gap: 4px; }
    .team-card__edit, .team-card__delete { background: none; border: none; padding: 6px; border-radius: 6px; cursor: pointer; color: var(--neutral-400); transition: all 0.15s; }
    .team-card__edit:hover { color: var(--brand-primary); background: var(--neutral-50); }
    .team-card__delete:hover { color: var(--semantic-danger); background: var(--semantic-danger-soft); }
    .skeleton-card { background: var(--neutral-100); border-radius: 10px; }
    .cdk-drag-preview { box-shadow: 0 4px 12px rgba(0,0,0,0.15); border-radius: 10px; background: white; }
    .cdk-drag-placeholder { opacity: 0.3; }
    .form-group { margin-bottom: 16px; }
    .spinner-sm { display: inline-block; width: 16px; height: 16px; border: 2px solid rgba(255,255,255,0.3); border-top-color: white; border-radius: 50%; animation: spin 0.6s linear infinite; margin-right: 8px; }
    @keyframes spin { to { transform: rotate(360deg); } }
    .modal-backdrop { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); z-index: 500; display: flex; align-items: center; justify-content: center; }
    .modal-content { background: white; border-radius: 16px; max-width: 500px; width: 95%; max-height: 80vh; display: flex; flex-direction: column; }
    .modal-header { display: flex; justify-content: space-between; align-items: center; padding: 20px 24px; border-bottom: 1px solid var(--neutral-200); }
    .modal-close { background: none; border: none; font-size: 24px; color: var(--neutral-400); cursor: pointer; }
    .modal-body { padding: 20px 24px; overflow-y: auto; flex: 1; }
    .modal-footer { display: flex; justify-content: flex-end; gap: 12px; padding: 16px 24px; border-top: 1px solid var(--neutral-200); }
  `]
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
    this.formLang.set('es');
    this.showForm.set(true);
  }

  openEditModal(member: ApiTeamMember): void {
    this.editingMember.set(member);
    this.formName = { ...member.name };
    this.formTitle = { ...member.title };
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
        this.toast.success('Miembro actualizado');
      } else {
        await this.api.adminCreateTeamMember({
          name: this.formName,
          title: this.formTitle,
        });
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

  async onPhotoSelected(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    const member = this.editingMember();
    if (!file || !member) return;

    try {
      const updated = await this.api.adminUploadTeamPhoto(member._id, file);
      this.editingMember.set(updated);
      this.toast.success('Foto actualizada');
      await this.loadTeam();
    } catch {
      this.toast.error('Error al subir foto');
    }
    input.value = '';
  }
}
