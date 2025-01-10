import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { EditorialCount } from '../models/editorial.model.js';
import { EditorialServicioService } from '../servicios/editorial-servicio.service.js';
import { CommonModule } from '@angular/common';
import { PaginationService } from '../servicios/pagination.service.js';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-listado-editorial-lite',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './listado-editorial-lite.component.html',
  styleUrl: './listado-editorial-lite.component.css',
})
export class ListadoEditorialLiteComponent {
  @Output() datosEditorial: EventEmitter<{ id: number; nombre: string }> =
    new EventEmitter<{ id: number; nombre: string }>();

  editoriales: EditorialCount[] = [];
  error: string | null = null;

  paginatedEditoriales: EditorialCount[] = [];

  // Constantes
  pageSize = 10;
  searchField = 'nombre';

  // Inicializaciones
  currentPage = 1;
  totalPages = 1;

  searchText = new FormControl('');
  constructor(
    private editorialServicio: EditorialServicioService,
    private paginationService: PaginationService
  ) {}

  ngOnInit() {
    this.loadEditoriales();
    this.setupSearchListener();
  }
  setupSearchListener() {
    this.searchText.valueChanges
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe(() => {
        this.currentPage = 1; // Reset a la primera página cuando se realiza una nueva búsqueda
        this.updatePagination();
      });
  }
  loadEditoriales() {
    this.editorialServicio.getEditoriales().subscribe({
      next: (editoriales) => {
        this.editoriales = editoriales;
        this.updatePagination();
      },
      error: (err) => {
        console.log('Error al cargar las editoriales', err);
      },
    });
  }
  updatePagination() {
    const searchValue = this.searchText.value ?? '';
    const filteredEditoriales = this.paginationService.filterItems(
      this.editoriales,
      searchValue,
      undefined,
      this.searchField
    );
    this.totalPages = this.paginationService.getTotalPages(
      filteredEditoriales,
      this.pageSize
    );
    this.paginatedEditoriales = this.paginationService.paginate(
      filteredEditoriales,
      this.pageSize,
      this.currentPage
    );
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage = this.currentPage + 1;
      this.updatePagination();
    }
  }
  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage = this.currentPage - 1;
      this.updatePagination();
    }
  }
  setPage(page: number) {
    this.currentPage = page;
    this.updatePagination();
  }

  emitirDatos(idP: number, nombreP: string) {
    const datos = { id: idP, nombre: nombreP };
    this.datosEditorial.emit(datos);
  }
}
