import { Component, computed, inject, signal, OnInit, OnDestroy } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BreadcrumbComponent } from '../../../shared/components/breadcrumb/breadcrumb.component';
import { BrandCardComponent } from '../../components/brand-card/brand-card.component';
import { ApiService, ApiBrand } from '../../../shared/services/api.service';
import { I18nService } from '../../../shared/services/i18n.service';
import { SeoService } from '../../../shared/services/seo.service';
import { getHomeLabel, getBrandsSegment } from '../../../shared/utils/route-helpers';

@Component({
  selector: 'app-brands',
  standalone: true,
  imports: [RouterLink, BreadcrumbComponent, BrandCardComponent],
  templateUrl: './brands.component.html',
  styleUrl: './brands.component.scss'
})
export class BrandsComponent implements OnInit, OnDestroy {
  private api = inject(ApiService);
  private seo = inject(SeoService);
  i18n = inject(I18nService);
  brands = signal<ApiBrand[]>([]);
  featuredBrandIds = signal<string[]>([]);
  sortedBrands = computed(() => {
    const featuredOrder = new Map(this.featuredBrandIds().map((id, index) => [id, index]));

    return [...this.brands()].sort((a, b) => {
      const aIsFeatured = featuredOrder.has(a._id);
      const bIsFeatured = featuredOrder.has(b._id);

      if (aIsFeatured !== bIsFeatured) {
        return aIsFeatured ? -1 : 1;
      }

      if (aIsFeatured && bIsFeatured) {
        return (featuredOrder.get(a._id) ?? Number.MAX_SAFE_INTEGER) - (featuredOrder.get(b._id) ?? Number.MAX_SAFE_INTEGER);
      }

      return a.name.localeCompare(b.name, 'es', { sensitivity: 'base' });
    });
  });
  loading = signal(true);
  error = signal(false);

  get breadcrumbs() {
    const lang = this.i18n.currentLang();
    return [
      { label: getHomeLabel(lang), url: this.i18n.getLangPrefix() },
      { label: lang === 'es' ? 'Marcas' : 'Brands' }
    ];
  }

  async ngOnInit(): Promise<void> {
    // BUG-013: Set SEO tags BEFORE API call to preserve language context even on failure
    const lang = this.i18n.currentLang();
    this.seo.setMetaTags({
      title: lang === 'es' ? 'Marcas' : 'Brands',
      description: lang === 'es'
        ? 'Marcas exclusivas de fármacos veterinarios, alimentos y equipos distribuidas por HESA en Costa Rica.'
        : 'Exclusive international brands of veterinary pharmaceuticals, food, and equipment distributed by HESA, a trusted distributor in Costa Rica.',
      url: `/${lang}/${getBrandsSegment(lang)}`,
    });
    this.seo.setHreflang('/es/marcas', '/en/brands');

    await this.loadBrands();
  }

  ngOnDestroy(): void {
    this.seo.clearDynamicTags();
  }

  async loadBrands(): Promise<void> {
    this.loading.set(true);
    this.error.set(false);
    try {
      const [data, homeData] = await Promise.all([
        this.api.getBrands(),
        this.api.getHomeData().catch(() => null),
      ]);
      this.brands.set(data);
      this.featuredBrandIds.set((homeData?.featuredBrands ?? []).map(brand => brand._id));
    } catch {
      this.error.set(true);
    }
    this.loading.set(false);
  }

  isFeaturedBrand(brandId: string): boolean {
    return this.featuredBrandIds().includes(brandId);
  }
}
