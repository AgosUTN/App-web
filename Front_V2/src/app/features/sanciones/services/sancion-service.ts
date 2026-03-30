import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { map, Observable } from 'rxjs';
import { apiResponseDelete } from '../../../shared/models/apiResponseDelete.model';
import { SancionTableDTO } from '../models/sancionTable.dto';
import { EstadoSancion } from '../models/estadoSancion.type';
import { ApiResponseGetByPage, PagedResult } from '../../../shared/models/apiResponseGet.model';

@Injectable({
  providedIn: 'root',
})
export class SancionService {
  private readonly baseUrl = `${environment.apiUrl}/api/sanciones`;

  constructor(private http: HttpClient) {}

  getByPage(
    pageIndex: number,
    pageSize: number,
    sortColumn: string,
    sortOrder: string,
    filterValue: string,
    estado: EstadoSancion | null,
  ): Observable<PagedResult<SancionTableDTO[]>> {
    let params = new HttpParams()
      .set('pageIndex', pageIndex)
      .set('pageSize', pageSize)
      .set('sortColumn', sortColumn)
      .set('sortOrder', sortOrder)
      .set('filterValue', filterValue);

    if (estado) {
      params = params.set('estado', estado);
    }

    return this.http
      .get<ApiResponseGetByPage<SancionTableDTO[]>>(this.baseUrl, { params: params })
      .pipe(
        map(
          (res) =>
            <PagedResult<SancionTableDTO[]>>{
              data: res.data,
              total: res.total,
            },
        ),
      );
  }

  delete(id: number): Observable<string> {
    return this.http
      .delete<apiResponseDelete>(this.baseUrl + '/' + id)
      .pipe(map((res) => res.message));
  }
}
