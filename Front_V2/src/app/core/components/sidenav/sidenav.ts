import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuItem } from '../../models/menuItem.model';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/authService/auth-service';

@Component({
  selector: 'app-sidenav',
  imports: [CommonModule, RouterLink],
  templateUrl: './sidenav.html',
  styleUrl: './sidenav.scss',
})
export class Sidenav {
  @Input() menuItems: MenuItem[] = []; // Los recibe para que cambie según rol.
  @Input() sideNavOpen: boolean = true;

  // Se tuvo que agregar estos dos para poder cerrar la sidenav al navegar en mobile. Quizás aumenta demasiado el acoplamiento.
  // La alternativa es que el mainLayout escuche navigation ends.
  @Input() isMobile: boolean = false;
  @Output() itemClicked = new EventEmitter<boolean>();

  constructor(
    private router: Router,
    private authService: AuthService,
  ) {}

  isActive(route: string | undefined): boolean {
    if (!route) return false;
    return this.router.url.startsWith(route);
  }

  closeSideNavMobile(): void {
    if (this.isMobile) {
      this.sideNavOpen = false;
      this.itemClicked.emit(true);
    }
  }

  logOut(): void {
    localStorage.removeItem('rol'); // No es lo ideal, pero es para evitar que moleste el login guard. Evita que redireccione a dashboard o a prestamos.
    this.authService.logOut().subscribe(() => {
      this.router.navigateByUrl('/login');
    });
  }
}
