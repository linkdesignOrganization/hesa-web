import { Component, signal, inject } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive, Router } from '@angular/router';
import { AuthService } from '../../shared/services/auth.service';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './admin-layout.component.html',
  styleUrl: './admin-layout.component.scss'
})
export class AdminLayoutComponent {
  auth = inject(AuthService);
  private router = inject(Router);
  isSidebarCollapsed = signal(false);
  isMobileSidebarOpen = signal(false);
  expandedMenus = signal<Set<string>>(new Set());
  userDropdownOpen = signal(false);

  // Will be populated from API in later iterations
  newMessagesCount = 0;

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
