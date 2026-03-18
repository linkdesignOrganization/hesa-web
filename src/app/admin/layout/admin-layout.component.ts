import { Component, signal, inject, OnInit } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive, Router } from '@angular/router';
import { Meta } from '@angular/platform-browser';
import { AuthService } from '../../shared/services/auth.service';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './admin-layout.component.html',
  styleUrl: './admin-layout.component.scss'
})
export class AdminLayoutComponent implements OnInit {
  auth = inject(AuthService);
  private router = inject(Router);
  private meta = inject(Meta);
  isSidebarCollapsed = signal(false);
  isMobileSidebarOpen = signal(false);
  expandedMenus = signal<Set<string>>(new Set());
  userDropdownOpen = signal(false);

  // Will be populated from API in later iterations
  newMessagesCount = 0;

  ngOnInit(): void {
    // BUG-010/NFR-013: Prevent search engines from indexing admin panel
    this.meta.updateTag({ name: 'robots', content: 'noindex, nofollow' });
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
