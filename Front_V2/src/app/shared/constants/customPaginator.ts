import { MatPaginatorIntl } from '@angular/material/paginator';

export function customPaginatorBuilder() {
  const paginatorIntl = new MatPaginatorIntl();
  paginatorIntl.itemsPerPageLabel = 'Elementos por página';
  paginatorIntl.nextPageLabel = '';
  paginatorIntl.previousPageLabel = '';
  paginatorIntl.firstPageLabel = '';
  paginatorIntl.lastPageLabel = '';
  paginatorIntl.getRangeLabel = (page: number, pageSize: number, length: number) => {
    if (length === 0 || pageSize === 0) return `0 de ${length}`;
    const start = page * pageSize + 1;
    const end = Math.min((page + 1) * pageSize, length);
    return `${start} – ${end} de ${length}`;
  };
  return paginatorIntl;
}
