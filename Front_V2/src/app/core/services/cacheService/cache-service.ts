import { Injectable } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter, Observable, of } from 'rxjs';
import { SocketService } from '../socketService/socket-service';
import { CrudTrackingService } from '../crudTrackingService/crud-tracking-service';

@Injectable({
  providedIn: 'root',
})
export class CacheService {
  private cache = new Map<string, any>();
  private currentCrud: string = '';

  constructor(
    private socketService: SocketService,
    private crudTrackingService: CrudTrackingService,
  ) {
    this.currentCrud = this.crudTrackingService.getActiveCrud();
    this.initializeAutoClear();
    this.initializeCacheInvalidation();
  }

  // Se usa la urlWithParams de la request como key

  getData(key: string): any {
    return this.cache.get(key);
  }

  setData(key: string, value: any): void {
    this.cache.set(key, value);
  }

  private clearData(): void {
    this.cache.clear();
  }

  private initializeAutoClear(): void {
    //Elimina el cache si se navega a otro CRUD.

    this.crudTrackingService.getCrudTracker().subscribe((newCrud) => {
      if (newCrud && this.currentCrud !== newCrud) {
        // Si se navega a una pagina sin crud, vuelve newCrud null y no limpiamos cache.
        this.clearData();
      }
    });
  }

  private initializeCacheInvalidation(): void {
    //Borra cache si la API solicita invalidar los datos del crud que actualmente se tiene en cache. (Por ahora solo ante un borrado de registro)

    this.socketService.getCacheInvalidateTracker().subscribe(({ crud }) => {
      if (crud === this.crudTrackingService.getActiveCrud()) {
        this.clearData();
      }
    });
  }
}
