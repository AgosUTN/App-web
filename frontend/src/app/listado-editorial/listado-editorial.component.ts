import { Component, ViewChild } from '@angular/core';
import { Editorial, EditorialCount } from '../models/editorial.model.js';
import { EditorialServicioService } from '../servicios/editorial-servicio.service.js';
import { CommonModule } from '@angular/common';
import { PaginationService } from '../servicios/pagination.service.js';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { RouterModule } from '@angular/router';
import { ModalDeleteComponent } from '../modal-delete/modal-delete.component';
import { NgbPopoverModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-listado-editorial',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    ModalDeleteComponent,
    NgbPopoverModule,
  ],
  templateUrl: './listado-editorial.component.html',
  styleUrl: './listado-editorial.component.css',
})
export class ListadoEditorialComponent {
  @ViewChild(ModalDeleteComponent) modalDeleteComponent!: ModalDeleteComponent;
  editoriales: EditorialCount[] = [];
  error: string | null = null;

  paginatedEditoriales: EditorialCount[] = [];
  idEditorialBorrar?: number;
  // Constantes
  pageSize = 10;
  searchField = 'nombre';
  mensajeModal = '¿Estás seguro que deseas borrar la Editorial?';

  // Inicializaciones
  currentPage = 1;
  totalPages = 1;
  isPopoverActive = false;

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

        //13/10/24 --> Usar un servicio que intercepte el status 0 para redirigir a un componente/pagina que informe la caida del servidor.
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

  openDeleteModal(id: number, nombre: string) {
    this.idEditorialBorrar = id;
    if (this.modalDeleteComponent) {
      this.modalDeleteComponent.open(nombre);
    }
  }
  private deleteEditorial() {
    this.editorialServicio
      .deleteEditorial(this.idEditorialBorrar!)
      .subscribe((response) => {
        this.loadEditoriales();
        this.idEditorialBorrar = undefined;
      });
    // No estoy manejando un error de borrado. (Bad request), me parece innecesario ensuciar el componente en este caso.
    // Además de que ya hay feedback inmediato al ver que no se borro de la lista.
  }
  handleDelete(confirmacion: boolean) {
    if (confirmacion) {
      this.deleteEditorial();
    } else {
      console.log('Borrado cancelado');
      this.idEditorialBorrar = undefined;
    }
  }
  onPopoverShow() {
    this.isPopoverActive = true;
  }

  onPopoverHide() {
    this.isPopoverActive = false;
  }
}

// Manejar el caso de no poder conectar con el servidor. Idea en .txt ideas.
