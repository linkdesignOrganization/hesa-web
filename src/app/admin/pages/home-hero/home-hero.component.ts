import { Component, inject, signal, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiService, ApiHomeConfig } from '../../../shared/services/api.service';
import { ToastService } from '../../../shared/services/toast.service';

@Component({
  selector: 'app-admin-home-hero',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div class="hero-editor">
      <h1 style="font-size: 24px; font-weight: 700; margin-bottom: 24px;">Editor del Hero</h1>

      @if (loading()) {
        <div style="display: flex; flex-direction: column; gap: 16px;">
          <div class="skeleton-block" style="height: 200px; border-radius: 12px;"></div>
          <div class="skeleton-block" style="height: 44px; border-radius: 10px;"></div>
          <div class="skeleton-block" style="height: 80px; border-radius: 10px;"></div>
        </div>
      } @else if (error()) {
        <div style="text-align: center; padding: 60px 0; color: var(--semantic-danger);">
          <p>Error al cargar la configuracion del hero.</p>
          <button class="btn btn-primary" style="margin-top: 16px;" (click)="loadConfig()">Reintentar</button>
        </div>
      } @else {
        <div class="hero-editor__layout">
          <!-- Image Preview -->
          <div class="hero-editor__preview">
            @if (heroImage()) {
              <div class="hero-editor__preview-image" [style.background-image]="'url(' + heroImage() + ')'">
                <button class="btn btn-outline btn-sm hero-editor__change-btn" (click)="fileInput.click()">Cambiar imagen</button>
              </div>
            } @else {
              <div class="hero-editor__preview-placeholder" (click)="fileInput.click()">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--neutral-300)" stroke-width="1.5"><rect width="18" height="18" x="3" y="3" rx="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>
                <p style="color: var(--neutral-400); margin-top: 12px;">Haz clic para subir imagen del hero</p>
                <span style="color: var(--neutral-300); font-size: 12px;">Recomendado: 1920x1080px, JPG o WebP</span>
              </div>
            }
            <input #fileInput type="file" accept="image/jpeg,image/png,image/webp" style="display: none;" (change)="onImageSelected($event)">
            @if (uploadingImage()) {
              <div class="hero-editor__upload-progress">
                <div class="hero-editor__upload-bar"></div>
              </div>
            }
          </div>

          <!-- Form Fields -->
          <div class="hero-editor__form">
            <div class="tabs-pill" style="margin-bottom: 16px;">
              <button class="tabs-pill__btn" [class.tabs-pill__btn--active]="activeLang() === 'es'" (click)="activeLang.set('es')">Espanol</button>
              <button class="tabs-pill__btn" [class.tabs-pill__btn--active]="activeLang() === 'en'" (click)="activeLang.set('en')">English</button>
            </div>

            @if (activeLang() === 'es') {
              <div class="form-group"><label class="form-label">Tag superior</label><input type="text" class="form-control" [(ngModel)]="tag.es"></div>
              <div class="form-group"><label class="form-label">Headline</label><textarea class="form-control" rows="2" [(ngModel)]="headline.es"></textarea></div>
              <div class="form-group"><label class="form-label">Subtitulo</label><textarea class="form-control" rows="2" [(ngModel)]="subtitle.es"></textarea></div>
              <div class="form-group"><label class="form-label">CTA Primario</label><input type="text" class="form-control" [(ngModel)]="ctaPrimary.es"></div>
              <div class="form-group"><label class="form-label">CTA Secundario</label><input type="text" class="form-control" [(ngModel)]="ctaSecondary.es"></div>
            } @else {
              <div class="form-group"><label class="form-label">Top Tag</label><input type="text" class="form-control" [(ngModel)]="tag.en"></div>
              <div class="form-group"><label class="form-label">Headline</label><textarea class="form-control" rows="2" [(ngModel)]="headline.en"></textarea></div>
              <div class="form-group"><label class="form-label">Subtitle</label><textarea class="form-control" rows="2" [(ngModel)]="subtitle.en"></textarea></div>
              <div class="form-group"><label class="form-label">Primary CTA</label><input type="text" class="form-control" [(ngModel)]="ctaPrimary.en"></div>
              <div class="form-group"><label class="form-label">Secondary CTA</label><input type="text" class="form-control" [(ngModel)]="ctaSecondary.en"></div>
            }

            <button class="btn btn-primary" [disabled]="saving()" (click)="save()">
              @if (saving()) { <span class="spinner-sm"></span> Guardando... } @else { Guardar cambios }
            </button>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .hero-editor__layout { display: grid; grid-template-columns: 1fr 1fr; gap: 32px; }
    .hero-editor__preview-placeholder { aspect-ratio: 16/9; background: var(--neutral-100); border-radius: 12px; display: flex; flex-direction: column; align-items: center; justify-content: center; cursor: pointer; border: 2px dashed var(--neutral-200); transition: border-color 0.2s; }
    .hero-editor__preview-placeholder:hover { border-color: var(--brand-primary); }
    .hero-editor__preview-image { aspect-ratio: 16/9; background-size: cover; background-position: center; border-radius: 12px; position: relative; display: flex; align-items: flex-end; justify-content: center; padding-bottom: 16px; }
    .hero-editor__change-btn { background: rgba(255,255,255,0.9) !important; }
    .hero-editor__upload-progress { margin-top: 8px; height: 4px; background: var(--neutral-200); border-radius: 2px; overflow: hidden; }
    .hero-editor__upload-bar { height: 100%; background: var(--brand-primary); border-radius: 2px; animation: uploadProgress 1.5s ease-in-out infinite; width: 60%; }
    .form-group { margin-bottom: 16px; }
    .spinner-sm { display: inline-block; width: 16px; height: 16px; border: 2px solid rgba(255,255,255,0.3); border-top-color: white; border-radius: 50%; animation: spin 0.6s linear infinite; margin-right: 8px; }
    .skeleton-block { background: linear-gradient(90deg, var(--neutral-100) 25%, var(--neutral-50) 50%, var(--neutral-100) 75%); background-size: 200% 100%; animation: shimmer 1.5s infinite; }
    @keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }
    @keyframes uploadProgress { 0% { transform: translateX(-100%); } 100% { transform: translateX(200%); } }
    @keyframes spin { to { transform: rotate(360deg); } }
    @media (max-width: 768px) { .hero-editor__layout { grid-template-columns: 1fr; } }
  `]
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
