import { Component, signal, inject, OnInit, OnDestroy } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive, Router, NavigationEnd } from '@angular/router';
import { Meta } from '@angular/platform-browser';
import { filter, Subscription } from 'rxjs';
import { AuthService } from '../../shared/services/auth.service';
import { ApiService } from '../../shared/services/api.service';

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

  ngOnInit(): void {
    // BUG-010/NFR-013: Prevent search engines from indexing admin panel
    this.meta.updateTag({ name: 'robots', content: 'noindex, nofollow' });

    // Load new messages count on init
    this.loadNewMessagesCount();

    // Refresh count on every navigation
    this.routerSub = this.router.events.pipe(
      filter((e): e is NavigationEnd => e instanceof NavigationEnd)
    ).subscribe(() => {
      this.loadNewMessagesCount();
    });
  }

  ngOnDestroy(): void {
    this.routerSub?.unsubscribe();
  }

  private async loadNewMessagesCount(): Promise<void> {
    try {
      const result = await this.api.adminGetNewMessagesCount();
      this.newMessagesCount = result.count;
    } catch {
      // Silent fail — badge just won't show
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

  toggleUserDropdown(): void {
    this.userDropdownOpen.update(v => !v);
  }

  async logout(): Promise<void> {
    this.userDropdownOpen.set(false);
    await this.auth.logout();
  }
}
