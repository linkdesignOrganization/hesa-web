import { Component, inject, signal, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Meta } from '@angular/platform-browser';
import { AuthService } from '../../../shared/services/auth.service';

/**
 * Admin login page.
 * REQ-308 to REQ-317: Azure Entra ID authentication.
 */
@Component({
  selector: 'app-admin-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class AdminLoginComponent implements OnInit {
  private auth = inject(AuthService);
  private router = inject(Router);
  private meta = inject(Meta);
  loginError = signal(false);
  errorMessage = signal('');
  isLoading = signal(false);

  async ngOnInit(): Promise<void> {
    // BUG-010/NFR-013: Prevent search engines from indexing admin pages
    this.meta.updateTag({ name: 'robots', content: 'noindex, nofollow' });

    // Initialize MSAL and check if already authenticated (redirect callback)
    this.isLoading.set(true);
    try {
      await this.auth.initialize();
      if (this.auth.isAuthenticated()) {
        this.router.navigate(['/admin/dashboard']);
        return;
      }
    } catch {
      // Initialization can fail if user is not authenticated, that is ok
    }
    this.isLoading.set(false);
  }

  async onLogin(): Promise<void> {
    this.isLoading.set(true);
    this.loginError.set(false);
    this.errorMessage.set('');

    try {
      await this.auth.login();
      // After loginRedirect, the page will reload and ngOnInit handles the callback
    } catch (error: unknown) {
      this.isLoading.set(false);
      this.loginError.set(true);
      const errorObj = error as { errorMessage?: string; message?: string };
      if (errorObj.errorMessage?.includes('AADSTS50105') || errorObj.message?.includes('AADSTS50105')) {
        this.errorMessage.set('No tienes acceso al panel de administracion. Contacta al administrador.');
      } else {
        this.errorMessage.set('Error al iniciar sesión. Intenta de nuevo.');
      }
    }
  }
}
