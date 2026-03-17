import { Injectable, signal } from '@angular/core';

/**
 * Authentication service stub.
 * In the demo phase this uses a mock session flag.
 * Iteration 3 replaces this with Azure Entra ID (MSAL) integration.
 */
@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly SESSION_KEY = 'hesa_admin_session';

  /** Reactive signal exposing current auth state */
  private authenticated = signal(this.checkSession());

  /** Returns the current authentication state */
  isAuthenticated(): boolean {
    return this.authenticated();
  }

  /**
   * Mock login — sets session flag.
   * Will be replaced by MSAL redirect flow in Iteration 3.
   */
  login(): void {
    if (typeof sessionStorage !== 'undefined') {
      sessionStorage.setItem(this.SESSION_KEY, 'true');
    }
    this.authenticated.set(true);
  }

  /** Clears session and resets auth state */
  logout(): void {
    if (typeof sessionStorage !== 'undefined') {
      sessionStorage.removeItem(this.SESSION_KEY);
    }
    this.authenticated.set(false);
  }

  /** Reads persisted session (survives page reload within tab) */
  private checkSession(): boolean {
    if (typeof sessionStorage === 'undefined') return false;
    return sessionStorage.getItem(this.SESSION_KEY) === 'true';
  }
}
