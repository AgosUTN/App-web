import { Routes } from '@angular/router';
import { Dashboard } from './features/dashboard/dashboard';
import { EditorialesCreate } from './features/editoriales/components/create/editoriales-create';
import { EditorialesRead } from './features/editoriales/components/read/editoriales-read';

export const routes: Routes = [
  { path: 'dashboard', component: Dashboard },
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
        component: EditorialesCreate, // Acá debería ir el de listado
        data: {
          breadcrumb: 'Alta',
        },
      },
    ],
  },
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
];
