import { Component, inject } from '@angular/core';
import { ToastService } from '../../../shared/services/toast.service';

@Component({
  selector: 'app-admin-content-editor',
  standalone: true,
  template: `
    <div>
      <h1 style="font-size: 24px; font-weight: 700; margin-bottom: 24px;">Editor de Contenido</h1>
      <div class="tabs-pill" style="margin-bottom: 24px;"><button class="tabs-pill__btn tabs-pill__btn--active">Espanol</button><button class="tabs-pill__btn">English</button></div>
      <div class="product-form__section">
        <div class="form-group"><label class="form-label">Titulo</label><input type="text" class="form-control" value="Contenido de la seccion"></div>
        <div class="form-group"><label class="form-label">Contenido</label><textarea class="form-control" rows="6" placeholder="Contenido de la pagina..."></textarea></div>
      </div>
      <button class="btn btn-primary" (click)="save()">Guardar cambios</button>
    </div>
  `,
  styles: [`.form-group { margin-bottom: 16px; }`]
})
export class AdminContentEditorComponent {
  private toast = inject(ToastService);
  save(): void { this.toast.success('Contenido actualizado correctamente'); }
}
