import { Injectable } from '@angular/core';
import { environment } from '../../../../enviroments/enviroment';
import { HttpClient } from '@angular/common/http';
import { PrestamoCreateDTO } from '../models/prestamoCreate.dto';
import { map, Observable } from 'rxjs';
import { PrestamoReadDTO } from '../models/prestamoRead.dto';
import { EjemplarCartDTO } from '../../libros/models/ejemplarCart.dto';
import { apiResponsePost } from '../../../shared/models/apiResponsePost.model';

@Injectable({
  providedIn: 'root',
})
export class PrestamoService {
  private readonly baseUrl = `${environment.apiUrl}/api/prestamos`;

  constructor(private http: HttpClient) {}

  post(idSocio: string, ejemplares: EjemplarCartDTO[]): Observable<PrestamoReadDTO> {
    const prestamo = this.mapToCreateDTO(idSocio, ejemplares);
    return this.http
      .post<apiResponsePost<PrestamoReadDTO>>(this.baseUrl, prestamo)
      .pipe(map((res) => res.data));
  }

  private mapToCreateDTO(idSocio: string, ejemplares: EjemplarCartDTO[]): PrestamoCreateDTO {
    return {
      idSocio: parseInt(idSocio),
      ejemplares: ejemplares.map((e) => ({ idEjemplar: e.idEjemplar, idLibro: e.idLibro })),
    };
  }
}
