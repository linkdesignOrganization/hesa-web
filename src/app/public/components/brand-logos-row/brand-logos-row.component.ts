import { Component, inject, signal, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MockDataService, Brand } from '../../../shared/services/mock-data.service';
import { I18nService } from '../../../shared/services/i18n.service';

@Component({
  selector: 'app-brand-logos-row',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './brand-logos-row.component.html',
  styleUrl: './brand-logos-row.component.scss'
})
export class BrandLogosRowComponent implements OnInit {
  private mockData = inject(MockDataService);
  i18n = inject(I18nService);

  featuredBrands = signal<Brand[]>([]);

  async ngOnInit(): Promise<void> {
    const brands = await this.mockData.getFeaturedBrands();
    this.featuredBrands.set(brands);
  }
}
