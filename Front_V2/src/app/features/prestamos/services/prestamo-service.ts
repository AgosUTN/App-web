import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { PrestamoCreateDTO } from '../models/prestamoCreate.dto';
import { map, Observable } from 'rxjs';

import { EjemplarCartDTO } from '../../libros/models/ejemplarCart.dto';
import { apiResponsePost } from '../../../shared/models/apiResponsePost.model';
import { PrestamoWriteDTO } from '../models/prestamoWrite.dto';
import {
  ApiResponseGet,
  ApiResponseGetByPage,
  PagedResult,
} from '../../../shared/models/apiResponseGet.model';
import { PrestamoTableDTO } from '../models/prestamoTable.dto';
import { EstadoPrestamo } from '../models/prestamoEstado.type';
import { LineaPrestamoDTO, PrestamoDetailDTO } from '../models/prestamoDetail.dto';
import { apiResponseDevolver } from '../models/apiResponseDevolver.model';

@Injectable({
  providedIn: 'root',
})
export class PrestamoService {
  private readonly baseUrl = `${environment.apiUrl}/api/prestamos`;

  constructor(private http: HttpClient) {}

  post(idSocio: string, ejemplares: EjemplarCartDTO[]): Observable<PrestamoWriteDTO> {
    const prestamo = this.mapToCreateDTO(idSocio, ejemplares);
    return this.http
      .post<apiResponsePost<PrestamoWriteDTO>>(this.baseUrl, prestamo)
      .pipe(map((res) => res.data));
  }
  getByPage(
    pageIndex: number,
    pageSize: number,
    sortColumn: string,
    sortOrder: string,
    filterValue: string,
    estado: EstadoPrestamo | null,
  ): Observable<PagedResult<PrestamoTableDTO[]>> {
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
      .get<ApiResponseGetByPage<PrestamoTableDTO[]>>(this.baseUrl, { params: params })
      .pipe(
        map(
          (res) =>
            <PagedResult<PrestamoTableDTO[]>>{
              data: res.data,
              total: res.total,
            },
        ),
      );
  }
  getPrestamoDetail(id: number): Observable<PrestamoDetailDTO> {
    return this.http
      .get<ApiResponseGet<PrestamoDetailDTO>>(this.baseUrl + '/' + id + '/detail/')
      .pipe(map((res) => res.data));
  }

  getPrestamoDetailByEjemplar(idEjemplar: number, idLibro: number): Observable<PrestamoDetailDTO> {
    const params = new HttpParams().set('idEjemplar', idEjemplar).set('idLibro', idLibro);
    return this.http
      .get<ApiResponseGet<PrestamoDetailDTO>>(this.baseUrl + '/detail', { params: params })
      .pipe(map((res) => res.data));
  }

  devolverEjemplar(
    prestamo: PrestamoDetailDTO,
    lp: LineaPrestamoDTO,
  ): Observable<apiResponseDevolver['data']> {
    const linea = lp.ordenLinea;
    const idPrestamo = prestamo.id;
    const devolverDTO = {
      idSocio: prestamo.miSocioPrestamo.id,
      idEjemplar: lp.miEjemplar.id,
      idLibro: lp.miEjemplar.miLibro.id,
    };
    return this.http
      .patch<apiResponseDevolver>(
        this.baseUrl + '/' + idPrestamo + '/lineas/' + linea + '/devolver',
        devolverDTO,
      )
      .pipe(map((res) => res.data));
  }
  private mapToCreateDTO(idSocio: string, ejemplares: EjemplarCartDTO[]): PrestamoCreateDTO {
    return {
      idSocio: parseInt(idSocio),
      ejemplares: ejemplares.map((e) => ({ idEjemplar: e.idEjemplar, idLibro: e.idLibro })),
    };
  }
}
