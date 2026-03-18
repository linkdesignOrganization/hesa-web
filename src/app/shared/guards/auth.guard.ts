import { inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

/**
 * Route guard that protects admin routes from unauthorized access.
 * REQ-308, REQ-313: Redirects unauthenticated users to admin login.
 * BUG-V05/BUG-V07: SSR-safe — skips auth check during prerendering.
 */
export const authGuard: CanActivateFn = async () => {
  const platformId = inject(PLATFORM_ID);

  // During prerendering, skip auth check entirely
  if (!isPlatformBrowser(platformId)) {
    return false;
  }

  const authService = inject(AuthService);
  const router = inject(Router);

  // Ensure MSAL is initialized before checking auth state
  await authService.initialize();

  if (authService.isAuthenticated()) {
    return true;
  }

  router.navigate(['/admin/login']);
  return false;
};
