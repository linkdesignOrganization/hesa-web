import { Component, signal, inject, OnInit, OnDestroy, HostListener } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive, Router, NavigationEnd } from '@angular/router';
import { Meta } from '@angular/platform-browser';
import { filter, Subscription } from 'rxjs';
import { AuthService } from '../../shared/services/auth.service';
import { ApiService, AdminSearchResult } from '../../shared/services/api.service';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './admin-layout.component.html',
  styleUrl: './admin-layout.component.scss'
})
export class AdminLayoutComponent implements OnInit, OnDestroy {
  auth = inject(AuthService);
  private router = inject(Router);
  private meta = inject(Meta);
  private api = inject(ApiService);
  private routerSub?: Subscription;
  isSidebarCollapsed = signal(false);
  isMobileSidebarOpen = signal(false);
  expandedMenus = signal<Set<string>>(new Set());
  userDropdownOpen = signal(false);

  newMessagesCount = 0;

  // REQ-220/REQ-221: Admin global search state
  searchQuery = signal('');
  searchResults = signal<AdminSearchResult | null>(null);
  searchOpen = signal(false);
  searchLoading = signal(false);
  private searchTimer: ReturnType<typeof setTimeout> | null = null;

  ngOnInit(): void {
    // BUG-010/NFR-013: Prevent search engines from indexing admin panel
    this.meta.updateTag({ name: 'robots', content: 'noindex, nofollow' });

    // Load new messages count on init
    this.loadNewMessagesCount();

    // Auto-expand sidebar submenu for current route
    this.autoExpandActiveMenu();

    // Refresh count on every navigation, close search dropdown
    this.routerSub = this.router.events.pipe(
      filter((e): e is NavigationEnd => e instanceof NavigationEnd)
    ).subscribe(() => {
      this.loadNewMessagesCount();
      this.closeSearch();
      this.autoExpandActiveMenu();
    });
  }

  ngOnDestroy(): void {
    this.routerSub?.unsubscribe();
    if (this.searchTimer) clearTimeout(this.searchTimer);
  }

  private async loadNewMessagesCount(): Promise<void> {
    try {
      const result = await this.api.adminGetNewMessagesCount();
      this.newMessagesCount = result.count;
    } catch {
      // Silent fail -- badge just won't show
    }
  }

  toggleSidebar(): void {
    this.isSidebarCollapsed.update(v => !v);
  }

  toggleMobileSidebar(): void {
    this.isMobileSidebarOpen.update(v => !v);
  }

  toggleMenu(menu: string): void {
    this.expandedMenus.update(set => {
      const newSet = new Set(set);
      if (newSet.has(menu)) { newSet.delete(menu); } else { newSet.add(menu); }
      return newSet;
    });
  }

  isMenuExpanded(menu: string): boolean {
    return this.expandedMenus().has(menu);
  }

  isRouteActive(prefix: string): boolean {
    return this.router.url.startsWith(prefix);
  }

  private autoExpandActiveMenu(): void {
    const url = this.router.url;
    const menuRoutes: Record<string, string> = {
      'productos': '/admin/productos',
      'home': '/admin/home/',
      'contenido': '/admin/contenido/',
      'config': '/admin/configuracion/',
    };
    this.expandedMenus.update(set => {
      const newSet = new Set(set);
      for (const [menu, prefix] of Object.entries(menuRoutes)) {
        if (url.startsWith(prefix)) {
          newSet.add(menu);
        }
      }
      return newSet;
    });
  }

  toggleUserDropdown(): void {
    this.userDropdownOpen.update(v => !v);
  }

  async logout(): Promise<void> {
    this.userDropdownOpen.set(false);
    await this.auth.logout();
  }

  // REQ-220/REQ-221: Admin global search
  onSearchInput(event: Event): void {
    const value = (event.target as HTMLInputElement).value.substring(0, 100);
    this.searchQuery.set(value);

    if (this.searchTimer) clearTimeout(this.searchTimer);

    if (value.length >= 2) {
      this.searchLoading.set(true);
      this.searchOpen.set(true);
      this.searchTimer = setTimeout(async () => {
        try {
          const results = await this.api.adminSearch(value);
          this.searchResults.set(results);
        } catch {
          this.searchResults.set(null);
        } finally {
          this.searchLoading.set(false);
        }
      }, 300);
    } else {
      this.searchOpen.set(false);
      this.searchResults.set(null);
      this.searchLoading.set(false);
    }
  }

  onSearchKeydown(event: KeyboardEvent): void {
    if (event.key === 'Escape') {
      this.closeSearch();
    }
  }

  closeSearch(): void {
    this.searchOpen.set(false);
    this.searchQuery.set('');
    this.searchResults.set(null);
    this.searchLoading.set(false);
  }

  navigateToSearchResult(type: string, id: string): void {
    this.closeSearch();
    switch (type) {
      case 'product':
        this.router.navigate(['/admin/productos', id]);
        break;
      case 'brand':
        this.router.navigate(['/admin/marcas', id, 'editar']);
        break;
      case 'message':
        this.router.navigate(['/admin/mensajes', id]);
        break;
    }
  }

  get hasSearchResults(): boolean {
    const r = this.searchResults();
    return r !== null && (r.products.length > 0 || r.brands.length > 0 || r.messages.length > 0);
  }

  get showNoSearchResults(): boolean {
    const r = this.searchResults();
    return this.searchQuery().length >= 2 && !this.searchLoading() && r !== null
      && r.products.length === 0 && r.brands.length === 0 && r.messages.length === 0;
  }

  // REQ-222: Notification bell navigates to messages
  goToMessages(): void {
    this.router.navigate(['/admin/mensajes']);
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.admin__header-search')) {
      this.searchOpen.set(false);
    }
    if (!target.closest('.admin__header-user')) {
      this.userDropdownOpen.set(false);
    }
  }
}
