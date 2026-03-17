import { Component, inject, signal, OnInit, OnDestroy, ElementRef } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MockDataService, Brand } from '../../../shared/services/mock-data.service';
import { I18nService } from '../../../shared/services/i18n.service';
import { initFadeInObserver } from '../../../shared/utils/fade-in-observer';

@Component({
  selector: 'app-brand-logos-row',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './brand-logos-row.component.html',
  styleUrl: './brand-logos-row.component.scss'
})
export class BrandLogosRowComponent implements OnInit, OnDestroy {
  private mockData = inject(MockDataService);
  private el = inject(ElementRef);
  i18n = inject(I18nService);

  featuredBrands = signal<Brand[]>([]);
  private fadeObserver: IntersectionObserver | null = null;

  async ngOnInit(): Promise<void> {
    const brands = await this.mockData.getFeaturedBrands();
    this.featuredBrands.set(brands);

    // Initialize fade observer after data is loaded and DOM has rendered
    // Use setTimeout to let Angular complete the change detection cycle
    setTimeout(() => {
      this.fadeObserver = initFadeInObserver(this.el, { threshold: 0.05, rootMargin: '0px 0px 0px 0px' });
      // Safety fallback: if no observer was created (no elements found) or
      // if the section is already in viewport but observer didn't fire,
      // force visibility after a brief delay
      setTimeout(() => {
        const section = this.el.nativeElement.querySelector('.fade-in-section');
        if (section && !section.classList.contains('is-visible')) {
          section.classList.add('is-visible');
        }
      }, 800);
    }, 50);
  }

  ngOnDestroy(): void {
    this.fadeObserver?.disconnect();
  }
}
