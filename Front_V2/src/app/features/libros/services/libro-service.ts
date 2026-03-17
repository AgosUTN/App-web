import { Injectable } from '@angular/core';
import { BaseCrudService } from '../../../shared/base/baseCrudService';

import { LibroReadDTO } from '../models/libroRead.dto';
import { LibroCreateDTO } from '../models/libroCreate.dto';
import { LibroUpdateDTO } from '../models/libroUpdate.dto';
import { environment } from '../../../../enviroments/enviroment';
import { LibroTableDTO } from '../models/libroTable.dto';
import { HttpClient } from '@angular/common/http';
import { LibroDetailDTO } from '../models/libroDetail.dto';
import { map, Observable } from 'rxjs';
import { ApiResponseGet } from '../../../shared/models/apiResponseGet.model';

@Injectable({
  providedIn: 'root',
})
export class LibroService extends BaseCrudService<
  LibroCreateDTO,
  LibroReadDTO,
  LibroUpdateDTO,
  LibroTableDTO
> {
  protected override readonly baseUrl = `${environment.apiUrl}/api/libros`;

  constructor(http: HttpClient) {
    super(http);
  }
  getLibroDetail(id: number): Observable<LibroDetailDTO> {
    return this.http
      .get<ApiResponseGet<LibroDetailDTO>>(this.baseUrl + '/' + id + '/detail')
      .pipe(map((res) => res.data));
  }
}
