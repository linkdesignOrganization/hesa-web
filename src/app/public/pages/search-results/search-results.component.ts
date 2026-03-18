import { Component, inject, signal, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { BreadcrumbComponent } from '../../../shared/components/breadcrumb/breadcrumb.component';
import { ProductCardComponent } from '../../components/product-card/product-card.component';
import { BrandCardComponent } from '../../components/brand-card/brand-card.component';
import { ApiService } from '../../../shared/services/api.service';
import { I18nService } from '../../../shared/services/i18n.service';
import { getHomeLabel } from '../../../shared/utils/route-helpers';

@Component({
  selector: 'app-search-results',
  standalone: true,
  imports: [RouterLink, BreadcrumbComponent, ProductCardComponent, BrandCardComponent],
  templateUrl: './search-results.component.html',
  styleUrl: './search-results.component.scss'
})
export class SearchResultsComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private api = inject(ApiService);
  i18n = inject(I18nService);

  searchTerm = signal('');
  productResults = signal<Record<string, unknown>[]>([]);
  brandResults = signal<Record<string, unknown>[]>([]);
  loading = signal(true);

  get breadcrumbs() {
    const lang = this.i18n.currentLang();
    return [
      { label: getHomeLabel(lang), url: this.i18n.getLangPrefix() },
      { label: lang === 'es' ? 'Resultados de busqueda' : 'Search results' }
    ];
  }

  get hasResults(): boolean {
    return this.productResults().length > 0 || this.brandResults().length > 0;
  }

  async ngOnInit(): Promise<void> {
    const rawQ = this.route.snapshot.queryParamMap.get('q') || '';
    // eslint-disable-next-line no-control-regex
    const q = rawQ.substring(0, 100).replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '').trim();
    this.searchTerm.set(q);

    if (q.length >= 2) {
      try {
        const results = await this.api.search(q, this.i18n.currentLang());
        // Map to products with slug for product card
        const productsMapped = results.products.map(p => ({
          _id: p.id,
          name: p.name,
          slug: p.slug,
          brand: p.brand,
          category: p.category,
          images: p.image ? [p.image] : [],
        }));
        const brandsMapped = results.brands.map(b => ({
          _id: b.id,
          name: b.name,
          slug: b.slug,
          logo: b.logo,
          country: b.country,
          categories: [],
        }));
        this.productResults.set(productsMapped);
        this.brandResults.set(brandsMapped);
      } catch {
        // Search failed silently
      }
    }
    this.loading.set(false);
  }
}
