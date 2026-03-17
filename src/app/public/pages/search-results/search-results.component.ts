import { Component, inject, signal, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { BreadcrumbComponent } from '../../../shared/components/breadcrumb/breadcrumb.component';
import { ProductCardComponent } from '../../components/product-card/product-card.component';
import { BrandCardComponent } from '../../components/brand-card/brand-card.component';
import { MockDataService, Product, Brand } from '../../../shared/services/mock-data.service';
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
  private mockData = inject(MockDataService);
  i18n = inject(I18nService);

  searchTerm = signal('');
  productResults = signal<Product[]>([]);
  brandResults = signal<Brand[]>([]);
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

  ngOnInit(): void {
    const rawQ = this.route.snapshot.queryParamMap.get('q') || '';
    // Sanitize: limit length, strip control characters
    // eslint-disable-next-line no-control-regex
    const q = rawQ.substring(0, 100).replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '').trim();
    this.searchTerm.set(q);

    if (q.length >= 3) {
      this.productResults.set(this.mockData.searchProducts(q));
      this.brandResults.set(this.mockData.searchBrands(q));
    }
    this.loading.set(false);
  }
}
