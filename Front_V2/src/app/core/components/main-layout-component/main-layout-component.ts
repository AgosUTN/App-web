import { Component, HostListener } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Toolbar } from '../toolbar/toolbar';
import { MenuItem } from '../../models/menuItem.model';
import { Sidenav } from '../sidenav/sidenav';
import { MenuService } from '../../services/menuService/menu-service';

@Component({
  selector: 'app-main-layout-component',
  imports: [RouterOutlet, Sidenav, Toolbar, CommonModule],
  templateUrl: './main-layout-component.html',
  styleUrl: './main-layout-component.scss',
})
export class MainLayoutComponent {
  menuItems: MenuItem[] = [];

  MOBILE_BREAKPOINT = 768;
  sideNavOpen: boolean = true;
  isMobile: boolean = false;

  constructor(private menuService: MenuService) {}

  ngOnInit(): void {
    this.checkMobile();
    this.menuItems = this.menuService.getMenu();
  }

  @HostListener('window:resize')
  onResize(): void {
    this.checkMobile();
  }

  checkMobile(): void {
    const wasMobile = this.isMobile;
    this.isMobile = window.innerWidth < this.MOBILE_BREAKPOINT;

    if (this.isMobile) {
      // Cerrar sidenav al pasar a mobile
      this.sideNavOpen = false;
    } else if (wasMobile && !this.isMobile) {
      // Abrir sidenav al pasar a desktop
      this.sideNavOpen = true;
    }
  }
  toggleSideNav(): void {
    this.sideNavOpen = !this.sideNavOpen;
  }
  getSideNavClass(): string {
    if (!this.sideNavOpen && !this.isMobile) {
      return 'sideNavLayout--colapsed';
    } else if (this.sideNavOpen && this.isMobile) {
      return 'sideNavLayout--open';
    } else {
      return '';
    }
  }

  toggleSideNavMobile(): void {
    if (this.sideNavOpen && this.isMobile) {
      this.sideNavOpen = !this.sideNavOpen;
    }
  }
}
