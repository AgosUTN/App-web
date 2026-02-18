import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, EMPTY, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(private router: Router) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        switch (error.status) {
          case 0:
            this.router.navigate(['/error', 500]);
            return EMPTY;
          // Red caida
          /*
          case 401:
            this.router.navigate(['/login']);
            return EMPTY;

          case 403:
            this.router.navigate(['/error', 403]);
        

          case 404:
            this.router.navigate(['/error', 404]);
            return EMPTY;
                
       */
          case 400:
            if (error.error.code === 'INVALID_JSON' || error.error.code === 'VALIDATION_ERROR') {
              this.router.navigate(['/error', 400]);
              return EMPTY;
            }
            return throwError(() => error); // Si es un 400 del controlador, lo maneja componente.

          case 500: {
            const code = error.error?.code ?? 500; // Si es un 500 manejado como el de P. biblioteca, se manda su code.
            this.router.navigate(['/error', code]);
            return EMPTY;
          }
        }

        // 400 → vuelve al componente
        return throwError(() => error);
      }),
    );
  }
}
