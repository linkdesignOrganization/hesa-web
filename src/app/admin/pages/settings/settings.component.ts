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
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss'
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
    } catch (error: any) {
      const message = error?.error?.error || 'Error al subir la imagen';
      this.toast.error(message);
    }
  }
}
