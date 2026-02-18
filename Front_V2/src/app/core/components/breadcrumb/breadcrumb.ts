import { Component } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter, Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { BreadcrumbItem } from '../../models/breadCrumbItem.model';

@Component({
  selector: 'app-breadcrumb',
  imports: [CommonModule],
  templateUrl: './breadcrumb.html',
  styleUrl: './breadcrumb.scss',
})
export class Breadcrumb {
  breadcrumbs: BreadcrumbItem[] = [];
  subscription!: Subscription;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.subscription = this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        this.breadcrumbs = this.buildBreadcrumb(this.route.root);
        // Envía el nodo raiz del árbol de rutas activo. Importante remarcar que es redundante, ya que this.route ya es el nodo root en este caso.
      });
  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  isNavigable(index: number): boolean {
    if (index === this.breadcrumbs.length - 1) return false; // último nunca es navegable
    if (index === 0 && this.breadcrumbs.length > 1) return true; // primer nivel navegable solo si hay más de uno
    return index > 0; // intermedios navegables
  }

  onBreadcrumbClick(index: number): void {
    if (this.isNavigable(index)) {
      this.navigateTo(this.breadcrumbs[index]);
    }
  }

  private buildBreadcrumb(rootNode: ActivatedRoute, parentUrl?: string): BreadcrumbItem[] {
    let breadcrumbs: BreadcrumbItem[] = [];

    let url = parentUrl ?? ''; // si parentUrl es undefined, usa '' (cuando usa el nodo root)
    let currentRouteNode: ActivatedRoute | null = rootNode;

    // Se inicializa con el nodo raíz del árbol activo.

    while (currentRouteNode) {
      const currentRouteNodeStatic = currentRouteNode.snapshot;
      const breadcrumb = currentRouteNodeStatic.data['breadcrumb'];

      if (breadcrumb) {
        url += '/' + (currentRouteNodeStatic.url.map((segment) => segment.path).join('/') || '');
        breadcrumbs.push({ label: breadcrumb, url: url as string });
      }

      currentRouteNode = currentRouteNode.firstChild ?? null; // Si no hay más nodos hijos dentro del árbol activo, termina.
    }

    breadcrumbs = this.cleanBreadcrumb(breadcrumbs);
    return breadcrumbs;
  }

  private navigateTo(breadcrumb: BreadcrumbItem): void {
    this.router.navigateByUrl(breadcrumb.url);
    console.log(breadcrumb.url);
  }

  private cleanBreadcrumb(breadcrumbs: BreadcrumbItem[]): BreadcrumbItem[] {
    for (let x = 0; x < breadcrumbs.length; x++) {
      if (!breadcrumbs[x].label || breadcrumbs[x].label === '') {
        breadcrumbs.splice(x, 1);
      }
      // Si es undefined por el nodo root, o vacio por el nodo del componente read del CRUD, los quita.
    }
    return breadcrumbs;
  }
}
