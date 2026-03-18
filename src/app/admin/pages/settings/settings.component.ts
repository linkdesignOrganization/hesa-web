import { Component, inject, signal, OnInit, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ApiService, ApiSiteConfig } from '../../../shared/services/api.service';
import { ToastService } from '../../../shared/services/toast.service';

@Component({
  selector: 'app-admin-settings',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, FormsModule],
  template: `
    <div class="settings-page">
      <h1 class="settings-page__title">Configuracion</h1>

      <div class="tabs-pill" style="margin-bottom: 24px;">
        <a routerLink="/admin/configuracion/general" routerLinkActive="tabs-pill__btn--active" class="tabs-pill__btn">General</a>
        <a routerLink="/admin/configuracion/contacto" routerLinkActive="tabs-pill__btn--active" class="tabs-pill__btn">Contacto</a>
        <a routerLink="/admin/configuracion/redes" routerLinkActive="tabs-pill__btn--active" class="tabs-pill__btn">Redes</a>
        <a routerLink="/admin/configuracion/seo" routerLinkActive="tabs-pill__btn--active" class="tabs-pill__btn">SEO</a>
      </div>

      @if (loading()) {
        <div class="settings-page__skeleton">
          @for (i of [1,2,3,4]; track i) {
            <div class="skeleton-block" style="height: 44px; border-radius: 10px; margin-bottom: 16px;"></div>
          }
        </div>
      } @else {
        <form (submit)="$event.preventDefault(); save()" class="settings-page__form">

          @if (activeTab === 'general') {
            <!-- REQ-303: General settings -->
            <div class="product-form__section">
              <h2 class="product-form__section-title">Configuracion General</h2>
              <p class="product-form__section-desc">Nombre del sitio e idioma por defecto</p>
              <div class="form-grid">
                <div class="form-group">
                  <label class="form-label">Nombre del sitio</label>
                  <input type="text" class="form-control" [(ngModel)]="config.siteName" name="siteName" maxlength="200">
                </div>
                <div class="form-group">
                  <label class="form-label">Idioma por defecto</label>
                  <select class="form-select" [(ngModel)]="config.defaultLang" name="defaultLang">
                    <option value="es">Espanol</option>
                    <option value="en">Ingles</option>
                  </select>
                </div>
              </div>
            </div>
            <!-- Analytics (NFR-027, NFR-030: prepared, deactivated) -->
            <div class="product-form__section">
              <h2 class="product-form__section-title">Integraciones</h2>
              <p class="product-form__section-desc">Google Analytics y Facebook Pixel (preparados para activacion futura)</p>
              <div class="form-grid">
                <div class="form-group">
                  <label class="form-label">Google Analytics 4 — Measurement ID</label>
                  <input type="text" class="form-control" [(ngModel)]="config.ga4Id" name="ga4Id" placeholder="G-XXXXXXXXXX" maxlength="20">
                  <div class="form-check" style="margin-top: 8px;">
                    <label style="display: flex; align-items: center; gap: 8px; cursor: pointer; font-size: 13px;">
                      <input type="checkbox" [(ngModel)]="config.ga4Enabled" name="ga4Enabled">
                      Activar Google Analytics
                    </label>
                  </div>
                </div>
                <div class="form-group">
                  <label class="form-label">Facebook Pixel ID</label>
                  <input type="text" class="form-control" [(ngModel)]="config.fbPixelId" name="fbPixelId" placeholder="000000000000000" maxlength="20">
                  <div class="form-check" style="margin-top: 8px;">
                    <label style="display: flex; align-items: center; gap: 8px; cursor: pointer; font-size: 13px;">
                      <input type="checkbox" [(ngModel)]="config.fbPixelEnabled" name="fbPixelEnabled">
                      Activar Facebook Pixel
                    </label>
                  </div>
                </div>
              </div>
            </div>
          }

          @if (activeTab === 'contacto') {
            <!-- REQ-304: Contact settings -->
            <div class="product-form__section">
              <h2 class="product-form__section-title">Informacion de Contacto</h2>
              <p class="product-form__section-desc">Datos de contacto que se muestran en el sitio publico</p>
              <div class="form-grid">
                <div class="form-group">
                  <label class="form-label">Telefono principal</label>
                  <input type="text" class="form-control" [(ngModel)]="config.phone" name="phone" placeholder="+506 2260-9020" maxlength="20">
                </div>
                <div class="form-group">
                  <label class="form-label">Correo electronico</label>
                  <input type="email" class="form-control" [(ngModel)]="config.email" name="email" placeholder="hola@linkdesign.cr" maxlength="254">
                </div>
                <div class="form-group">
                  <label class="form-label">Direccion (Espanol)</label>
                  <input type="text" class="form-control" [(ngModel)]="addressEs" name="addressEs" maxlength="200">
                </div>
                <div class="form-group">
                  <label class="form-label">Direccion (Ingles)</label>
                  <input type="text" class="form-control" [(ngModel)]="addressEn" name="addressEn" maxlength="200">
                </div>
                <div class="form-group">
                  <label class="form-label">Horario (Espanol)</label>
                  <input type="text" class="form-control" [(ngModel)]="hoursEs" name="hoursEs" placeholder="Lunes a Viernes: 8:00 - 17:00" maxlength="200">
                </div>
                <div class="form-group">
                  <label class="form-label">Horario (Ingles)</label>
                  <input type="text" class="form-control" [(ngModel)]="hoursEn" name="hoursEn" placeholder="Monday to Friday: 8:00 - 17:00" maxlength="200">
                </div>
                <div class="form-group form-group-full">
                  <label class="form-label">Numero de WhatsApp (para boton flotante)</label>
                  <input type="text" class="form-control" [(ngModel)]="config.whatsapp" name="whatsapp" placeholder="+50622390000" maxlength="20">
                  <span class="form-hint">Numero completo con codigo de pais, sin espacios ni guiones</span>
                </div>
              </div>
            </div>
          }

          @if (activeTab === 'redes') {
            <!-- REQ-305: Social media settings -->
            <div class="product-form__section">
              <h2 class="product-form__section-title">Redes Sociales</h2>
              <p class="product-form__section-desc">URLs de perfiles en redes sociales</p>
              <div class="form-grid">
                <div class="form-group">
                  <label class="form-label">Facebook URL</label>
                  <input type="url" class="form-control" [(ngModel)]="config.facebook" name="facebook" placeholder="https://facebook.com/hesacr" maxlength="500">
                </div>
                <div class="form-group">
                  <label class="form-label">Instagram URL</label>
                  <input type="url" class="form-control" [(ngModel)]="config.instagram" name="instagram" placeholder="https://instagram.com/hesacr" maxlength="500">
                </div>
                <div class="form-group">
                  <label class="form-label">LinkedIn URL</label>
                  <input type="url" class="form-control" [(ngModel)]="config.linkedin" name="linkedin" placeholder="https://linkedin.com/company/hesa" maxlength="500">
                </div>
                <div class="form-group">
                  <label class="form-label">YouTube URL</label>
                  <input type="url" class="form-control" [(ngModel)]="config.youtube" name="youtube" placeholder="https://youtube.com/@hesa" maxlength="500">
                </div>
              </div>
            </div>
          }

          @if (activeTab === 'seo') {
            <!-- REQ-306: SEO settings -->
            <div class="product-form__section">
              <h2 class="product-form__section-title">SEO y Open Graph</h2>
              <p class="product-form__section-desc">Metadatos para buscadores y compartir en redes</p>
              <div class="form-grid">
                <div class="form-group">
                  <label class="form-label">Meta titulo (Espanol)</label>
                  <input type="text" class="form-control" [(ngModel)]="metaTitleEs" name="metaTitleEs" maxlength="70">
                </div>
                <div class="form-group">
                  <label class="form-label">Meta titulo (Ingles)</label>
                  <input type="text" class="form-control" [(ngModel)]="metaTitleEn" name="metaTitleEn" maxlength="70">
                </div>
                <div class="form-group form-group-full">
                  <label class="form-label">Meta descripcion (Espanol)</label>
                  <textarea class="form-control" [(ngModel)]="metaDescEs" name="metaDescEs" rows="2" maxlength="160"></textarea>
                </div>
                <div class="form-group form-group-full">
                  <label class="form-label">Meta descripcion (Ingles)</label>
                  <textarea class="form-control" [(ngModel)]="metaDescEn" name="metaDescEn" rows="2" maxlength="160"></textarea>
                </div>
                <div class="form-group form-group-full">
                  <label class="form-label">Imagen para compartir (OG Image)</label>
                  <p class="form-hint">Tamano recomendado: 1200x630px</p>
                  @if (config.ogImage) {
                    <div class="settings-page__og-preview">
                      <img [src]="config.ogImage" alt="OG Image preview">
                    </div>
                  }
                  <input type="file" class="form-control" accept="image/*" (change)="uploadOgImage($event)">
                </div>
              </div>
            </div>
          }

          <div class="settings-page__actions">
            <button type="submit" class="btn btn-primary" [disabled]="saving()">
              @if (saving()) {
                <span class="spinner-sm"></span> Guardando...
              } @else {
                Guardar configuracion
              }
            </button>
          </div>
        </form>
      }
    </div>
  `,
  styles: [`
    .settings-page__title { font-size: 24px; font-weight: 700; margin-bottom: 24px; }
    .settings-page__form { max-width: 800px; }
    .settings-page__actions { margin-top: 32px; padding-top: 24px; border-top: 1px solid var(--neutral-200); }
    .settings-page__skeleton { max-width: 800px; }
    .settings-page__og-preview { margin: 12px 0; }
    .settings-page__og-preview img { max-width: 400px; border-radius: 8px; border: 1px solid var(--neutral-200); }
    .form-hint { font-size: 12px; color: var(--neutral-400); margin-top: 4px; }
    .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
    .form-group { margin-bottom: 0; }
    .form-group-full { grid-column: 1 / -1; }
    .skeleton-block { background: linear-gradient(90deg, var(--neutral-100) 25%, var(--neutral-50) 50%, var(--neutral-100) 75%); background-size: 200% 100%; animation: shimmer 1.5s infinite; }
    @keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }
    @media (max-width: 767px) { .form-grid { grid-template-columns: 1fr; } }
  `]
})
export class AdminSettingsComponent implements OnInit {
  private api = inject(ApiService);
  private toast = inject(ToastService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private destroyRef = inject(DestroyRef);

  loading = signal(true);
  saving = signal(false);
  activeTab = 'general';

  config: ApiSiteConfig & Record<string, unknown> = {};

  // Bilingual field helpers
  addressEs = '';
  addressEn = '';
  hoursEs = '';
  hoursEn = '';
  metaTitleEs = '';
  metaTitleEn = '';
  metaDescEs = '';
  metaDescEn = '';

  async ngOnInit(): Promise<void> {
    // Determine active tab from URL
    const segments = this.route.snapshot.url;
    const lastSegment = segments[segments.length - 1]?.path || 'general';
    this.activeTab = lastSegment;

    // Subscribe to route changes for tab switching (auto-cleaned on destroy)
    this.router.events.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
      const url = this.router.url;
      if (url.includes('configuracion/contacto')) this.activeTab = 'contacto';
      else if (url.includes('configuracion/redes')) this.activeTab = 'redes';
      else if (url.includes('configuracion/seo')) this.activeTab = 'seo';
      else this.activeTab = 'general';
    });

    await this.loadSettings();
  }

  async loadSettings(): Promise<void> {
    this.loading.set(true);
    try {
      const settings = await this.api.adminGetSettings();
      this.config = { ...settings };
      // Unpack bilingual fields
      this.addressEs = (settings.address as { es: string; en: string })?.es || '';
      this.addressEn = (settings.address as { es: string; en: string })?.en || '';
      this.hoursEs = (settings.hours as { es: string; en: string })?.es || '';
      this.hoursEn = (settings.hours as { es: string; en: string })?.en || '';
      this.metaTitleEs = (settings.metaTitle as { es: string; en: string })?.es || '';
      this.metaTitleEn = (settings.metaTitle as { es: string; en: string })?.en || '';
      this.metaDescEs = (settings.metaDescription as { es: string; en: string })?.es || '';
      this.metaDescEn = (settings.metaDescription as { es: string; en: string })?.en || '';
    } catch {
      this.toast.error('Error al cargar la configuracion');
    }
    this.loading.set(false);
  }

  async save(): Promise<void> {
    this.saving.set(true);
    try {
      const data: Record<string, unknown> = {};

      if (this.activeTab === 'general') {
        data['siteName'] = this.config.siteName;
        data['defaultLang'] = this.config.defaultLang;
        data['ga4Id'] = this.config.ga4Id;
        data['ga4Enabled'] = this.config.ga4Enabled;
        data['fbPixelId'] = this.config.fbPixelId;
        data['fbPixelEnabled'] = this.config.fbPixelEnabled;
      } else if (this.activeTab === 'contacto') {
        data['phone'] = this.config.phone;
        data['email'] = this.config.email;
        data['address'] = { es: this.addressEs, en: this.addressEn };
        data['hours'] = { es: this.hoursEs, en: this.hoursEn };
        data['whatsapp'] = this.config.whatsapp;
      } else if (this.activeTab === 'redes') {
        data['facebook'] = this.config['facebook'];
        data['instagram'] = this.config['instagram'];
        data['linkedin'] = this.config['linkedin'];
        data['youtube'] = this.config['youtube'];
      } else if (this.activeTab === 'seo') {
        data['metaTitle'] = { es: this.metaTitleEs, en: this.metaTitleEn };
        data['metaDescription'] = { es: this.metaDescEs, en: this.metaDescEn };
      }

      await this.api.adminUpdateSettings(this.activeTab, data);
      this.toast.success('Configuracion guardada correctamente');
    } catch {
      this.toast.error('Error al guardar la configuracion');
    }
    this.saving.set(false);
  }

  async uploadOgImage(event: Event): Promise<void> {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;
    try {
      const result = await this.api.adminUploadOgImage(file);
      this.config.ogImage = result.ogImage;
      this.toast.success('Imagen OG actualizada');
    } catch {
      this.toast.error('Error al subir la imagen');
    }
  }
}
