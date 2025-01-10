import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable, map } from 'rxjs';
import { Libro, LibroGetOne } from '../models/libro.model.js';
import {
  ApiResponseGetAll,
  ApiResponseGetOne,
} from '../models/apiResponse.models.js';
import { miEjemplar } from '../models/CuDevolverLibro.models.js';

@Injectable({
  providedIn: 'root',
})
export class LibroServicioService {
  constructor(private http: HttpClient) {}

  readonly baseurl = 'http://localhost:3000/api/libros';

  postLibro(libro: Libro): Observable<Libro> {
    return this.http.post<Libro>(this.baseurl, libro);
  }
  getLibros(): Observable<LibroGetOne[]> {
    return this.http
      .get<ApiResponseGetAll<LibroGetOne>>(this.baseurl)
      .pipe(map((response) => response.data));
  }
  getLibro(id: number): Observable<LibroGetOne> {
    return this.http
      .get<ApiResponseGetOne<LibroGetOne>>(`${this.baseurl}/${id}`)
      .pipe(map((response) => response.data));
  }
  updateLibro(id: number, libro: Libro): Observable<void> {
    return this.http.patch<void>(`${this.baseurl}/${id}`, libro);
  }
  deleteLibro(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseurl}/${id}`);
  }

  getEjemplar(idLibro: number, idEjemplar: number): Observable<miEjemplar> {
    return this.http
      .get<ApiResponseGetOne<miEjemplar>>(
        `${this.baseurl}/${idLibro}/ejemplares/${idEjemplar}`
      )
      .pipe(map((response) => response.data));
  }
  estaPendiente(idLibro: number, idEjemplar: number) {
    return this.http.get<any>(
      `${this.baseurl}/${idLibro}/ejemplares/${idEjemplar}/pendiente`
    );
  }
}
