import { Component, inject, signal, OnInit, OnDestroy, ElementRef } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ApiService, ApiBrand } from '../../../shared/services/api.service';
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
  private api = inject(ApiService);
  private el = inject(ElementRef);
  i18n = inject(I18nService);

  featuredBrands = signal<ApiBrand[]>([]);
  private fadeObserver: IntersectionObserver | null = null;

  async ngOnInit(): Promise<void> {
    try {
      const brands = await this.api.getFeaturedBrands();
      this.featuredBrands.set(brands);
    } catch {
      // Silently fail — brands section just won't show
    }

    // Initialize fade observer after data is loaded and DOM has rendered
    setTimeout(() => {
      this.fadeObserver = initFadeInObserver(this.el, { threshold: 0.05, rootMargin: '0px 0px 0px 0px' });
      setTimeout(() => {
        const section = this.el.nativeElement.querySelector('.fade-in-section');
        if (section && !section.classList.contains('is-visible')) {
          section.classList.add('is-visible');
        }
      }, 800);
    }, 50);
  }

  /** NFR-002: Convert image URL to WebP variant for <picture> <source> */
  toWebP(url: string): string {
    return url.replace(/\.(jpe?g|png)$/i, '.webp');
  }

  ngOnDestroy(): void {
    this.fadeObserver?.disconnect();
  }
}
