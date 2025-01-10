import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css',
})
export class SidebarComponent {
  constructor(private router: Router) {}
  menuItems = [
    { label: 'Libros', icon: 'fa-solid fa-book', url: '/libro' },
    { label: 'Préstamos', icon: 'fa-solid fa-clipboard', url: '/prestamo' },
    {
      label: 'Editoriales',
      icon: 'fa-solid fa-stamp',
      url: '/editorial',
    },
    { label: 'Autores', icon: 'fa-solid fa-feather', url: '/autor' },
    { label: 'Sanciones', icon: 'fa-solid fa-gavel', url: '/sancion' },
  ];

  @Input() sidebarActive = false;

  isActive(route: string): boolean {
    return this.router.url.startsWith(route);
  }
}
