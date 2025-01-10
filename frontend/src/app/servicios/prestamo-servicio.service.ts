import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LineaPrestamo, Prestamo } from '../models/CuDevolverLibro.models.js';
import { map, Observable } from 'rxjs';
import { ApiResponseGetAll } from '../models/apiResponse.models.js';

@Injectable({
  providedIn: 'root',
})
export class PrestamoServicioService {
  constructor(private http: HttpClient) {}

  readonly baseurl = 'http://localhost:3000/api/prestamos';

  getPrestamos(filtro: string = ''): Observable<Prestamo[]> {
    // Sin filtro - trae todos los préstamos
    if (filtro === '') {
      return this.http
        .get<ApiResponseGetAll<Prestamo>>(this.baseurl)
        .pipe(map((response) => response.data));
    }

    // Con filtro (Pendiente o Finalizado)
    return this.http
      .get<ApiResponseGetAll<Prestamo>>(
        `${this.baseurl}?estadoPrestamo=${filtro}`
      )
      .pipe(map((response) => response.data));
  }
}
