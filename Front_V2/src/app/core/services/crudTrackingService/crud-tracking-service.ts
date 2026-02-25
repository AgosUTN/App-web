import { Injectable } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter, Observable, Subject } from 'rxjs';

// Servicio creado para extraer la responsabilidad del trackeo de rutas que tenía el cache service.

@Injectable({
  providedIn: 'root',
})
export class CrudTrackingService {
  private crudChangedSubject = new Subject<string | null>();

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
  ) {
    this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe(() => {
      const currentCrud = this.getActiveCrud();
      this.crudChangedSubject.next(currentCrud);
    });
  }

  getCrudTracker(): Observable<string | null> {
    return this.crudChangedSubject.asObservable(); // No se devuelve el subject para que un suscriptor no pueda darle next(valor).
  }

  getActiveCrud(): string {
    let activeNode = this.activatedRoute.root;
    while (activeNode.firstChild) {
      activeNode = activeNode.firstChild;
    }
    return activeNode.snapshot.data['crud'];
  }
}
