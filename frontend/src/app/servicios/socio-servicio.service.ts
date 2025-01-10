import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { ApiResponseGetOne } from '../models/apiResponse.models.js';
import { Socio } from '../models/socio.model.js';

@Injectable({
  providedIn: 'root',
})
export class SocioServicioService {
  constructor(private http: HttpClient) {}

  readonly baseurl = 'http://localhost:3000/api/socios';

  getOne(id: number): Observable<Socio> {
    return this.http
      .get<ApiResponseGetOne<Socio>>(`${this.baseurl}/${id}`)
      .pipe(map((response) => response.data));
  }
}
