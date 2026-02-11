import { Routes } from '@angular/router';
import { Dashboard } from './dashboard/dashboard';
import { Editoriales } from './editoriales/editoriales';

export const routes: Routes = [
  { path: 'dashboard', component: Dashboard },
  { path: 'editoriales', component: Editoriales },
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
];
