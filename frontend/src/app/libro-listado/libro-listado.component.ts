import { CommonModule } from '@angular/common';
import { Component, TemplateRef, ViewChild } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Libro, LibroGetOne } from '../models/libro.model.js';
import { LibroServicioService } from '../servicios/libro-servicio.service.js';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { PaginationService } from '../servicios/pagination.service.js';
import { ModalDeleteComponent } from '../modal-delete/modal-delete.component.js';
import { NgbPopoverModule } from '@ng-bootstrap/ng-bootstrap';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-libro-listado',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterModule,
    CommonModule,
    ModalDeleteComponent,
    NgbPopoverModule,
  ],
  templateUrl: './libro-listado.component.html',
  styleUrl: './libro-listado.component.css',
})
export class LibroListadoComponent {
  constructor(
    private libroServicio: LibroServicioService,
    private paginationService: PaginationService,
    private modalService: NgbModal
  ) {}

  @ViewChild(ModalDeleteComponent) modalDeleteComponent!: ModalDeleteComponent;
  idLibroBorrar?: number;
  mensajeModal = '¿Estás seguro que deseas borrar el Libro?';

  //Modal datos extras
  @ViewChild('content') content!: TemplateRef<any>;
  private modalRef?: NgbModalRef;
  tituloSeleccionado = '';
  descripcionSeleccionada = '';
  autorSeleccionado = '';
  editorialSeleccionada = '';

  searchText = new FormControl('');

  libros: LibroGetOne[] = [];
  pageSize = 10;
  paginatedLibros: LibroGetOne[] = [];
  searchField = 'titulo';
  totalPages = 1;
  currentPage = 1;

  isPopoverActive = false;
  ngOnInit() {
    this.loadLibros();
    this.setupSearchListener();
  }

  loadLibros() {
    this.libroServicio.getLibros().subscribe({
      next: (libros) => {
        this.libros = libros;
        this.updatePagination();
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
  setupSearchListener() {
    this.searchText.valueChanges
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe(() => {
        this.currentPage = 1;
        this.updatePagination();
      });
  }
  // Paginación
  updatePagination() {
    const searchValue = this.searchText.value ?? '';
    const filteredLibros = this.paginationService.filterItems(
      this.libros,
      searchValue,
      undefined,
      this.searchField
    );
    this.totalPages = this.paginationService.getTotalPages(
      filteredLibros,
      this.pageSize
    );
    this.paginatedLibros = this.paginationService.paginate(
      filteredLibros,
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

  openDeleteModal(id: number, titulo: string) {
    this.idLibroBorrar = id;
    if (this.modalDeleteComponent) {
      this.modalDeleteComponent.open(titulo);
    }
  }
  handleDelete(confirmacion: boolean) {
    if (confirmacion) {
      this.deleteLibro();
    } else {
      console.log('Borrado cancelado');
      this.idLibroBorrar = undefined;
    }
  }
  private deleteLibro() {
    this.libroServicio
      .deleteLibro(this.idLibroBorrar!)
      .subscribe((response) => {
        this.loadLibros();
        this.idLibroBorrar = undefined;
      });
  }

  onPopoverShow() {
    this.isPopoverActive = true;
  }

  onPopoverHide() {
    this.isPopoverActive = false;
  }

  openScrollableContent(libro: LibroGetOne) {
    this.tituloSeleccionado = libro.titulo;
    this.descripcionSeleccionada = libro.descripcion;
    this.autorSeleccionado = libro.misAutores[0].nombre.concat(
      ' ',
      libro.misAutores[0].apellido
    );
    this.editorialSeleccionada = libro.miEditorial.nombre;
    this.modalRef = this.modalService.open(this.content, {
      size: 'lg',
      scrollable: true,
    });
  }
  closeModal() {
    if (this.modalRef) {
      this.modalRef.close();
    }
  }
}
