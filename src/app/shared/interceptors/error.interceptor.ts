import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { ToastService } from '../services/toast.service';
import { I18nService } from '../services/i18n.service';

let handlingAuthRedirect = false;

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const toast = inject(ToastService);
  const i18n = inject(I18nService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      const lang = i18n.currentLang();

      if (error.status === 401 && req.url.includes('/api/admin/')) {
        if (!handlingAuthRedirect) {
          handlingAuthRedirect = true;
          toast.error(lang === 'es'
            ? 'Tu sesión ha expirado. Inicia sesión de nuevo.'
            : 'Your session has expired. Please log in again.');
          router.navigate(['/admin/login']);
          setTimeout(() => { handlingAuthRedirect = false; }, 3000);
        }
      } else if (error.status === 0) {
        toast.error(lang === 'es'
          ? 'No se pudo conectar con el servidor. Verifica tu conexion.'
          : 'Could not connect to the server. Please check your connection.');
      }

      return throwError(() => error);
    })
  );
};
