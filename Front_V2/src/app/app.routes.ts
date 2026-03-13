import { Routes } from '@angular/router';
import { Dashboard } from './features/dashboard/dashboard';
import { EditorialesCreate } from './features/editoriales/components/create/editoriales-create';
import { EditorialesRead } from './features/editoriales/components/read/editoriales-read';
import { ErrorPage } from './core/pages/error-page/error-page';
import { EmptyLayoutComponent } from './core/components/empty-layout-component/empty-layout-component';
import { MainLayoutComponent } from './core/components/main-layout-component/main-layout-component';
import { CRUD_names } from './core/constants/crudNames.config';
import { EditorialesUpdate } from './features/editoriales/components/update/editorial-update';
import { LibrosCreate } from './features/libros/components/create/libros-create';
import { LibrosRead } from './features/libros/components/read/libros-read';

import { LibrosUpdate } from './features/libros/components/update/libros-update';
import { PrestamosRead } from './features/prestamos/components/read/prestamos-read';
import { PrestamosCreate } from './features/prestamos/components/create/prestamos-create';

export const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      {
        path: 'dashboard',
        component: Dashboard,
        data: { breadcrumb: 'Dashboard', crud: 'dashboard' },
      },
      {
        path: 'editoriales',
        data: {
          breadcrumb: 'Editoriales',
        },
        children: [
          {
            path: '',
            component: EditorialesRead,
            data: {
              breadcrumb: '', // Para evitar que  herede el data y breadcrumb del padre. "" es falsy.
              crud: CRUD_names.Editorial,
            },
          },
          {
            path: 'alta',
            component: EditorialesCreate,
            data: {
              breadcrumb: 'Alta',
              crud: CRUD_names.Editorial,
            },
          },
          {
            path: 'editar/:id',
            component: EditorialesUpdate,
            data: {
              breadcrumb: 'Editar',
              crud: CRUD_names.Editorial,
            },
          },
        ],
      },
      {
        path: 'libros',
        data: { breadcrumb: 'Libros' },
        children: [
          {
            path: '',
            component: LibrosRead,
            data: {
              breadcrumb: '',
              crud: CRUD_names.Libro,
            },
          },
          {
            path: 'alta',
            component: LibrosCreate,
            data: { breadcrumb: 'Alta', crud: CRUD_names.Libro },
          },
          {
            path: 'editar/:id',
            component: LibrosUpdate,
            data: { breadcrumb: 'Editar', crud: CRUD_names.Libro },
          },
        ],
      },
      {
        path: 'prestamos',
        data: { breadcrumb: 'Préstamos' },
        children: [
          {
            path: '',
            component: PrestamosRead,
            data: { breadcrumb: '', crud: CRUD_names.Prestamo },
          },
          {
            path: 'alta',
            component: PrestamosCreate,
            data: { breadcrumb: 'Crear', crud: CRUD_names.Prestamo },
          },
        ],
      },

      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    ],
  },
  {
    path: 'error',
    component: EmptyLayoutComponent,
    children: [
      { path: '', redirectTo: '404', pathMatch: 'full' }, // Sin este, si pones /error se queda en empty layout component.
      { path: ':code', component: ErrorPage },
    ],
  },
  {
    path: '**',
    redirectTo: 'error/404',
  },
];
