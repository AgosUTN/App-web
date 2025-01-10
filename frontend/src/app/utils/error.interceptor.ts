import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse,
} from '@angular/common/http';
import { Router } from '@angular/router';
import { EMPTY, Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ErrorResponse } from '../models/errorResponse.model.js';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(private router: Router) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error instanceof HttpErrorResponse) {
          switch (error.status) {
            case 500:
              this.router.navigate(['/error'], {
                state: {
                  errorStatus: 500,
                },
              });
              return EMPTY; //IMPORTANTE, EXISTE 1 SOLO CASO DE LA API DONDE HAY UN 500 "NORMAL", pero considero que está bien manejarlo de está forma también. Podrían agregarse más propiedades al STATE.
            case 400:
              const errorBody = error.error as ErrorResponse;
              if (errorBody.codigo === 'JSON_INVALIDO') {
                this.router.navigate(['/error'], {
                  state: {
                    errorStatus: error.status,
                  },
                });
                return EMPTY; // Si no pones esto te maneja el error el componente también.
              } else {
                return throwError(() => error);
              }

            case 0:
              this.router.navigate(['/error'], {
                state: {
                  errorStatus: error.status,
                },
              });
              return EMPTY;
          }

          console.error('Error interceptado:', error);
        }

        return throwError(() => error);
      })
    );
  }
}
