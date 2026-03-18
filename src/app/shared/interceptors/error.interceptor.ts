import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { ToastService } from '../services/toast.service';
import { I18nService } from '../services/i18n.service';

/**
 * HTTP interceptor for global error handling.
 * BUG-011: Toast messages are now translated to the active language.
 */
export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const toast = inject(ToastService);
  const i18n = inject(I18nService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      const lang = i18n.currentLang();

      if (error.status === 401 && req.url.includes('/api/admin/')) {
        // Unauthorized — redirect to login
        router.navigate(['/admin/login']);
        toast.error(lang === 'es'
          ? 'Tu sesion ha expirado. Inicia sesion de nuevo.'
          : 'Your session has expired. Please log in again.');
      } else if (error.status === 0) {
        toast.error(lang === 'es'
          ? 'No se pudo conectar con el servidor. Verifica tu conexion.'
          : 'Could not connect to the server. Please check your connection.');
      }

      return throwError(() => error);
    })
  );
};
