import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LanguageSelectorComponent } from '../language-selector/language-selector.component';
import { I18nService } from '../../services/i18n.service';

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
  value: LocalizedText;
  href?: string;
}

interface FooterSocialLink {
  href: string;
  label: string;
  icon: 'facebook' | 'instagram' | 'whatsapp';
}

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterLink, LanguageSelectorComponent],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})
export class FooterComponent {
  i18n = inject(I18nService);

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
        { label: { es: 'Distribuidores', en: 'Distributors' }, route: { es: '/es/distribuidores', en: '/en/distributors' } },
        { label: { es: 'Contacto', en: 'Contact' }, route: { es: '/es/contacto', en: '/en/contact' } }
      ]
    }
  ];

  readonly footerMetaPills: LocalizedText[] = [
    { es: '37 años', en: '37 years' },
    { es: 'Cobertura nacional', en: 'Nationwide coverage' },
    { es: 'Marcas exclusivas', en: 'Exclusive brands' }
  ];

  readonly contactItems: FooterContactItem[] = [
    {
      icon: 'call',
      label: { es: 'Teléfono', en: 'Phone' },
      value: { es: '+506 2260-9020', en: '+506 2260-9020' },
      href: 'tel:+50622609020'
    },
    {
      icon: 'mail',
      label: { es: 'Correo', en: 'Email' },
      value: { es: 'info@hesa.co.cr', en: 'info@hesa.co.cr' },
      href: 'mailto:info@hesa.co.cr'
    },
    {
      icon: 'location_on',
      label: { es: 'Ubicación', en: 'Location' },
      value: { es: 'Heredia, Costa Rica', en: 'Heredia, Costa Rica' }
    },
    {
      icon: 'schedule',
      label: { es: 'Horario', en: 'Schedule' },
      value: { es: 'Lun - Vie · 8:00 a 17:00', en: 'Mon - Fri · 8:00 to 17:00' }
    }
  ];

  readonly socialLinks: FooterSocialLink[] = [
    { href: 'https://facebook.com/hesacr', label: 'Facebook', icon: 'facebook' },
    { href: 'https://instagram.com/hesacr', label: 'Instagram', icon: 'instagram' },
    { href: 'https://wa.me/50622609020', label: 'WhatsApp', icon: 'whatsapp' }
  ];

  t(text: LocalizedText): string {
    return this.i18n.t(text);
  }
}
