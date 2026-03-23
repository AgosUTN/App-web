import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from '../../../../enviroments/enviroment';
import { ApiResponseGet } from '../../../shared/models/apiResponseGet.model';
import { SocioReadDTO } from '../models/socioRead.dto';
import { BaseCrudService } from '../../../shared/base/baseCrudService';
import { SocioCreateDTO } from '../models/socioCreate.dto';
import { SocioUpdateDTO } from '../models/socioUpdate.dto';
import { SocioTableDTO } from '../models/socioTable.dto';
import { SocioDetailDTO } from '../models/socioDetail.dto';

@Injectable({
  providedIn: 'root',
})
export class SocioService extends BaseCrudService<
  SocioCreateDTO,
  SocioReadDTO,
  SocioUpdateDTO,
  SocioTableDTO
> {
  protected readonly baseUrl = `${environment.apiUrl}/api/socios`;

  constructor(protected override http: HttpClient) {
    super(http);
  }

  getSocioDetail(id: number): Observable<SocioDetailDTO> {
    return this.http
      .get<ApiResponseGet<SocioDetailDTO>>(this.baseUrl + '/' + id + '/detail')
      .pipe(map((res) => res.data));
  }

  verifySocio(id: string): Observable<number> {
    return this.http
      .get<ApiResponseGet<number>>(this.baseUrl + '/' + id + '/validate')
      .pipe(map((res) => res.data));
  }
}
