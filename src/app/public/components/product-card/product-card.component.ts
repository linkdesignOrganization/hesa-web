import { Component, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { I18nService } from '../../../shared/services/i18n.service';
import { ApiProduct } from '../../../shared/services/api.service';
import { buildProductUrl, getCategoryLabel } from '../../../shared/utils/route-helpers';

/**
 * Product card used in catalog grids and carousels.
 * Accepts any product-like object with name, brand, category, slug, images.
 */
@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.scss'
})
export class ProductCardComponent {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  product = input<any>(null);
  name = input('');
  brand = input('');
  variant = input<'grid' | 'carousel' | 'discovery'>('grid');

  i18n = inject(I18nService);

  get displayName(): string {
    const p = this.product();
    if (p) {
      const nameObj = p['name'] as { es: string; en: string } | undefined;
      if (nameObj) return this.i18n.t(nameObj);
    }
    return this.name();
  }

  get displayBrand(): string {
    const p = this.product();
    if (p) {
      const brand = p.brand;
      if (typeof brand === 'string') return brand;
      if (brand && typeof brand === 'object') return brand.name || '';
    }
    return this.brand();
  }

  get productLink(): string {
    const p = this.product();
    if (!p) return '#';
    const lang = this.i18n.currentLang();
    const slug = p.slug;
    const category = p.category;
    if (slug && category) {
      return buildProductUrl(category, slug[lang], lang);
    }
    return '#';
  }

  get productCategory(): string {
    const p = this.product();
    return p?.category ?? 'farmacos';
  }

  get productImage(): string | undefined {
    const p = this.product();
    if (!p) return undefined;
    return p.images?.[0];
  }

  get displayCategoryLabel(): string {
    return getCategoryLabel(this.productCategory, this.i18n.currentLang());
  }

  get displayDescription(): string {
    const p = this.product() as ApiProduct | null;
    if (!p?.description) return '';
    return this.i18n.t(p.description);
  }

  get brandLogo(): string | undefined {
    const p = this.product() as ApiProduct | null;
    if (!p?.brand || typeof p.brand === 'string') return undefined;
    return p.brand.logo;
  }

  get brandInitials(): string {
    const tokens = this.displayBrand
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2);
    return tokens.map(token => token[0]?.toUpperCase() ?? '').join('') || 'H';
  }

  get quickFacts(): string[] {
    const p = this.product() as ApiProduct | null;
    if (!p) return [];

    const firstSpecies = p.species?.slice(0, 2).join(', ');
    const firstPresentation = p.presentations?.[0];

    if (p.category === 'farmacos') {
      return [firstSpecies, p.family, firstPresentation].filter(Boolean) as string[];
    }

    if (p.category === 'alimentos') {
      return [firstSpecies, p.lifeStage, firstPresentation].filter(Boolean) as string[];
    }

    return [p.equipmentType, firstPresentation, !firstPresentation ? firstSpecies || this.displayBrand : undefined]
      .filter(Boolean) as string[];
  }

  get ctaLabel(): string {
    return this.i18n.currentLang() === 'es' ? 'Ver producto' : 'View product';
  }

  get productAriaLabel(): string {
    return `${this.ctaLabel}: ${this.displayName}`;
  }
}
