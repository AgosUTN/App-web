import { Injectable } from '@angular/core';
import { environment } from '../../../../enviroments/enviroment';
import { map, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ApiResponseGet } from '../../../shared/models/apiResponseGet.model';
import { PoliticaBibliotecaReadDTO } from '../models/politicaBibliotecaRead.dto';
import { apiResponseUpdate } from '../../../shared/models/apiResponseUpdate.model';
import { PoliticaBibliotecaUpdateDTO } from '../models/politicaBibliotecaUpdate.dto';

@Injectable({
  providedIn: 'root',
})
export class PoliticaBibliotecaService {
  private readonly baseUrl = `${environment.apiUrl}/api/politicaBiblioteca`;

  constructor(private http: HttpClient) {}

  get(): Observable<PoliticaBibliotecaReadDTO> {
    return this.http
      .get<ApiResponseGet<PoliticaBibliotecaReadDTO>>(this.baseUrl)
      .pipe(map((res) => res.data));
  }
  update(politica: PoliticaBibliotecaUpdateDTO): Observable<string> {
    return this.http
      .patch<apiResponseUpdate>(this.baseUrl, politica)
      .pipe(map((res) => res.message));
  }
}
