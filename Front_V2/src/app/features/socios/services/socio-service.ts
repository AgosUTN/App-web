import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from '../../../../enviroments/enviroment';
import { ApiResponseGet } from '../../../shared/models/apiResponseGet.model';
import { SocioReadDTO } from '../models/socioRead.dto';

@Injectable({
  providedIn: 'root',
})
export class SocioService {
  private readonly baseUrl = `${environment.apiUrl}/api/socios`;

  constructor(private http: HttpClient) {}

  get(idSocio: string): Observable<SocioReadDTO> {
    return this.http
      .get<ApiResponseGet<SocioReadDTO>>(this.baseUrl + '/' + idSocio)
      .pipe(map((res) => res.data));
  }

  verifySocio(id: string): Observable<number> {
    return this.http
      .get<ApiResponseGet<number>>(this.baseUrl + '/' + id + '/validate')
      .pipe(map((res) => res.data));
  }
}
