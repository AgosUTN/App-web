import { RouterModule, Routes } from '@angular/router';
import { PrestamoAltaComponent } from './prestamo-alta/prestamo-alta.component.js';
import { EditorialAltaComponent } from './editorial-alta/editorial-alta.component.js';
import { Error404Component } from './error404/error404.component.js';
import { ListadoEditorialComponent } from './listado-editorial/listado-editorial.component.js';
import { LibroAltaComponent } from './libro-alta/libro-alta.component.js';
import { LibroListadoComponent } from './libro-listado/libro-listado.component.js';
import { ListadoPrestamoComponent } from './listado-prestamo/listado-prestamo.component.js';

export const routes: Routes = [
  { path: 'prestamo', redirectTo: 'prestamo/listado', pathMatch: 'full' },
  { path: 'prestamo/listado', component: ListadoPrestamoComponent },
  { path: 'prestamo/alta', component: PrestamoAltaComponent },
  { path: 'editorial', redirectTo: 'editorial/listado', pathMatch: 'full' },
  { path: 'editorial/actualizar/:id', component: EditorialAltaComponent },
  { path: 'editorial/alta', component: EditorialAltaComponent },
  { path: 'editorial/listado', component: ListadoEditorialComponent },
  { path: 'libro', redirectTo: 'libro/listado', pathMatch: 'full' },
  { path: 'libro/actualizar/:id', component: LibroAltaComponent },
  { path: 'libro/alta', component: LibroAltaComponent },
  { path: 'libro/listado', component: LibroListadoComponent },
  { path: '', redirectTo: 'prestamoAlta', pathMatch: 'full' },
  { path: 'error', component: Error404Component },
  { path: '**', component: Error404Component },
];
// No se siguió ningún estándar para los nombres.
export const routing = RouterModule.forRoot(routes);
