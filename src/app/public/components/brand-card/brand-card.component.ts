import { Component, input, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Brand } from '../../../shared/services/mock-data.service';
import { I18nService } from '../../../shared/services/i18n.service';
import { getBrandsSegment } from '../../../shared/utils/route-helpers';

@Component({
  selector: 'app-brand-card',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './brand-card.component.html',
  styleUrl: './brand-card.component.scss'
})
export class BrandCardComponent {
  brand = input<Brand | null>(null);
  name = input('');
  country = input('');
  categories = input<string[]>([]);

  i18n = inject(I18nService);

  get displayName(): string { return this.brand()?.name || this.name(); }
  get displayCountry(): string { return this.brand()?.country || this.country(); }
  get displayCategories(): string[] { return this.brand()?.categories || this.categories(); }
  get logoInitial(): string { return this.brand()?.logoPlaceholder || this.displayName.charAt(0); }

  get brandLink(): string {
    const b = this.brand();
    if (!b) return '#';
    const lang = this.i18n.currentLang();
    return '/' + lang + '/' + getBrandsSegment(lang) + '/' + b.slug;
  }
}
