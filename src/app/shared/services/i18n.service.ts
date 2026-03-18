import { Injectable, signal, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs';

export type Lang = 'es' | 'en';

const ROUTE_MAP: Record<string, Record<Lang, string>> = {
  catalogo: { es: 'catalogo', en: 'catalog' },
  catalog: { es: 'catalogo', en: 'catalog' },
  farmacos: { es: 'farmacos', en: 'pharmaceuticals' },
  pharmaceuticals: { es: 'farmacos', en: 'pharmaceuticals' },
  alimentos: { es: 'alimentos', en: 'food' },
  food: { es: 'alimentos', en: 'food' },
  equipos: { es: 'equipos', en: 'equipment' },
  equipment: { es: 'equipos', en: 'equipment' },
  marcas: { es: 'marcas', en: 'brands' },
  brands: { es: 'marcas', en: 'brands' },
  nosotros: { es: 'nosotros', en: 'about' },
  about: { es: 'nosotros', en: 'about' },
  distribuidores: { es: 'distribuidores', en: 'distributors' },
  distributors: { es: 'distribuidores', en: 'distributors' },
  contacto: { es: 'contacto', en: 'contact' },
  contact: { es: 'contacto', en: 'contact' },
  busqueda: { es: 'busqueda', en: 'search' },
  search: { es: 'busqueda', en: 'search' },
};

@Injectable({ providedIn: 'root' })
export class I18nService {
  currentLang = signal<Lang>('es');
  private platformId = inject(PLATFORM_ID);

  constructor(private router: Router) {
    this.detectLanguage();

    // Keep language in sync with router navigation
    this.router.events.pipe(
      filter((e): e is NavigationEnd => e instanceof NavigationEnd)
    ).subscribe(event => {
      const url = event.urlAfterRedirects || event.url;
      if (url.startsWith('/en/') || url === '/en') {
        this.currentLang.set('en');
      } else if (url.startsWith('/es/') || url === '/es') {
        this.currentLang.set('es');
      }
    });
  }

  private detectLanguage(): void {
    // BUG-V05: Use isPlatformBrowser for SSR safety
    if (!isPlatformBrowser(this.platformId)) {
      // During server-side prerendering, detect from the router URL
      const url = this.router.url;
      if (url.startsWith('/en/') || url === '/en') {
        this.currentLang.set('en');
      }
      return;
    }

    const path = window.location.pathname;
    if (path.startsWith('/en/') || path === '/en') {
      this.currentLang.set('en');
    } else if (path.startsWith('/es/') || path === '/es') {
      this.currentLang.set('es');
    } else {
      const browserLang = navigator.language?.substring(0, 2);
      this.currentLang.set(browserLang === 'en' ? 'en' : 'es');
    }
  }

  switchLanguage(lang: Lang): void {
    if (lang === this.currentLang()) return;
    this.currentLang.set(lang);
    const currentUrl = this.router.url;
    const translatedUrl = this.translateUrl(currentUrl, lang);
    this.router.navigateByUrl(translatedUrl);
  }

  private translateUrl(url: string, targetLang: Lang): string {
    const parts = url.split('/').filter(Boolean);
    if (parts[0] === 'es' || parts[0] === 'en') {
      parts[0] = targetLang;
    }

    const translatedParts = parts.map((part, index) => {
      if (index === 0) return part;
      const queryIndex = part.indexOf('?');
      const segment = queryIndex >= 0 ? part.substring(0, queryIndex) : part;
      const query = queryIndex >= 0 ? part.substring(queryIndex) : '';
      const mapping = ROUTE_MAP[segment];
      if (mapping) {
        return mapping[targetLang] + query;
      }
      return part;
    });

    return '/' + translatedParts.join('/');
  }

  t(texts: { es: string; en: string }): string {
    return texts[this.currentLang()];
  }

  getLangPrefix(): string {
    return '/' + this.currentLang();
  }

  getTranslatedRouteSegment(segment: string): string {
    const mapping = ROUTE_MAP[segment];
    return mapping ? mapping[this.currentLang()] : segment;
  }
}
