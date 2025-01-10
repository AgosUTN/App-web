import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LibroServicioService } from './libro-servicio.service.js';
import { SocioServicioService } from './socio-servicio.service.js';
import { catchError, forkJoin, map, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DevolverLibroService {
  constructor(
    private http: HttpClient,
    private servicioLibro: LibroServicioService,
    private servicioSocio: SocioServicioService
  ) {}
  readonly baseurl = 'http://localhost:3000/api/prestamos';
  validacion$(
    idSocio: number,
    idEjemplar: number,
    idLibro: number
  ): Observable<boolean> {
    const socio$ = this.servicioSocio.getOne(idSocio).pipe(
      map(() => true), // Si el socio existe, emitimos true

      catchError((err) => {
        if (err.status === 404) {
          return of(false); // Si el socio no existe, emitimos false
        }
        throw err; // Un 500 lo agarra el servicio global.
      })
    );

    const ejemplar$ = this.servicioLibro.getEjemplar(idLibro, idEjemplar).pipe(
      map(() => true),
      catchError((err) => {
        if (err.status === 404) {
          return of(false);
        }
        throw err;
      })
    );

    const pendiente$ = this.servicioLibro
      .estaPendiente(idLibro, idEjemplar)
      .pipe(
        map(() => true),
        catchError((err) => {
          if (err.status === 400 || err.status === 404) {
            return of(false); // No debería devolver 404, pero lo agrego porque la API maneja ese caso.
          }
          throw err;
        })
      );

    return forkJoin([socio$, ejemplar$, pendiente$]).pipe(
      map(([validadoSocio, validadoEjemplar, ejemplarPendiente]) => {
        return validadoSocio && validadoEjemplar && ejemplarPendiente; // En lugar de devolver un array, devuelve esa expresión lógica.
      })
    );
  }

  devolverLibro(
    idPrestamo: number,
    idLinea: number,
    idSocio: number
  ): Observable<any> {
    return this.http.patch(
      `${this.baseurl}/${idPrestamo}/lineas/${idLinea}/devolver`,
      {
        idSocio: idSocio,
      }
    );
  }
}
