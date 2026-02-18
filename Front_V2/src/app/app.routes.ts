import { Routes } from '@angular/router';
import { Dashboard } from './features/dashboard/dashboard';
import { EditorialesCreate } from './features/editoriales/components/create/editoriales-create';
import { EditorialesRead } from './features/editoriales/components/read/editoriales-read';
import { ErrorPage } from './core/pages/error-page/error-page';

export const routes: Routes = [
  { path: 'dashboard', component: Dashboard, data: { breadcrumb: 'Dashboard' } },
  {
    path: 'editoriales',
    data: {
      breadcrumb: 'Editoriales',
    },
    children: [
      {
        path: '',
        data: { breadcrumb: '' },
        component: EditorialesRead,
      },
      {
        path: 'alta',
        component: EditorialesCreate,
        data: {
          breadcrumb: 'Alta',
        },
      },
    ],
  },
  { path: 'error', component: ErrorPage }, // Solo para desarrollar la page
  { path: 'error/:code', component: ErrorPage },
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
];

// Data es un observable para Angular, por eso se accede con snapshot.
