import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../enviroments/enviroment';
import { map, Observable } from 'rxjs';

import { ApiResponseGetByPage, PagedResult } from '../../../shared/models/apiResponseGet.model';

import { BaseCrudService } from '../../../shared/base/baseCrudService';
import { EditorialCreateDTO } from '../models/editorialCreate.dto';
import { EditorialReadDTO } from '../models/editorialRead.dto';
import { EditorialUpdateDTO } from '../models/editorialUpdate.dto';
import { EditorialTableDTO } from '../models/editorialTable.dto';

@Injectable({
  providedIn: 'root',
})
export class EditorialService extends BaseCrudService<
  EditorialCreateDTO,
  EditorialReadDTO,
  EditorialUpdateDTO,
  EditorialTableDTO
> {
  constructor(http: HttpClient) {
    super(http);
  }

  protected override readonly baseUrl = `${environment.apiUrl}/api/editoriales`;

  // GET /api/editoriales/byPage?pageIndex=3&pageSize=10& ...
}
