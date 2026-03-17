import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-admin-brand-form',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="product-form-page">
      <div class="product-form-page__header">
        <h1>Crear Marca</h1>
        <div class="product-form-page__actions">
          <a routerLink="/admin/marcas" class="btn btn-outline-gray">Cancelar</a>
          <button class="btn btn-primary">Guardar marca</button>
        </div>
      </div>
      <form class="product-form" (submit)="$event.preventDefault()">
        <div class="product-form__section">
          <h2 class="product-form__section-title">Informacion de la Marca</h2>
          <div class="form-grid">
            <div class="form-group"><label class="form-label">Nombre <span class="required">*</span></label><input type="text" class="form-control" placeholder="Nombre de la marca"></div>
            <div class="form-group"><label class="form-label">Pais de origen <span class="required">*</span></label><select class="form-select"><option disabled selected>Seleccionar pais</option><option>Estados Unidos</option><option>Alemania</option><option>Francia</option><option>Suiza</option></select></div>
            <div class="form-group form-group-full"><label class="form-label">Categorias</label>
              <div style="display: flex; gap: 16px;">
                <label style="display: flex; align-items: center; gap: 6px;"><input type="checkbox"> Farmacos</label>
                <label style="display: flex; align-items: center; gap: 6px;"><input type="checkbox"> Alimentos</label>
                <label style="display: flex; align-items: center; gap: 6px;"><input type="checkbox"> Equipos</label>
              </div>
            </div>
            <div class="form-group form-group-full"><label class="form-label">Descripcion (ES)</label><textarea class="form-control" placeholder="Descripcion de la marca..."></textarea></div>
            <div class="form-group form-group-full"><label class="form-label">Descripcion (EN)</label><textarea class="form-control" placeholder="Brand description..."></textarea></div>
          </div>
        </div>
        <hr class="product-form__divider">
        <div class="product-form__section">
          <h2 class="product-form__section-title">Logo</h2>
          <div class="image-uploader"><div class="image-uploader__dropzone"><p>Arrastra el logo aqui o <span>selecciona archivo</span></p></div></div>
        </div>
      </form>
    </div>
  `,
  styleUrl: '../product-form/product-form.component.scss'
})
export class AdminBrandFormComponent {}
