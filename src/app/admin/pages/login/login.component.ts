import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../shared/services/auth.service';

@Component({
  selector: 'app-admin-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class AdminLoginComponent {
  private auth = inject(AuthService);
  private router = inject(Router);
  loginError = signal(false);
  isLoading = signal(false);

  async onLogin(): Promise<void> {
    this.isLoading.set(true);
    this.loginError.set(false);

    // Simulate MSAL login delay — will be replaced by real Entra ID flow in Iteration 3
    await new Promise(resolve => setTimeout(resolve, 1000));

    this.auth.login();
    this.isLoading.set(false);
    this.router.navigate(['/admin/dashboard']);
  }
}
