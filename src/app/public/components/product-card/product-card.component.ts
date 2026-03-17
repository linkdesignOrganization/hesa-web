import { Component, input, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Product } from '../../../shared/services/mock-data.service';
import { I18nService } from '../../../shared/services/i18n.service';
import { buildProductUrl } from '../../../shared/utils/route-helpers';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.scss'
})
export class ProductCardComponent {
  product = input<Product | null>(null);
  name = input('');
  brand = input('');
  variant = input<'grid' | 'carousel'>('grid');

  i18n = inject(I18nService);

  get displayName(): string {
    const p = this.product();
    if (p) return this.i18n.t(p.name);
    return this.name();
  }

  get displayBrand(): string {
    const p = this.product();
    if (p) return p.brand;
    return this.brand();
  }

  get productLink(): string {
    const p = this.product();
    if (!p) return '#';
    const lang = this.i18n.currentLang();
    return buildProductUrl(p.category, p.slug[lang], lang);
  }

  get productCategory(): string {
    const p = this.product();
    return p?.category ?? 'farmacos';
  }
}
