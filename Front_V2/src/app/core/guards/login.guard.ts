import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/authService/auth-service';
import { catchError, map, Observable, of } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class LoginGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  canActivate(): Observable<boolean> | boolean {
    const rol = this.authService.getRol();

    if (!rol) {
      return true;
    }

    return this.authService.verificarToken().pipe(
      map(() => {
        this.router.navigateByUrl(rol === 'ADMIN' ? '/dashboard' : '/prestamos');
        return false;
      }),
      catchError(() => of(true)),
    );
  }
}
// Si el guard no es sincronico, hay que envolver el boolean en un observable.
