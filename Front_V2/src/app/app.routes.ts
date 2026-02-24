import { Routes } from '@angular/router';
import { Dashboard } from './features/dashboard/dashboard';
import { EditorialesCreate } from './features/editoriales/components/create/editoriales-create';
import { EditorialesRead } from './features/editoriales/components/read/editoriales-read';
import { ErrorPage } from './core/pages/error-page/error-page';
import { EmptyLayoutComponent } from './core/components/empty-layout-component/empty-layout-component';
import { MainLayoutComponent } from './core/components/main-layout-component/main-layout-component';

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
              crud: 'editoriales',
            },
          },
          {
            path: 'alta',
            component: EditorialesCreate,
            data: {
              breadcrumb: 'Alta',
              crud: 'editoriales',
            },
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
