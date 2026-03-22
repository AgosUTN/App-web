import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/authService/auth-service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const rolRequerido = route.data['rol'];
    const rolUsuario = this.authService.getRol();

    if (!rolUsuario) {
      this.router.navigate(['/login']);
      return false;
    }

    if (rolRequerido && rolUsuario !== rolRequerido) {
      this.router.navigate(['/404']);
      return false;
    }

    return true;
  }
}
