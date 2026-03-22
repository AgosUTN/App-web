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
          case 0: // API caida
            this.router.navigate(['/error', 0]);
            return EMPTY;

          case 400:
            if (error.error.code === 'INVALID_JSON' || error.error.code === 'VALIDATION_ERROR') {
              this.router.navigate(['/error', 400]);
              return EMPTY;
            }
            return throwError(() => error); // Si es un 400 del controlador, lo maneja componente.

          case 401:
            if (error.error.code === 'INVALID_TOKEN') {
              localStorage.removeItem('rol');
              // Se limpia para que la próxima vez sea el guard el que evite la navegación. De todas formas
              // la primera vez luego del vencimiento se va a ver un momento la page destino, hasta que llegue el 401.
              this.router.navigate(['/login']);

              return EMPTY;
            }
            return throwError(() => error); // Si es 401 de la pantalla de login es por email/contraseña.

          case 403:
            this.router.navigate(['/error', 404]);
            return EMPTY; // Más allá del guard, si viene 403 del backend redirijo a not found para no dar información. (Nota: Lo mantengo así pero en realidad no sirve porque el 403 lo pueden ver igual)

          case 404:
            if (error.error.code === 'NOT_FOUND') {
              this.router.navigate(['/error', 404]);
              return EMPTY;
            }
            return throwError(() => error); // Si es un 404 del controlador, lo maneja el componente.

          case 500: {
            this.router.navigate(['/error', 500]); // El 500 de politica biblioteca entra acá también, no consume el code.
            return EMPTY;
          }
        }

        return throwError(() => error); // Case desconocido.
      }),
    );
  }
}

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
