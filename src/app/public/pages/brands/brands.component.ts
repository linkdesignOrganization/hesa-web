import { Component, inject, signal, OnInit, OnDestroy } from '@angular/core';
import { BreadcrumbComponent } from '../../../shared/components/breadcrumb/breadcrumb.component';
import { BrandCardComponent } from '../../components/brand-card/brand-card.component';
import { ApiService, ApiBrand } from '../../../shared/services/api.service';
import { I18nService } from '../../../shared/services/i18n.service';
import { SeoService } from '../../../shared/services/seo.service';
import { getHomeLabel, getBrandsSegment } from '../../../shared/utils/route-helpers';

@Component({
  selector: 'app-brands',
  standalone: true,
  imports: [BreadcrumbComponent, BrandCardComponent],
  templateUrl: './brands.component.html',
  styleUrl: './brands.component.scss'
})
export class BrandsComponent implements OnInit, OnDestroy {
  private api = inject(ApiService);
  private seo = inject(SeoService);
  i18n = inject(I18nService);
  brands = signal<ApiBrand[]>([]);
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
    await this.loadBrands();

    // REQ-147: SEO meta tags for brands page
    const lang = this.i18n.currentLang();
    this.seo.setMetaTags({
      title: lang === 'es' ? 'Marcas' : 'Brands',
      description: lang === 'es'
        ? 'Marcas exclusivas de farmacos veterinarios, alimentos y equipos distribuidas por HESA en Costa Rica.'
        : 'Exclusive brands of veterinary pharmaceuticals, food, and equipment distributed by HESA in Costa Rica.',
      url: `/${lang}/${getBrandsSegment(lang)}`,
    });
    this.seo.setHreflang('/es/marcas', '/en/brands');
  }

  ngOnDestroy(): void {
    this.seo.clearDynamicTags();
  }

  async loadBrands(): Promise<void> {
    this.loading.set(true);
    this.error.set(false);
    try {
      const data = await this.api.getBrands();
      this.brands.set(data);
    } catch {
      this.error.set(true);
    }
    this.loading.set(false);
  }
}
