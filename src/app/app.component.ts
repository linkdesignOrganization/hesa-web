import { Component, OnInit, inject } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs';
import { HeaderComponent } from './shared/components/header/header.component';
import { FooterComponent } from './shared/components/footer/footer.component';
import { WhatsappFabComponent } from './shared/components/whatsapp-fab/whatsapp-fab.component';
import { ToastContainerComponent } from './shared/components/toast/toast.component';
import { I18nService } from './shared/services/i18n.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, FooterComponent, WhatsappFabComponent, ToastContainerComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  isAdminRoute = false;
  private router = inject(Router);
  private i18n = inject(I18nService);

  ngOnInit(): void {
    // Language detection: redirect root to appropriate language
    if (typeof window !== 'undefined') {
      const path = window.location.pathname;
      if (path === '/' || path === '') {
        const browserLang = navigator.language?.substring(0, 2);
        const lang = browserLang === 'en' ? 'en' : 'es';
        this.router.navigateByUrl('/' + lang, { replaceUrl: true });
      }
    }

    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd)
    ).subscribe(event => {
      this.isAdminRoute = event.url.startsWith('/admin');
    });
  }
}
