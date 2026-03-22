import { Component, input, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { I18nService } from '../../../shared/services/i18n.service';
import { getBrandsSegment, getCategoryLabel } from '../../../shared/utils/route-helpers';

@Component({
  selector: 'app-brand-card',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './brand-card.component.html',
  styleUrl: './brand-card.component.scss'
})
export class BrandCardComponent {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  brand = input<any>(null);
  name = input('');
  country = input('');
  categories = input<string[]>([]);

  i18n = inject(I18nService);

  private normalizeCategory(category: string): 'farmacos' | 'alimentos' | 'equipos' | null {
    const normalized = category.trim().toLowerCase();
    if (['farmacos', 'pharmaceuticals'].includes(normalized)) return 'farmacos';
    if (['alimentos', 'food'].includes(normalized)) return 'alimentos';
    if (['equipos', 'equipment'].includes(normalized)) return 'equipos';
    return null;
  }

  get displayCategoryBadges(): Array<{ key: 'farmacos' | 'alimentos' | 'equipos' | null; label: string }> {
    return ((this.brand()?.['categories'] as string[]) || this.categories()).map(category => {
      const normalized = this.normalizeCategory(category);
      return {
        key: normalized,
        label: normalized ? getCategoryLabel(normalized, this.i18n.currentLang()) : category,
      };
    });
  }

  get displayName(): string { return (this.brand()?.['name'] as string) || this.name(); }
  get displayCountry(): string { return (this.brand()?.['country'] as string) || this.country(); }
  get logoInitial(): string { return (this.brand()?.['logoPlaceholder'] as string) || this.displayName.charAt(0); }
  get logoUrl(): string | undefined { return this.brand()?.['logo'] as string | undefined; }

  get brandLink(): string {
    const b = this.brand();
    if (!b) return '#';
    const slug = b['slug'] as string;
    if (!slug) return '#';
    const lang = this.i18n.currentLang();
    return '/' + lang + '/' + getBrandsSegment(lang) + '/' + slug;
  }
}
