import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../enviroments/enviroment';
import { Observable } from 'rxjs';
import { Editorial } from '../models/editorial.model';

@Injectable({
  providedIn: 'root',
})
export class EditorialService {
  constructor(private http: HttpClient) {}

  readonly baseurl = `${environment.apiUrl}/api/editoriales`;

  postEditorial(data: string): Observable<Editorial> {
    const editorial = { nombre: data };
    return this.http.post<Editorial>(this.baseurl, editorial);
  }
}
