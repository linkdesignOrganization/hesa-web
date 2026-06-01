import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LanguageSelectorComponent } from '../language-selector/language-selector.component';
import { I18nService } from '../../services/i18n.service';
import { ApiService, ApiSiteConfig } from '../../services/api.service';

interface LocalizedText {
  es: string;
  en: string;
}

interface FooterLink {
  label: LocalizedText;
  route: LocalizedText;
}

interface FooterSection {
  key: string;
  title: LocalizedText;
  links: FooterLink[];
}

interface FooterContactItem {
  icon: string;
  label: LocalizedText;
  value: string;
  href?: string;
}

interface FooterSocialLink {
  href: string;
  label: string;
  icon: 'facebook' | 'instagram' | 'linkedin' | 'youtube';
}

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterLink, LanguageSelectorComponent],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})
export class FooterComponent implements OnInit {
  private api = inject(ApiService);
  i18n = inject(I18nService);
  siteConfig = signal<ApiSiteConfig | null>(null);

  readonly footerSections: FooterSection[] = [
    {
      key: 'nav',
      title: { es: 'Navegación', en: 'Navigation' },
      links: [
        { label: { es: 'Inicio', en: 'Home' }, route: { es: '/es', en: '/en' } },
        { label: { es: 'Nosotros', en: 'About' }, route: { es: '/es/nosotros', en: '/en/about' } },
        { label: { es: 'Catálogo', en: 'Catalog' }, route: { es: '/es/catalogo', en: '/en/catalog' } },
        { label: { es: 'Marcas', en: 'Brands' }, route: { es: '/es/marcas', en: '/en/brands' } }
      ]
    },
    {
      key: 'categories',
      title: { es: 'Categorías', en: 'Categories' },
      links: [
        { label: { es: 'Fármacos', en: 'Pharmaceuticals' }, route: { es: '/es/catalogo/farmacos', en: '/en/catalog/pharmaceuticals' } },
        { label: { es: 'Alimentos', en: 'Food' }, route: { es: '/es/catalogo/alimentos', en: '/en/catalog/food' } },
        { label: { es: 'Equipos', en: 'Equipment' }, route: { es: '/es/catalogo/equipos', en: '/en/catalog/equipment' } }
      ]
    },
    {
      key: 'company',
      title: { es: 'Relación comercial', en: 'Business' },
      links: [
        { label: { es: 'Nuevo partner', en: 'New partner' }, route: { es: '/es/distribuidores', en: '/en/distributors' } },
        { label: { es: 'Contacto', en: 'Contact' }, route: { es: '/es/contacto', en: '/en/contact' } }
      ]
    }
  ];

  readonly footerMetaPills: LocalizedText[] = [
    { es: '37 años', en: '37 years' },
    { es: 'Cobertura nacional', en: 'Nationwide coverage' },
    { es: 'Marcas exclusivas', en: 'Exclusive brands' }
  ];

  readonly contactItems = computed<FooterContactItem[]>(() => {
    const phone = this.getContactValue('phone') || '+506 2260-9020';
    const email = this.getContactValue('email') || 'info@hesa.co.cr';
    const address = this.getContactValue('address') || 'Heredia, Costa Rica';
    const hours = this.getContactValue('hours') || (this.i18n.currentLang() === 'es' ? 'Lun - Vie · 8:00 a 17:00' : 'Mon - Fri · 8:00 to 17:00');

    return [
      {
        icon: 'call',
        label: { es: 'Teléfono', en: 'Phone' },
        value: phone,
        href: this.toTelHref(phone)
      },
      {
        icon: 'mail',
        label: { es: 'Correo', en: 'Email' },
        value: email,
        href: email ? `mailto:${email}` : undefined
      },
      {
        icon: 'location_on',
        label: { es: 'Ubicación', en: 'Location' },
        value: address
      },
      {
        icon: 'schedule',
        label: { es: 'Horario', en: 'Schedule' },
        value: hours
      }
    ];
  });

  readonly socialLinks = computed<FooterSocialLink[]>(() => {
    const config = this.siteConfig();
    if (!config) return [];

    return [
      { href: this.normalizeUrl(config.facebook), label: 'Facebook', icon: 'facebook' },
      { href: this.normalizeUrl(config.instagram), label: 'Instagram', icon: 'instagram' },
      { href: this.normalizeUrl(config.linkedin), label: 'LinkedIn', icon: 'linkedin' },
      { href: this.normalizeUrl(config.youtube), label: 'YouTube', icon: 'youtube' }
    ].filter((link): link is FooterSocialLink => !!link.href);
  });

  readonly whatsappHref = computed(() => {
    const number = this.normalizeWhatsapp(this.siteConfig()?.whatsapp);
    return number ? `https://wa.me/${number}` : '';
  });

  async ngOnInit(): Promise<void> {
    try {
      const config = await this.api.getSiteConfig();
      this.siteConfig.set(config);
    } catch {
      this.siteConfig.set(null);
    }
  }

  t(text: LocalizedText): string {
    return this.i18n.t(text);
  }

  private getContactValue(key: keyof ApiSiteConfig): string {
    const config = this.siteConfig();
    if (!config) return '';

    const value = config[key];
    if (typeof value === 'string') return value.trim();
    if (value && typeof value === 'object' && 'es' in value) {
      return this.i18n.t(value as { es: string; en: string }).trim();
    }
    return '';
  }

  private normalizeUrl(value: string | undefined): string {
    return value?.trim() || '';
  }

  private normalizeWhatsapp(value: string | undefined): string {
    return value?.replace(/[^0-9]/g, '') || '';
  }

  private toTelHref(value: string): string | undefined {
    const digits = value.replace(/[^0-9+]/g, '');
    return digits ? `tel:${digits}` : undefined;
  }
}
