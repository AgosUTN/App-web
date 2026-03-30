import { Injectable } from '@angular/core';
import { BaseCrudService } from '../../../shared/base/baseCrudService';

import { AutorReadDTO } from '../models/autorRead.dto';
import { AutorUpdateDTO } from '../models/autorUpdate.dto';
import { AutorTableDTO } from '../models/autorTable.dto';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { AutorCreateDTO } from '../models/autorCreate.dto';

@Injectable({
  providedIn: 'root',
})
export class AutorService extends BaseCrudService<
  AutorCreateDTO,
  AutorReadDTO,
  AutorUpdateDTO,
  AutorTableDTO
> {
  protected override readonly baseUrl = `${environment.apiUrl}/api/autores`;

  constructor(http: HttpClient) {
    super(http);
  }
}
