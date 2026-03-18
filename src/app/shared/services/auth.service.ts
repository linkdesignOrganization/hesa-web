import { Injectable, signal } from '@angular/core';
import { PublicClientApplication, AuthenticationResult, InteractionRequiredAuthError } from '@azure/msal-browser';
import { environment } from '../../../environments/environment';

/**
 * Authentication service using Azure Entra ID (MSAL).
 * REQ-308 to REQ-317: Azure Entra ID authentication for the admin panel.
 */
@Injectable({ providedIn: 'root' })
export class AuthService {
  private msalInstance: PublicClientApplication;
  private initialized = false;

  /** Reactive signal exposing current auth state */
  authenticated = signal(false);
  userName = signal('');
  userEmail = signal('');

  constructor() {
    this.msalInstance = new PublicClientApplication({
      auth: {
        clientId: environment.entra.clientId,
        authority: environment.entra.authority,
        redirectUri: environment.entra.redirectUri,
        postLogoutRedirectUri: environment.entra.redirectUri,
      },
      cache: {
        cacheLocation: 'sessionStorage',
      },
    });
  }

  /** Initialize MSAL and check for existing sessions */
  async initialize(): Promise<void> {
    if (this.initialized) return;
    try {
      await this.msalInstance.initialize();

      // Handle redirect response (after Azure login redirect)
      const response = await this.msalInstance.handleRedirectPromise();
      if (response) {
        this.setAuthState(response);
      } else {
        // Check for existing active account
        const accounts = this.msalInstance.getAllAccounts();
        if (accounts.length > 0) {
          this.msalInstance.setActiveAccount(accounts[0]);
          this.authenticated.set(true);
          this.userName.set(accounts[0].name || '');
          this.userEmail.set(accounts[0].username || '');
        }
      }
      this.initialized = true;
    } catch (error) {
      console.error('MSAL initialization error:', error);
      this.initialized = true;
    }
  }

  /** Returns the current authentication state */
  isAuthenticated(): boolean {
    return this.authenticated();
  }

  /**
   * Start the login flow via Azure Entra ID redirect.
   * REQ-309: Button "Iniciar sesion con Microsoft" redirects to Azure.
   */
  async login(): Promise<void> {
    await this.initialize();
    try {
      await this.msalInstance.loginRedirect({
        scopes: environment.entra.scopes,
      });
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  /**
   * Logout and clear session.
   * REQ-312: Closes Azure session and redirects to login.
   */
  async logout(): Promise<void> {
    await this.initialize();
    this.authenticated.set(false);
    this.userName.set('');
    this.userEmail.set('');
    try {
      await this.msalInstance.logoutRedirect();
    } catch (error) {
      console.error('Logout error:', error);
    }
  }

  /**
   * Get access token for API calls.
   * REQ-311: Silent token renewal, prompts re-auth if needed.
   */
  async getAccessToken(): Promise<string | null> {
    await this.initialize();
    const account = this.msalInstance.getActiveAccount();
    if (!account) return null;

    try {
      const response = await this.msalInstance.acquireTokenSilent({
        scopes: environment.entra.scopes,
        account,
      });
      return response.accessToken;
    } catch (error) {
      if (error instanceof InteractionRequiredAuthError) {
        // Token expired, need re-auth
        try {
          await this.msalInstance.acquireTokenRedirect({
            scopes: environment.entra.scopes,
            account,
          });
        } catch (redirectError) {
          console.error('Token redirect error:', redirectError);
        }
      }
      return null;
    }
  }

  private setAuthState(response: AuthenticationResult): void {
    this.msalInstance.setActiveAccount(response.account);
    this.authenticated.set(true);
    this.userName.set(response.account?.name || '');
    this.userEmail.set(response.account?.username || '');
  }
}
