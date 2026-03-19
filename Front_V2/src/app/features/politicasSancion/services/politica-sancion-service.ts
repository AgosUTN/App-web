import { Injectable } from '@angular/core';
import { BaseCrudService } from '../../../shared/base/baseCrudService';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../enviroments/enviroment';
import { PoliticaSancionCreateDTO } from '../models/politicaSancionCreate.dto';
import { PoliticaSancionReadDTO } from '../models/politicaSancionRead.dto';
import { PoliticaSancionUpdateDTO } from '../models/politicaSancionUpdate.dto';
import { PoliticaSancionTableDTO } from '../models/politicaSancionTable.dto';

@Injectable({
  providedIn: 'root',
})
export class PoliticaSancionService extends BaseCrudService<
  PoliticaSancionCreateDTO,
  PoliticaSancionReadDTO,
  PoliticaSancionUpdateDTO,
  PoliticaSancionTableDTO
> {
  constructor(http: HttpClient) {
    super(http);
  }

  protected override readonly baseUrl = `${environment.apiUrl}/api/politicasSancion`;
}
