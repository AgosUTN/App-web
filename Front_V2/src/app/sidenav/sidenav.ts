import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuItem } from '../models/menuItem.model';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-sidenav',
  imports: [CommonModule, RouterLink],
  templateUrl: './sidenav.html',
  styleUrl: './sidenav.scss',
})
export class Sidenav {
  @Input() menuItems: MenuItem[] = []; // Los recibe para que cambie según rol.
  @Input() sideNavOpen: boolean = true;

  constructor(private router: Router) {}

  isActive(route: string | undefined): boolean {
    if (!route) return false;
    return this.router.url.startsWith(route);
  }
}
