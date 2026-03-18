import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { ToastService } from '../services/toast.service';

/**
 * HTTP interceptor for global error handling.
 */
export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const toast = inject(ToastService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401 && req.url.includes('/api/admin/')) {
        // Unauthorized — redirect to login
        router.navigate(['/admin/login']);
        toast.error('Tu sesion ha expirado. Inicia sesion de nuevo.');
      } else if (error.status === 0) {
        toast.error('No se pudo conectar con el servidor. Verifica tu conexion.');
      }

      return throwError(() => error);
    })
  );
};
