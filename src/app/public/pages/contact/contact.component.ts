import { Component, computed, inject, signal, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ContactFormComponent } from '../../components/contact-form/contact-form.component';
import { ApiService, ApiSiteConfig } from '../../../shared/services/api.service';
import { I18nService } from '../../../shared/services/i18n.service';
import { SeoService } from '../../../shared/services/seo.service';

type PublicSocialIcon = 'facebook' | 'instagram' | 'linkedin' | 'youtube';

interface PublicSocialLink {
  href: string;
  icon: PublicSocialIcon;
  label: string;
}

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
  prefilledType = '';
  siteConfig = signal<ApiSiteConfig | null>(null);
  readonly socialLinks = computed<PublicSocialLink[]>(() => {
    const config = this.siteConfig();
    if (!config) return [];

    return [
      { href: this.normalizeUrl(config.facebook), icon: 'facebook', label: 'Facebook' },
      { href: this.normalizeUrl(config.instagram), icon: 'instagram', label: 'Instagram' },
      { href: this.normalizeUrl(config.linkedin), icon: 'linkedin', label: 'LinkedIn' },
      { href: this.normalizeUrl(config.youtube), icon: 'youtube', label: 'YouTube' },
    ].filter((link): link is PublicSocialLink => !!link.href);
  });
  readonly whatsappHref = computed(() => {
    const value = this.normalizeWhatsapp(this.siteConfig()?.whatsapp);
    return value ? `https://wa.me/${value}` : '';
  });

  async ngOnInit(): Promise<void> {
    const producto = this.route.snapshot.queryParamMap.get('producto');
    if (producto) {
      this.prefilledProduct = decodeURIComponent(producto).replace(/-/g, ' ');
    }

    const type = this.route.snapshot.queryParamMap.get('type');
    if (type && ['info', 'comercial', 'soporte', 'otro'].includes(type)) {
      this.prefilledType = type;
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

    try {
      const config = await this.api.getSiteConfig().catch(() => null);
      if (config) this.siteConfig.set(config);
    } catch {
      // Silent fallback — use hardcoded contact defaults
    }
  }

  /** Get config value or fallback */
  getConfigValue(key: keyof ApiSiteConfig): string {
    const config = this.siteConfig();
    if (!config) return '';
    const val = config[key];
    if (typeof val === 'string') return val;
    if (val && typeof val === 'object' && 'es' in val) {
      return this.i18n.t(val as { es: string; en: string });
    }
    return '';
  }

  private normalizeUrl(value: string | undefined): string {
    return value?.trim() || '';
  }

  private normalizeWhatsapp(value: string | undefined): string {
    return value?.replace(/[^0-9]/g, '') || '';
  }

  ngOnDestroy(): void {
    this.seo.clearDynamicTags();
  }
}
