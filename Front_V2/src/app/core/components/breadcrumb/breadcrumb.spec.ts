import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Breadcrumb } from './breadcrumb';
import { Router } from '@angular/router';
import { vi } from 'vitest';

describe('Breadcrumb', () => {
  let component: Breadcrumb;
  let fixture: ComponentFixture<Breadcrumb>;
let routerSpy = {
  navigateByUrl: vi.fn()
};

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Breadcrumb],
      providers: [{ provide: Router, useValue: routerSpy }],
    }).compileComponents();

    fixture = TestBed.createComponent(Breadcrumb);
    component = fixture.componentInstance;

    // mock breadcrumbs
    component.breadcrumbs = [
      { label: 'Inicio', url: '/inicio' },
      { label: 'Autores', url: '/autores' },
      { label: 'Alta', url: '/autores/alta' },
    ];
  });

  it('no debería permitir navegar al último breadcrumb', () => {
    expect(component.isNavigable(2)).toBeFalse();
  });

  it('debería permitir navegar a un breadcrumb intermedio', () => {
    expect(component.isNavigable(1)).toBeTrue();
  });

  it('debería navegar cuando el breadcrumb es clickeable', () => {
    component.onBreadcrumbClick(1);
    expect(routerSpy.navigateByUrl).toHaveBeenCalledWith('/autores');
  });
});
