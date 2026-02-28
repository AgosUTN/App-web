import { HttpClient } from '@angular/common/http';
import { apiResponseGetById, PagedResult } from '../models/apiResponseGet.model';
import { map, Observable } from 'rxjs';
import { apiResponseDelete } from '../models/apiResponseDelete.model';
import { apiResponseUpdate } from '../models/apiResponseUpdate.model';
import { apiResponsePost } from '../models/apiResponsePost.model';

export abstract class BaseCrudService<T> {
  protected abstract readonly baseUrl: string;

  constructor(protected http: HttpClient) {}

  getById(id: number): Observable<T> {
    return this.http
      .get<apiResponseGetById<T>>(`${this.baseUrl}/${id}`)
      .pipe(map((res) => res.data));
  }

  delete(id: number): Observable<string> {
    return this.http
      .delete<apiResponseDelete>(`${this.baseUrl}/${id}`)
      .pipe(map((res) => res.message));
  }

  update(id: number, data: Partial<T>): Observable<apiResponseUpdate> {
    return this.http.patch<apiResponseUpdate>(`${this.baseUrl}/${id}`, data);
  }
  //Nota: Lo ideal sería usar un UpdateDTO que no tenga el campo ID y otros hipotéticos como el fecha alta.

  post(data: Omit<T, 'id'>): Observable<T> {
    return this.http.post<apiResponsePost<T>>(this.baseUrl, data).pipe(map((res) => res.data));
  }
}
