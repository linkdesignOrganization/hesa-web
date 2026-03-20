import { Component, signal, inject, OnDestroy, HostListener } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { LanguageSelectorComponent } from '../language-selector/language-selector.component';
import { SearchOverlayComponent } from '../search-overlay/search-overlay.component';
import { I18nService } from '../../services/i18n.service';
import { getBrandsSegment } from '../../utils/route-helpers';

interface LocalizedText {
  es: string;
  en: string;
}

type MegaCategory = 'farmacos' | 'alimentos' | 'equipos';

interface MegaFeaturedCard {
  name: LocalizedText;
  brand: string;
  image: string;
  brandLogo?: string;
  category: MegaCategory;
  meta: LocalizedText[];
}

interface MegaBrandLink {
  name: string;
  slug: string;
}

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, LanguageSelectorComponent, SearchOverlayComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnDestroy {
  i18n = inject(I18nService);
  isScrolled = signal(false);
  isMobileMenuOpen = signal(false);
  isSubmenuOpen = signal(false);
  isSearchOpen = signal(false);

  /** Which mega menu is currently open (null = none) */
  activeMega = signal<MegaCategory | null>(null);

  readonly categoryIcons: Record<MegaCategory, string> = {
    farmacos: 'pill',
    alimentos: 'pets',
    equipos: 'biotech'
  };

  readonly megaFeaturedProducts: Record<MegaCategory, MegaFeaturedCard[]> = {
    farmacos: [
      {
        name: { es: 'Clamovet 250 mg Caja x40 Tabletas', en: 'Clamovet 250 mg 40-Tablet Box' },
        brand: 'Orion Pharma',
        image: '/Clamovet 250 mg Caja x40 Tabletas.jpg',
        brandLogo: '/brands/orion-pharma/logo.svg',
        category: 'farmacos',
        meta: [
          { es: 'Perros y gatos', en: 'Dogs and cats' },
          { es: 'Antibiotico', en: 'Antibiotic' }
        ]
      },
      {
        name: { es: 'Toltravet Plus Caja x32 Tab', en: 'Toltravet Plus 32-Tablet Box' },
        brand: 'Trisal',
        image: '/Toltravet Plus Caja x32 Tab Antiparasitario Interno.jpg',
        brandLogo: '/brands/trisal/logo.png',
        category: 'farmacos',
        meta: [
          { es: 'Perros y gatos', en: 'Dogs and cats' },
          { es: 'Antiparasitario', en: 'Antiparasitic' }
        ]
      }
    ],
    alimentos: [
      {
        name: { es: 'SUSTILE Leche Maternizada para Cachorros 400 gr', en: 'SUSTILE Puppy Milk Replacer 400 g' },
        brand: 'New Born',
        image: '/SUSTILE Leche Maternizada para Cachorros 400 gr.jpg',
        brandLogo: '/brands/new-born/logo.png',
        category: 'alimentos',
        meta: [
          { es: 'Caninos', en: 'Dogs' },
          { es: 'Nutricion inicial', en: 'Starter nutrition' }
        ]
      },
      {
        name: { es: 'Felovite II con Taurina 2.5 oz', en: 'Felovite II with Taurine 2.5 oz' },
        brand: 'Mitzi',
        image: '/Felovite II con Taurina 2.5 oz Suplemento para gatos.jpg',
        brandLogo: '/brands/mitzi/mitzi-logo.webp',
        category: 'alimentos',
        meta: [
          { es: 'Felinos', en: 'Cats' },
          { es: 'Suplemento diario', en: 'Daily supplement' }
        ]
      }
    ],
    equipos: [
      {
        name: { es: 'Ciprovet 5 ml Colirio', en: 'Ciprovet 5 ml Eye Drops' },
        brand: 'Europlex',
        image: '/Ciprovet 5 ml Colirio Cicatrizante y Antibacteriano.jpg',
        brandLogo: '/brands/europlex/logo.png',
        category: 'equipos',
        meta: [
          { es: 'Diagnostico', en: 'Diagnostics' },
          { es: 'Consulta clinica', en: 'Clinical consult' }
        ]
      },
      {
        name: { es: 'Tobramax 5 ml', en: 'Tobramax 5 ml' },
        brand: 'Unimedical',
        image: '/Tobramax 5ml.jpg',
        brandLogo: '/brands/unimedical/logo.png',
        category: 'equipos',
        meta: [
          { es: 'Soporte oftalmologico', en: 'Ophthalmic support' },
          { es: 'Uso diario', en: 'Daily use' }
        ]
      }
    ]
  };

  readonly megaBrandLinks: Record<MegaCategory, MegaBrandLink[]> = {
    farmacos: [
      { name: 'Biozoo', slug: 'biozoo' },
      { name: 'Orion Pharma', slug: 'orion-pharma-animal-health' },
      { name: 'Unimedical', slug: 'unimedical' },
      { name: 'Vemedim', slug: 'vemedim' }
    ],
    alimentos: [
      { name: '1st Choice', slug: '1st-choice-nutrition' },
      { name: 'Mitzi', slug: 'mitzi-katzenstreu' },
      { name: 'Pronature', slug: 'pronature' },
      { name: 'Raff', slug: 'raff' }
    ],
    equipos: [
      { name: 'Emcoclavos', slug: 'emcoclavos-s-a' },
      { name: 'FionaVet', slug: 'fionavet' },
      { name: 'Kruuse', slug: 'kruuse' },
      { name: 'Mustad', slug: 'mustad' }
    ]
  };

  private megaCloseTimer: ReturnType<typeof setTimeout> | null = null;

  private onScroll = (): void => {
    this.isScrolled.set(window.scrollY > 50);
  };

  constructor() {
    if (typeof window !== 'undefined') {
      window.addEventListener('scroll', this.onScroll, { passive: true });
    }
  }

  ngOnDestroy(): void {
    if (typeof window !== 'undefined') {
      window.removeEventListener('scroll', this.onScroll);
    }
    if (this.megaCloseTimer) clearTimeout(this.megaCloseTimer);
  }

  openMega(category: MegaCategory): void {
    if (this.megaCloseTimer) {
      clearTimeout(this.megaCloseTimer);
      this.megaCloseTimer = null;
    }
    this.activeMega.set(category);
  }

  closeMega(): void {
    // Small delay so mouse can move from nav link to mega panel
    this.megaCloseTimer = setTimeout(() => {
      this.activeMega.set(null);
    }, 120);
  }

  keepMegaOpen(): void {
    if (this.megaCloseTimer) {
      clearTimeout(this.megaCloseTimer);
      this.megaCloseTimer = null;
    }
  }

  toggleMobileMenu(): void {
    this.isMobileMenuOpen.update(v => !v);
    if (this.isMobileMenuOpen()) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }

  closeMobileMenu(): void {
    this.isMobileMenuOpen.set(false);
    document.body.style.overflow = '';
  }

  toggleSubmenu(): void {
    this.isSubmenuOpen.update(v => !v);
  }

  openSearch(): void {
    this.isSearchOpen.set(true);
  }

  closeSearch(): void {
    this.isSearchOpen.set(false);
  }

  t(text: LocalizedText): string {
    return this.i18n.t(text);
  }

  getCategoryRoute(category: MegaCategory): string {
    const routeMap: Record<MegaCategory, LocalizedText> = {
      farmacos: { es: '/es/catalogo/farmacos', en: '/en/catalog/pharmaceuticals' },
      alimentos: { es: '/es/catalogo/alimentos', en: '/en/catalog/food' },
      equipos: { es: '/es/catalogo/equipos', en: '/en/catalog/equipment' }
    };

    return this.i18n.t(routeMap[category]);
  }

  getCategoryLabel(category: MegaCategory): string {
    const labels: Record<MegaCategory, LocalizedText> = {
      farmacos: { es: 'Farmacos', en: 'Pharmaceuticals' },
      alimentos: { es: 'Alimentos', en: 'Food' },
      equipos: { es: 'Equipos', en: 'Equipment' }
    };

    return this.i18n.t(labels[category]);
  }

  getBrandRoute(slug: string): string {
    const lang = this.i18n.currentLang();
    return `/${lang}/${getBrandsSegment(lang)}/${slug}`;
  }

  onSubmenuKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.isSubmenuOpen.update(v => !v);
    } else if (event.key === 'Escape') {
      this.isSubmenuOpen.set(false);
    }
  }

  @HostListener('document:keydown.escape')
  onEscapeKey(): void {
    if (this.isMobileMenuOpen()) {
      this.closeMobileMenu();
    }
    if (this.isSearchOpen()) {
      this.closeSearch();
    }
    if (this.activeMega()) {
      this.activeMega.set(null);
    }
  }
}
