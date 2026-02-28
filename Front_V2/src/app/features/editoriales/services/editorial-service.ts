import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../enviroments/enviroment';
import { map, Observable } from 'rxjs';
import { Editorial } from '../models/editorial.model';
import { EditorialRead } from '../models/editorialRead.model';
import { ApiResponseGetByPage, PagedResult } from '../../../shared/models/apiResponseGet.model';

import { BaseCrudService } from '../../../shared/base/baseCrudService';

@Injectable({
  providedIn: 'root',
})
export class EditorialService extends BaseCrudService<Editorial> {
  constructor(http: HttpClient) {
    super(http);
  }

  protected override readonly baseUrl = `${environment.apiUrl}/api/editoriales`;

  getByPage(
    pageIndex: number,
    pageSize: number,
    sortColumn: string,
    sortOrder: string,
    filterValue: string,
  ): Observable<PagedResult<EditorialRead[]>> {
    const params = new HttpParams()
      .set('pageIndex', pageIndex)
      .set('pageSize', pageSize)
      .set('sortColumn', sortColumn)
      .set('sortOrder', sortOrder)
      .set('filterValue', filterValue);

    return this.http
      .get<ApiResponseGetByPage<EditorialRead[]>>(this.baseUrl + '/byPage', { params: params })
      .pipe(
        map(
          (res) =>
            <PagedResult<EditorialRead[]>>{
              data: res.data,
              total: res.total,
            },
        ),
      );
  }

  // GET /api/editoriales/byPage?pageIndex=3&pageSize=10& ...
}
