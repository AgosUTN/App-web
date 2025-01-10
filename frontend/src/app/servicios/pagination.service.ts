import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class PaginationService {
  constructor() {}

  paginate(items: any[], pageSize: number, currentPage: number): any[] {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return items.slice(startIndex, endIndex);
  }
  filterItems(
    items: any[],
    searchText: string | undefined,
    searchNumber: number | undefined,
    searchField: string
  ): any[] {
    if (!searchText && !searchNumber) return items;

    if (searchText) {
      searchText = searchText.toLowerCase();
      items = items.filter((item) =>
        item[searchField].toLowerCase().includes(searchText)
      );
    }

    if (searchNumber) {
      items = items.filter((item) => item[searchField] === searchNumber);
    }
    return items;
  }

  getTotalPages(items: any[], pageSize: number): number {
    return Math.ceil(items.length / pageSize) || 1;
  }
}
