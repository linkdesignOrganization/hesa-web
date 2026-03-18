import { Component, input, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { I18nService } from '../../../shared/services/i18n.service';
import { buildProductUrl } from '../../../shared/utils/route-helpers';

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
  variant = input<'grid' | 'carousel'>('grid');

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
      const brand = p['brand'];
      if (typeof brand === 'string') return brand;
      if (brand && typeof brand === 'object') return (brand as { name: string }).name || '';
    }
    return this.brand();
  }

  get productLink(): string {
    const p = this.product();
    if (!p) return '#';
    const lang = this.i18n.currentLang();
    const slug = p['slug'] as { es: string; en: string } | undefined;
    const category = p['category'] as string;
    if (slug && category) {
      return buildProductUrl(category, slug[lang], lang);
    }
    return '#';
  }

  get productCategory(): string {
    const p = this.product();
    return (p?.['category'] as string) ?? 'farmacos';
  }

  get productImage(): string | undefined {
    const p = this.product();
    if (!p) return undefined;
    const images = p['images'] as string[] | undefined;
    return images?.[0];
  }

  /** NFR-002: WebP source for <picture> element */
  get productImageWebP(): string | undefined {
    const img = this.productImage;
    if (!img) return undefined;
    return img.replace(/\.(jpe?g|png)$/i, '.webp');
  }
}
