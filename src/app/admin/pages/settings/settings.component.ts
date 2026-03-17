import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MockDataService } from '../../../shared/services/mock-data.service';
import { ToastService } from '../../../shared/services/toast.service';

@Component({
  selector: 'app-admin-settings',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div>
      <h1 style="font-size: 24px; font-weight: 700; margin-bottom: 24px;">Configuracion</h1>
      <div class="tabs-pill" style="margin-bottom: 24px;">
        <a routerLink="/admin/configuracion/general" class="tabs-pill__btn tabs-pill__btn--active">General</a>
        <a routerLink="/admin/configuracion/contacto" class="tabs-pill__btn">Contacto</a>
        <a routerLink="/admin/configuracion/redes" class="tabs-pill__btn">Redes</a>
        <a routerLink="/admin/configuracion/seo" class="tabs-pill__btn">SEO</a>
      </div>
      <div class="product-form__section">
        <div class="form-group"><label class="form-label">Nombre del sitio</label><input type="text" class="form-control" [value]="config.name"></div>
        <div class="form-group"><label class="form-label">Telefono</label><input type="text" class="form-control" [value]="config.phone"></div>
        <div class="form-group"><label class="form-label">Correo</label><input type="text" class="form-control" [value]="config.email"></div>
        <div class="form-group"><label class="form-label">Direccion</label><input type="text" class="form-control" [value]="config.address.es"></div>
        <div class="form-group"><label class="form-label">WhatsApp</label><input type="text" class="form-control" [value]="config.whatsapp"></div>
      </div>
      <button class="btn btn-primary" (click)="save()">Guardar configuracion</button>
    </div>
  `,
  styles: [`.form-group { margin-bottom: 16px; }`]
})
export class AdminSettingsComponent {
  private mockData = inject(MockDataService);
  private toast = inject(ToastService);
  config = this.mockData.getSiteConfig();

  save(): void { this.toast.success('Configuracion guardada correctamente'); }
}
