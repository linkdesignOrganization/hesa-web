import { Component, inject, signal, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ContactFormComponent } from '../../components/contact-form/contact-form.component';
import { ApiService, ApiPageContent } from '../../../shared/services/api.service';
import { I18nService } from '../../../shared/services/i18n.service';
import { SeoService } from '../../../shared/services/seo.service';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [ContactFormComponent],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss'
})
export class ContactComponent implements OnInit, OnDestroy {
  private api = inject(ApiService);
  i18n = inject(I18nService);
  private seo = inject(SeoService);
  private route = inject(ActivatedRoute);

  prefilledProduct = '';
  content = signal<ApiPageContent | null>(null);

  async ngOnInit(): Promise<void> {
    const producto = this.route.snapshot.queryParamMap.get('producto');
    if (producto) {
      this.prefilledProduct = producto.replace(/-/g, ' ');
    }

    // BUG-005/NFR-006: SEO meta tags and hreflang for contact page
    const lang = this.i18n.currentLang();
    this.seo.setMetaTags({
      title: lang === 'es' ? 'Contacto' : 'Contact',
      description: lang === 'es'
        ? 'Contacta a HESA para consultas sobre farmacos veterinarios, alimentos para animales y equipos veterinarios en Costa Rica.'
        : 'Contact HESA for inquiries about veterinary pharmaceuticals, animal food, and veterinary equipment in Costa Rica.',
      url: `/${lang}/${lang === 'es' ? 'contacto' : 'contact'}`,
    });
    this.seo.setHreflang('/es/contacto', '/en/contact');

    // Load contact page content
    try {
      const pageContent = await this.api.getPageContent('contacto');
      this.content.set(pageContent);
    } catch {
      // Silent fallback — use hardcoded defaults
    }
  }

  /** Helper to get section value from loaded content */
  getSection(key: string): string {
    const section = this.content()?.sections?.find(s => s.key === key);
    if (!section) return '';
    return this.i18n.t(section.value) || '';
  }

  ngOnDestroy(): void {
    this.seo.clearDynamicTags();
  }
}
