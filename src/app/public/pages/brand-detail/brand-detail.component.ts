import { Component, inject, signal, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { BreadcrumbComponent } from '../../../shared/components/breadcrumb/breadcrumb.component';
import { ProductCardComponent } from '../../components/product-card/product-card.component';
import { MockDataService, Brand, Product } from '../../../shared/services/mock-data.service';
import { I18nService } from '../../../shared/services/i18n.service';
import { getHomeLabel, getBrandsSegment } from '../../../shared/utils/route-helpers';

@Component({
  selector: 'app-brand-detail',
  standalone: true,
  imports: [RouterLink, BreadcrumbComponent, ProductCardComponent],
  templateUrl: './brand-detail.component.html',
  styleUrl: './brand-detail.component.scss'
})
export class BrandDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private mockData = inject(MockDataService);
  i18n = inject(I18nService);

  brand = signal<Brand | null>(null);
  products = signal<Product[]>([]);
  loading = signal(true);
  notFound = signal(false);

  get breadcrumbs() {
    const b = this.brand();
    const lang = this.i18n.currentLang();
    return [
      { label: getHomeLabel(lang), url: this.i18n.getLangPrefix() },
      { label: lang === 'es' ? 'Marcas' : 'Brands', url: this.i18n.getLangPrefix() + '/' + getBrandsSegment(lang) },
      { label: b?.name || '' }
    ];
  }

  async ngOnInit(): Promise<void> {
    const slug = this.route.snapshot.paramMap.get('slug');
    if (slug) {
      const brand = await this.mockData.getBrandBySlug(slug);
      if (brand) {
        this.brand.set(brand);
        const products = await this.mockData.getProductsByBrand(slug);
        this.products.set(products);
      } else {
        this.notFound.set(true);
      }
    }
    this.loading.set(false);
  }
}
