import { Component, signal, inject } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive, Router } from '@angular/router';
import { MockDataService } from '../../shared/services/mock-data.service';
import { AuthService } from '../../shared/services/auth.service';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './admin-layout.component.html',
  styleUrl: './admin-layout.component.scss'
})
export class AdminLayoutComponent {
  private mockData = inject(MockDataService);
  private auth = inject(AuthService);
  private router = inject(Router);
  isSidebarCollapsed = signal(false);
  isMobileSidebarOpen = signal(false);
  expandedMenus = signal<Set<string>>(new Set());
  userDropdownOpen = signal(false);

  get newMessagesCount(): number {
    return this.mockData.getDashboardData().newMessages;
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

  logout(): void {
    this.userDropdownOpen.set(false);
    this.auth.logout();
    this.router.navigate(['/admin/login']);
  }
}
