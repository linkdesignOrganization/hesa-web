import { Component, inject, signal, OnInit, PLATFORM_ID, Input } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs';
import { ApiService } from '../../services/api.service';
import { I18nService } from '../../services/i18n.service';

@Component({
  selector: 'app-whatsapp-fab',
  standalone: true,
  templateUrl: './whatsapp-fab.component.html',
  styleUrl: './whatsapp-fab.component.scss'
})
export class WhatsappFabComponent implements OnInit {
  @Input() isHidden = false;

  private api = inject(ApiService);
  private i18n = inject(I18nService);
  private router = inject(Router);
  private platformId = inject(PLATFORM_ID);

  whatsappNumber = signal('+50622390000');
  currentPageContext = signal('');

  ngOnInit(): void {
    // Load WhatsApp number from site config (REQ-023)
    this.loadConfig();

    // Update page context on navigation for contextual message (REQ-022)
    if (isPlatformBrowser(this.platformId)) {
      this.updatePageContext(this.router.url);
      this.router.events.pipe(
        filter((e): e is NavigationEnd => e instanceof NavigationEnd)
      ).subscribe(event => {
        this.updatePageContext(event.url);
      });
    }
  }

  private async loadConfig(): Promise<void> {
    try {
      const config = await this.api.getSiteConfig();
      if (config.whatsapp) {
        this.whatsappNumber.set(config.whatsapp);
      }
    } catch {
      // Use default number
    }
  }

  private updatePageContext(url: string): void {
    const lang = this.i18n.currentLang();
    let context = '';

    if (url.includes('/catalogo/') || url.includes('/catalog/')) {
      // Product detail page
      const segments = url.split('/');
      const slug = segments[segments.length - 1];
      if (slug && !['farmacos', 'alimentos', 'equipos', 'pharmaceuticals', 'food', 'equipment'].includes(slug)) {
        const productName = slug.replace(/-/g, ' ');
        context = lang === 'es'
          ? `Hola, me interesa el producto: ${productName}`
          : `Hi, I'm interested in the product: ${productName}`;
      }
    }

    if (!context) {
      context = lang === 'es'
        ? 'Hola, me gustaría obtener información'
        : 'Hi, I would like to get information';
    }

    this.currentPageContext.set(context);
  }

  getWhatsAppUrl(): string {
    const number = this.whatsappNumber().replace(/[^0-9]/g, '');
    const text = encodeURIComponent(this.currentPageContext());
    return `https://wa.me/${number}?text=${text}`;
  }
}
