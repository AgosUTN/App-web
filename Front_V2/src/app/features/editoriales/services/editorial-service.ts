import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../enviroments/enviroment';
import { map, Observable } from 'rxjs';
import { Editorial } from '../models/editorial.model';
import { EditorialCount } from '../models/editorialCount.model';
import {
  ApiResponseGet,
  ApiResponseGetByPage,
  PagedResult,
} from '../../../shared/models/apiResponseGet.model';

@Injectable({
  providedIn: 'root',
})
export class EditorialService {
  constructor(private http: HttpClient) {}

  readonly baseurl = `${environment.apiUrl}/api/editoriales`;

  post(data: string): Observable<Editorial> {
    const editorial = { nombre: data };
    return this.http.post<Editorial>(this.baseurl, editorial);
  }

  getByPage(
    pageIndex: number,
    pageSize: number,
    sortColumn: string,
    sortOrder: string,
    filterValue: string,
  ): Observable<PagedResult<EditorialCount[]>> {
    const params = new HttpParams()
      .set('pageIndex', pageIndex)
      .set('pageSize', pageSize)
      .set('sortColumn', sortColumn)
      .set('sortOrder', sortOrder)
      .set('filterValue', filterValue);

    return this.http
      .get<ApiResponseGetByPage<EditorialCount[]>>(this.baseurl + '/byPage', { params: params })
      .pipe(
        map(
          (res) =>
            <PagedResult<EditorialCount[]>>{
              data: res.data,
              total: res.total,
            },
        ),
      );
  }
  // GET /api/editoriales/byPage?pageIndex=3&pageSize=10& ...
}
