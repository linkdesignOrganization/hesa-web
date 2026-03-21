import { Component, inject, signal, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService, ApiPageContent, ApiPageSection } from '../../../shared/services/api.service';
import { ToastService } from '../../../shared/services/toast.service';

@Component({
  selector: 'app-admin-content-editor',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './content-editor.component.html',
  styleUrl: './content-editor.component.scss'
})
export class AdminContentEditorComponent implements OnInit {
  private api = inject(ApiService);
  private toast = inject(ToastService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  loading = signal(true);
  error = signal(false);
  saving = signal(false);
  activeLang = signal<'es' | 'en'>('es');
  pageKey = signal('');
  pageLabel = signal('');
  sections = signal<ApiPageSection[]>([]);
  heroImage = signal('');

  private static pageLabels: Record<string, string> = {
    nosotros: 'Nosotros',
    distribuidores: 'Distribuidores',
    contacto: 'Contacto',
    politicas: 'Politicas Comerciales',
  };

  async ngOnInit(): Promise<void> {
    // Extract pageKey from route path: contenido/nosotros -> nosotros
    const urlSegments = this.router.url.split('/');
    const key = urlSegments[urlSegments.length - 1] || 'nosotros';
    this.pageKey.set(key);
    this.pageLabel.set(AdminContentEditorComponent.pageLabels[key] || key);
    await this.loadContent();
  }

  async loadContent(): Promise<void> {
    this.loading.set(true);
    this.error.set(false);
    try {
      const content = await this.api.adminGetPageContent(this.pageKey());
      this.sections.set(content.sections || []);
      this.heroImage.set(content.heroImage || '');
    } catch {
      this.error.set(true);
    }
    this.loading.set(false);
  }

  updateSectionValue(key: string, value: string): void {
    this.sections.update(sections =>
      sections.map(s => {
        if (s.key !== key) return s;
        const lang = this.activeLang();
        return {
          ...s,
          value: {
            ...s.value,
            [lang]: value,
          },
        };
      })
    );
  }

  async onImageSelected(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    try {
      const content = await this.api.adminUploadContentImage(this.pageKey(), file);
      this.heroImage.set(content.heroImage || '');
      this.toast.success('Imagen actualizada');
    } catch (error: any) {
      const message = error?.error?.error || 'Error al subir la imagen';
      this.toast.error(message);
    }
    input.value = '';
  }

  async save(): Promise<void> {
    this.saving.set(true);
    try {
      await this.api.adminUpdatePageContent(this.pageKey(), {
        sections: this.sections(),
      });
      this.toast.success('Contenido actualizado correctamente');
    } catch {
      this.toast.error('Error al guardar los cambios');
    }
    this.saving.set(false);
  }
}
