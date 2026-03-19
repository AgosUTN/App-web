import { HttpClient, HttpParams } from '@angular/common/http';
import {
  apiResponseGetById,
  ApiResponseGetByPage,
  PagedResult,
} from '../models/apiResponseGet.model';
import { map, Observable } from 'rxjs';
import { apiResponseDelete } from '../models/apiResponseDelete.model';
import { apiResponseUpdate } from '../models/apiResponseUpdate.model';
import { apiResponsePost } from '../models/apiResponsePost.model';

export abstract class BaseCrudService<Tcreate, Tread, Tupdate, Ttable> {
  protected abstract readonly baseUrl: string;

  constructor(protected http: HttpClient) {}

  getById(id: number): Observable<Tread> {
    return this.http
      .get<apiResponseGetById<Tread>>(`${this.baseUrl}/${id}`)
      .pipe(map((res) => res.data));
  }

  delete(id: number): Observable<string> {
    return this.http
      .delete<apiResponseDelete>(`${this.baseUrl}/${id}`)
      .pipe(map((res) => res.message));
  }

  update(id: number, data: Tupdate): Observable<string> {
    return this.http
      .patch<apiResponseUpdate>(`${this.baseUrl}/${id}`, data)
      .pipe(map((res) => res.message));
  }

  post(data: Tcreate): Observable<Tread> {
    return this.http.post<apiResponsePost<Tread>>(this.baseUrl, data).pipe(map((res) => res.data));
  }
  getByPage(
    pageIndex: number,
    pageSize: number,
    sortColumn: string,
    sortOrder: string,
    filterValue: string,
  ): Observable<PagedResult<Ttable[]>> {
    const params = new HttpParams()
      .set('pageIndex', pageIndex)
      .set('pageSize', pageSize)
      .set('sortColumn', sortColumn)
      .set('sortOrder', sortOrder)
      .set('filterValue', filterValue);

    return this.http.get<ApiResponseGetByPage<Ttable[]>>(this.baseUrl, { params: params }).pipe(
      map(
        (res) =>
          <PagedResult<Ttable[]>>{
            data: res.data,
            total: res.total,
          },
      ),
    );
  }
}

// Los post devuelven la entidad de lectura.
// Los update y delete no, por diseño de la API, solo mensaje.
