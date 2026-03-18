import { Component, signal, inject, OnDestroy, HostListener } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { LanguageSelectorComponent } from '../language-selector/language-selector.component';
import { SearchOverlayComponent } from '../search-overlay/search-overlay.component';
import { I18nService } from '../../services/i18n.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, LanguageSelectorComponent, SearchOverlayComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnDestroy {
  i18n = inject(I18nService);
  isScrolled = signal(false);
  isMobileMenuOpen = signal(false);
  isSubmenuOpen = signal(false);
  isSearchOpen = signal(false);

  private onScroll = (): void => {
    this.isScrolled.set(window.scrollY > 50);
  };

  constructor() {
    if (typeof window !== 'undefined') {
      window.addEventListener('scroll', this.onScroll, { passive: true });
    }
  }

  ngOnDestroy(): void {
    if (typeof window !== 'undefined') {
      window.removeEventListener('scroll', this.onScroll);
    }
  }

  toggleMobileMenu(): void {
    this.isMobileMenuOpen.update(v => !v);
    if (this.isMobileMenuOpen()) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }

  closeMobileMenu(): void {
    this.isMobileMenuOpen.set(false);
    document.body.style.overflow = '';
  }

  toggleSubmenu(): void {
    this.isSubmenuOpen.update(v => !v);
  }

  openSearch(): void {
    this.isSearchOpen.set(true);
  }

  closeSearch(): void {
    this.isSearchOpen.set(false);
  }

  /** NFR-023: Keyboard navigation for submenu */
  onSubmenuKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.isSubmenuOpen.update(v => !v);
    } else if (event.key === 'Escape') {
      this.isSubmenuOpen.set(false);
    }
  }

  /** NFR-023: Keyboard support for mobile menu */
  @HostListener('document:keydown.escape')
  onEscapeKey(): void {
    if (this.isMobileMenuOpen()) {
      this.closeMobileMenu();
    }
    if (this.isSearchOpen()) {
      this.closeSearch();
    }
  }
}
