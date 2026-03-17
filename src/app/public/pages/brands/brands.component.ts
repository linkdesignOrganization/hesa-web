import { Component, inject, signal, OnInit } from '@angular/core';
import { BreadcrumbComponent } from '../../../shared/components/breadcrumb/breadcrumb.component';
import { BrandCardComponent } from '../../components/brand-card/brand-card.component';
import { MockDataService, Brand } from '../../../shared/services/mock-data.service';
import { I18nService } from '../../../shared/services/i18n.service';
import { getHomeLabel } from '../../../shared/utils/route-helpers';

@Component({
  selector: 'app-brands',
  standalone: true,
  imports: [BreadcrumbComponent, BrandCardComponent],
  templateUrl: './brands.component.html',
  styleUrl: './brands.component.scss'
})
export class BrandsComponent implements OnInit {
  private mockData = inject(MockDataService);
  i18n = inject(I18nService);
  brands = signal<Brand[]>([]);
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
  }

  async loadBrands(): Promise<void> {
    this.loading.set(true);
    this.error.set(false);
    try {
      const data = await this.mockData.getBrands();
      this.brands.set(data);
    } catch {
      this.error.set(true);
    }
    this.loading.set(false);
  }
}
