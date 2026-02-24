import { Injectable } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CacheService {
  private cache = new Map<string, any>();
  private currentCrud: string = '';

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
  ) {
    this.initializeAutoClear();
  }

  // Se usa la urlWithParams de la request como key

  getData(key: string): any {
    return this.cache.get(key);
  }

  setData(key: string, value: any): void {
    this.cache.set(key, value);
  }
  C;

  private clearData(): void {
    this.cache.clear();
  }
  private initializeAutoClear(): void {
    //Elimina el cache si se navega a otro CRUD.

    this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe(() => {
      let activeNode = this.activatedRoute.root; // Se inicializa con nodo raiz para evitar problemas con no saber que nodo activo recibís.

      while (activeNode.firstChild) {
        activeNode = activeNode.firstChild;
      }
      const newCrud = activeNode.snapshot.data['crud'];

      if (newCrud && newCrud !== this.currentCrud) {
        this.clearData();
        this.currentCrud = newCrud;
      }
    });
  }
}
