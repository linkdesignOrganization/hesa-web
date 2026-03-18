import { Component, inject, signal, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiService, ApiHomeConfig } from '../../../shared/services/api.service';
import { ToastService } from '../../../shared/services/toast.service';

@Component({
  selector: 'app-admin-home-hero',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './home-hero.component.html',
  styleUrl: './home-hero.component.scss'
})
export class AdminHomeHeroComponent implements OnInit {
  private api = inject(ApiService);
  private toast = inject(ToastService);

  loading = signal(true);
  error = signal(false);
  saving = signal(false);
  uploadingImage = signal(false);
  activeLang = signal<'es' | 'en'>('es');
  heroImage = signal<string>('');

  tag = { es: '', en: '' };
  headline = { es: '', en: '' };
  subtitle = { es: '', en: '' };
  ctaPrimary = { es: '', en: '' };
  ctaSecondary = { es: '', en: '' };

  async ngOnInit(): Promise<void> {
    await this.loadConfig();
  }

  async loadConfig(): Promise<void> {
    this.loading.set(true);
    this.error.set(false);
    try {
      const config = await this.api.adminGetHomeConfig();
      this.heroImage.set(config.hero.image || '');
      this.tag = { ...config.hero.tag };
      this.headline = { ...config.hero.headline };
      this.subtitle = { ...config.hero.subtitle };
      this.ctaPrimary = { ...config.hero.ctaPrimary };
      this.ctaSecondary = { ...config.hero.ctaSecondary };
    } catch {
      this.error.set(true);
    }
    this.loading.set(false);
  }

  async onImageSelected(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    this.uploadingImage.set(true);
    try {
      const config = await this.api.adminUploadHeroImage(file);
      this.heroImage.set(config.hero.image || '');
      this.toast.success('Imagen del hero actualizada');
    } catch {
      this.toast.error('Error al subir la imagen');
    }
    this.uploadingImage.set(false);
    input.value = '';
  }

  async save(): Promise<void> {
    this.saving.set(true);
    try {
      await this.api.adminUpdateHero({
        tag: this.tag,
        headline: this.headline,
        subtitle: this.subtitle,
        ctaPrimary: this.ctaPrimary,
        ctaSecondary: this.ctaSecondary,
      });
      this.toast.success('Hero actualizado correctamente');
    } catch {
      this.toast.error('Error al guardar los cambios');
    }
    this.saving.set(false);
  }
}
