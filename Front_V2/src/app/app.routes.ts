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
import { AutoresRead } from './features/autores/components/read/autores-read';
import { AutoresCreate } from './features/autores/components/create/autores-create';
import { AutoresUpdate } from './features/autores/components/update/autores-update';
import { PoliticasSancionRead } from './features/politicasSancion/components/read/politicas-sancion-read';
import { PoliticasSancionCreate } from './features/politicasSancion/components/create/politicas-sancion-create';
import { PoliticasSancionUpdate } from './features/politicasSancion/components/update/politicas-sancion-update';
import { PoliticaBibliotecaUpdate } from './features/politicaBiblioteca/components/update/politica-biblioteca-update';
import { SancionesRead } from './features/sanciones/components/read/sanciones-read';
import { LoginPage } from './core/pages/login-page/login-page';
import { AuthGuard } from './core/guards/auth.guard';
import { LoginGuard } from './core/guards/login.guard';

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
        canActivate: [AuthGuard],
        data: {
          breadcrumb: 'Editoriales',
          rol: 'ADMIN',
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
        data: { breadcrumb: 'Libros', rol: 'ADMIN' },
        canActivate: [AuthGuard],
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
        canActivate: [AuthGuard],
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
      {
        path: 'autores',
        data: { breadcrumb: 'Autores', rol: 'ADMIN' },
        canActivate: [AuthGuard],
        children: [
          {
            path: '',
            component: AutoresRead,
            data: { breadcrumb: '', crud: CRUD_names.Autor },
          },
          {
            path: 'alta',
            component: AutoresCreate,
            data: { breadcrumb: 'Alta', crud: CRUD_names.Autor },
          },
          {
            path: 'editar/:id',
            component: AutoresUpdate,
            data: { breadcrumb: 'Editar', crud: CRUD_names.Autor },
          },
        ],
      },
      {
        path: 'politicasSancion',
        canActivate: [AuthGuard],
        data: { breadcrumb: 'Politicas de Sanción', rol: 'ADMIN' },
        children: [
          {
            path: '',
            component: PoliticasSancionRead,
            data: { breadcrumb: '', crud: CRUD_names.PoliticaSancion },
          },
          {
            path: 'alta',
            component: PoliticasSancionCreate,
            data: { breadcrumb: 'Alta', crud: CRUD_names.PoliticaSancion },
          },
          {
            path: 'editar/:id',
            component: PoliticasSancionUpdate,
            data: { breadcrumb: 'Editar', crud: CRUD_names.PoliticaSancion },
          },
        ],
      },
      {
        path: 'politicaBiblioteca',
        component: PoliticaBibliotecaUpdate,
        canActivate: [AuthGuard],
        data: {
          breadcrumb: 'Política de biblioteca',
          crud: CRUD_names.PoliticaSancion,
          rol: 'ADMIN',
        },
      }, // Hecho apróposito. Si se navega a politica biblioteca desde ps, no se debería borrar cache.
      {
        path: 'sanciones',
        component: SancionesRead,
        canActivate: [AuthGuard],
        data: { breadcrumb: 'Sanciones', crud: CRUD_names.Sancion },
      },

      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    ],
  },
  {
    path: 'login',
    component: EmptyLayoutComponent,
    canActivate: [LoginGuard],
    children: [{ path: '', component: LoginPage }],
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

//Si no hay rol, cualquiera con token válido puede entrar. (cualquiera logueado, osea cualquier rol).
