import { HttpClient } from '@angular/common/http';

export abstract class BaseCrudService<T> {
  protected abstract endpoint: string;

  constructor(protected http: HttpClient) {}

  getAll() {
    return this.http.get<T[]>(this.endpoint);
  }

  getOne(id: number) {
    return this.http.get<T>(`${this.endpoint}/${id}`);
  }
}
