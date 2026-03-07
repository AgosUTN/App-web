import { Injectable } from '@angular/core';
import { environment } from '../../../../enviroments/enviroment';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';

import { apiResponsePost } from '../../../shared/models/apiResponsePost.model';
import { EjemplarTableDTO } from '../models/ejemplarTable.dto';
import { apiResponseDelete } from '../../../shared/models/apiResponseDelete.model';

@Injectable({
  providedIn: 'root',
})
export class EjemplarService {
  private readonly baseUrl = `${environment.apiUrl}/api/libros`; // Endpoint con routers anidados. /libros/:id/ejemplares/:id

  constructor(private http: HttpClient) {}

  post(idLibro: number): Observable<EjemplarTableDTO> {
    return this.http
      .post<apiResponsePost<EjemplarTableDTO>>(this.baseUrl + '/' + idLibro + '/ejemplares', {})
      .pipe(map((res) => res.data));
  }

  delete(idEjemplar: number, idLibro: number): Observable<string> {
    const url = this.baseUrl + '/' + idLibro + '/ejemplares/' + idEjemplar;
    console.log(url);
    return this.http.delete<apiResponseDelete>(url).pipe(map((res) => res.message));
  }
}
