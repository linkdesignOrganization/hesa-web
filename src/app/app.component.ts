import { Component, OnInit, AfterViewInit, OnDestroy, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, DOCUMENT } from '@angular/common';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs';
import { HeaderComponent } from './shared/components/header/header.component';
import { FooterComponent } from './shared/components/footer/footer.component';
import { WhatsappFabComponent } from './shared/components/whatsapp-fab/whatsapp-fab.component';
import { ToastContainerComponent } from './shared/components/toast/toast.component';
import { I18nService } from './shared/services/i18n.service';
import { ApiService } from './shared/services/api.service';
import { SeoService } from './shared/services/seo.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, FooterComponent, WhatsappFabComponent, ToastContainerComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit, AfterViewInit, OnDestroy {
  isAdminRoute = false;
  hideWhatsappFab = false;
  private router = inject(Router);
  private i18n = inject(I18nService);
  private platformId = inject(PLATFORM_ID);
  private api = inject(ApiService);
  private seo = inject(SeoService);
  private document = inject(DOCUMENT);
  private footerObserver?: IntersectionObserver;

  ngOnInit(): void {
    // BUG-V05: Only run browser-specific logic in the browser (not during prerendering)
    if (isPlatformBrowser(this.platformId)) {
      // Load site config for global OG image and analytics (NFR-027, NFR-029, NFR-030)
      this.loadSiteConfig();
    }

    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd)
    ).subscribe(event => {
      this.isAdminRoute = event.url.startsWith('/admin');

      if (isPlatformBrowser(this.platformId)) {
        if (this.isAdminRoute) {
          this.disconnectFooterObserver();
          this.hideWhatsappFab = false;
        } else {
          window.requestAnimationFrame(() => this.observeFooterVisibility());
        }
      }
    });
  }

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      window.requestAnimationFrame(() => this.observeFooterVisibility());
    }
  }

  ngOnDestroy(): void {
    this.disconnectFooterObserver();
  }

  private async loadSiteConfig(): Promise<void> {
    try {
      const config = await this.api.getSiteConfig();

      // NFR-029: Set global OG image
      if (config.ogImage) {
        this.seo.setGlobalOgImage(config.ogImage);
      }

      // NFR-027: Google Analytics 4 (prepared, activatable via config)
      if (config.ga4Enabled && config.ga4Id && /^G-[A-Z0-9]{1,15}$/.test(config.ga4Id)) {
        this.injectGA4(config.ga4Id);
      }

      // NFR-030: Facebook Pixel (prepared, activatable via config)
      if (config.fbPixelEnabled && config.fbPixelId && /^\d{1,20}$/.test(config.fbPixelId)) {
        this.injectFBPixel(config.fbPixelId);
      }
    } catch {
      // Silent fail — site works without config
    }
  }

  /**
   * NFR-027: Inject Google Analytics 4 script
   * Only injected when ga4Enabled is true and ga4Id is configured
   */
  private injectGA4(measurementId: string): void {
    // gtag.js script
    const gtagScript = this.document.createElement('script');
    gtagScript.async = true;
    gtagScript.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
    this.document.head.appendChild(gtagScript);

    // gtag initialization
    const initScript = this.document.createElement('script');
    initScript.textContent = `
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', '${measurementId}');
    `;
    this.document.head.appendChild(initScript);
  }

  /**
   * NFR-030: Inject Facebook Pixel script
   * Only injected when fbPixelEnabled is true and fbPixelId is configured
   */
  private injectFBPixel(pixelId: string): void {
    const script = this.document.createElement('script');
    script.textContent = `
      !function(f,b,e,v,n,t,s)
      {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
      n.callMethod.apply(n,arguments):n.queue.push(arguments)};
      if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
      n.queue=[];t=b.createElement(e);t.async=!0;
      t.src=v;s=b.getElementsByTagName(e)[0];
      s.parentNode.insertBefore(t,s)}(window, document,'script',
      'https://connect.facebook.net/en_US/fbevents.js');
      fbq('init', '${pixelId}');
      fbq('track', 'PageView');
    `;
    this.document.head.appendChild(script);

    // noscript fallback
    const noscript = this.document.createElement('noscript');
    const img = this.document.createElement('img');
    img.height = 1;
    img.width = 1;
    img.style.display = 'none';
    img.src = `https://www.facebook.com/tr?id=${pixelId}&ev=PageView&noscript=1`;
    noscript.appendChild(img);
    this.document.body.appendChild(noscript);
  }

  private observeFooterVisibility(): void {
    if (!isPlatformBrowser(this.platformId) || this.isAdminRoute) {
      return;
    }

    const footer = this.document.querySelector('app-footer');
    if (!footer || typeof IntersectionObserver === 'undefined') {
      this.hideWhatsappFab = false;
      return;
    }

    this.disconnectFooterObserver();

    this.footerObserver = new IntersectionObserver(
      entries => {
        this.hideWhatsappFab = entries.some(entry => entry.isIntersecting);
      },
      {
        threshold: 0.02
      }
    );

    this.footerObserver.observe(footer);
  }

  private disconnectFooterObserver(): void {
    this.footerObserver?.disconnect();
    this.footerObserver = undefined;
  }
}
