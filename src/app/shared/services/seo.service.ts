import { Injectable, inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Title, Meta } from '@angular/platform-browser';
import { I18nService } from './i18n.service';

@Injectable({ providedIn: 'root' })
export class SeoService {
  private title = inject(Title);
  private meta = inject(Meta);
  private i18n = inject(I18nService);
  private document = inject(DOCUMENT);

  private siteName = 'HESA - Herrera y Elizondo S.A.';
  private baseUrl = 'https://www.hesa.cr';

  /** Store global OG image from site config (NFR-029) */
  private globalOgImage = '';

  /**
   * NFR-029: Set global OG image from site config for fallback
   */
  setGlobalOgImage(imageUrl: string): void {
    this.globalOgImage = imageUrl;
  }

  /**
   * NFR-006: Set dynamic meta title and description
   * NFR-029: Open Graph tags for social sharing (Facebook, LinkedIn)
   */
  setMetaTags(config: {
    title: string;
    description: string;
    url?: string;
    image?: string;
    type?: string;
  }): void {
    const fullTitle = config.title ? `${config.title} | ${this.siteName}` : this.siteName;
    this.title.setTitle(fullTitle);

    this.meta.updateTag({ name: 'description', content: config.description });

    // Open Graph (NFR-029)
    this.meta.updateTag({ property: 'og:title', content: fullTitle });
    this.meta.updateTag({ property: 'og:description', content: config.description });
    this.meta.updateTag({ property: 'og:type', content: config.type || 'website' });
    this.meta.updateTag({ property: 'og:site_name', content: this.siteName });

    if (config.url) {
      const fullUrl = config.url.startsWith('http') ? config.url : `${this.baseUrl}${config.url}`;
      this.meta.updateTag({ property: 'og:url', content: fullUrl });
      this.meta.updateTag({ rel: 'canonical', href: config.url } as Record<string, string>);
    }

    // Use provided image, fall back to global OG image
    const ogImage = config.image || this.globalOgImage;
    if (ogImage) {
      this.meta.updateTag({ property: 'og:image', content: ogImage });
      this.meta.updateTag({ property: 'og:image:width', content: '1200' });
      this.meta.updateTag({ property: 'og:image:height', content: '630' });
    }

    // Twitter Card tags
    this.meta.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.meta.updateTag({ name: 'twitter:title', content: fullTitle });
    this.meta.updateTag({ name: 'twitter:description', content: config.description });
    if (ogImage) {
      this.meta.updateTag({ name: 'twitter:image', content: ogImage });
    }
  }

  /**
   * NFR-011, REQ-033: Set hreflang tags for current page
   */
  setHreflang(esPath: string, enPath: string): void {
    this.removeExistingHreflang();

    const esUrl = `${this.baseUrl}${esPath}`;
    const enUrl = `${this.baseUrl}${enPath}`;

    this.addLinkTag('alternate', esUrl, 'es');
    this.addLinkTag('alternate', enUrl, 'en');
    this.addLinkTag('alternate', esUrl, 'x-default');
  }

  private addLinkTag(rel: string, href: string, hreflang: string): void {
    const link = this.document.createElement('link');
    link.setAttribute('rel', rel);
    link.setAttribute('href', href);
    link.setAttribute('hreflang', hreflang);
    link.setAttribute('data-seo', 'hreflang');
    this.document.head.appendChild(link);
  }

  private removeExistingHreflang(): void {
    const existing = this.document.querySelectorAll('link[data-seo="hreflang"]');
    existing.forEach(el => el.remove());
  }

  /**
   * NFR-008: Set JSON-LD schema markup
   */
  setJsonLd(schema: Record<string, unknown>): void {
    this.removeExistingJsonLd();

    const script = this.document.createElement('script');
    script.setAttribute('type', 'application/ld+json');
    script.setAttribute('data-seo', 'jsonld');
    script.textContent = JSON.stringify(schema);
    this.document.head.appendChild(script);
  }

  private removeExistingJsonLd(): void {
    const existing = this.document.querySelectorAll('script[data-seo="jsonld"]');
    existing.forEach(el => el.remove());
  }

  /**
   * NFR-008: Organization schema (used on home page)
   */
  setOrganizationSchema(): void {
    this.setJsonLd({
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'HESA - Herrera y Elizondo S.A.',
      url: this.baseUrl,
      description: 'Importacion y distribucion de farmacos veterinarios, alimentos para animales y equipos veterinarios en Costa Rica',
      foundingDate: '1989',
      address: {
        '@type': 'PostalAddress',
        addressCountry: 'CR',
        addressRegion: 'San Jose',
      },
      contactPoint: {
        '@type': 'ContactPoint',
        contactType: 'customer service',
      },
    });
  }

  /**
   * REQ-126: Product schema markup
   */
  setProductSchema(product: {
    name: string;
    description: string;
    brand: string;
    category: string;
    image?: string;
    url: string;
  }): void {
    this.setJsonLd({
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: product.name,
      description: product.description,
      brand: {
        '@type': 'Brand',
        name: product.brand,
      },
      category: product.category,
      image: product.image || undefined,
      url: `${this.baseUrl}${product.url}`,
    });
  }

  /**
   * Clean up SEO tags on component destruction
   */
  clearDynamicTags(): void {
    this.removeExistingHreflang();
    this.removeExistingJsonLd();
  }
}
