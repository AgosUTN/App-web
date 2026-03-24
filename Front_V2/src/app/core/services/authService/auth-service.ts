import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../enviroments/enviroment';
import { map, Observable, tap } from 'rxjs';
import { LoginDTO } from '../../models/login.dto';
import { ApiResponseLogin } from '../../models/apiResponseLogin.model';
import { ApiResponseLogout } from '../../models/apiResponseLogout.model';
import { Rol } from '../../models/rol.type';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly baseUrl = `${environment.apiUrl}/api/auth`;

  constructor(private http: HttpClient) {}

  login(loginDTO: LoginDTO): Observable<string> {
    return this.http.post<ApiResponseLogin>(this.baseUrl + '/login', loginDTO).pipe(
      tap((res) => {
        localStorage.setItem('rol', res.data.rol);
      }),
      map((res) => res.data.rol),
    );
  }
  getRol(): Rol | null {
    return localStorage.getItem('rol') as Rol;
  }

  verificarToken(): Observable<any> {
    return this.http.get(`${this.baseUrl}/verify`);
  }

  logOut(): Observable<string> {
    return this.http.post<ApiResponseLogout>(`${this.baseUrl}/logout`, {}).pipe(
      tap(() => localStorage.removeItem('rol')),
      map((res) => res.message),
    );
  }

  isAdmin(): boolean {
    return 'ADMIN' === this.getRol();
  }
}
