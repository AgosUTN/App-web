import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { Editorial, EditorialCount } from '../models/editorial.model.js';
import {
  ApiResponseGetAll,
  ApiResponseGetOne,
} from '../models/apiResponse.models.js';
@Injectable({
  providedIn: 'root',
})
export class EditorialServicioService {
  constructor(private http: HttpClient) {}

  readonly baseurl = 'http://localhost:3000/api/editoriales';
  postEditorial(data: string): Observable<Editorial> {
    const objeto = { nombre: data };
    return this.http.post<Editorial>(this.baseurl, objeto);
  }
  updateEditorial(id: number, nombreEditorial: string): Observable<void> {
    // Esto está mal, deberia "recibirse" un tipo editorial.
    const objeto = { nombre: nombreEditorial };
    return this.http.patch<void>(`${this.baseurl}/${id}`, objeto);
  }
  getEditoriales(): Observable<EditorialCount[]> {
    return this.http
      .get<ApiResponseGetAll<EditorialCount>>(this.baseurl)
      .pipe(map((response) => response.data));
  }
  getEditorial(id: number): Observable<Editorial> {
    return this.http
      .get<ApiResponseGetOne<Editorial>>(`${this.baseurl}/${id}`)
      .pipe(map((response) => response.data));
  }

  deleteEditorial(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseurl}/${id}`);
  }
}
// En teoría, es aceptable usar void para el delete/update en tanto no necesite mostrar el mensaje de la API.
