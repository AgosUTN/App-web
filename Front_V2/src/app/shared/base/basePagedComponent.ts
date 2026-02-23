import { PageEvent } from '@angular/material/paginator';
import { Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

// Clase abstracta que encapsula las variables de instancia y
// métodos necesarios para usar table + paginator + matsort con server side pagination.

export abstract class BasePagedComponent<T> {
  pageIndex: number = 0;
  pageSize: number = 5;
  sortOrder: string = 'asc';
  sortColumn: string = 'id';
  filterValue: string = '';
  totalRecords: number = 0;
  isLoading: boolean = true;
  dataSource = new MatTableDataSource<T>();

  abstract loadData(): void;

  onPageChange(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadData();
  }

  onSortChange(event: Sort): void {
    this.sortColumn = event.active;
    this.sortOrder = event.direction.toString();
    if (this.sortOrder === '') {
      // Si le das 3 veces seguidas a un MISMO sorter, emite un sortOrder vacio. Lo usamos para volver al orden original.
      this.sortColumn = 'id';
      this.sortOrder = 'asc';
    }
    this.resetPaginator();
    this.loadData();
  }

  onSubmit(filterValue: string): void {
    this.filterValue = filterValue;
    this.resetPaginator();
    this.loadData();
  }

  private resetPaginator(): void {
    this.pageIndex = 0;
    this.pageSize = 5;
  }
}
