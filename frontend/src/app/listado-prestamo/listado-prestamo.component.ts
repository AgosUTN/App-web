import { CommonModule } from '@angular/common';
import { Component, TemplateRef, ViewChild } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

import { PaginationService } from '../servicios/pagination.service.js';
import { concat, debounceTime, distinctUntilChanged } from 'rxjs';
import { PrestamoServicioService } from '../servicios/prestamo-servicio.service.js';
import { Prestamo } from '../models/CuDevolverLibro.models.js';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { DevolverLibroService } from '../servicios/devolver-libro.service.js';
import { ModalErrorComponent } from '../modal-error/modal-error.component';

@Component({
  selector: 'app-listado-prestamo',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterModule,
    CommonModule,
    ModalErrorComponent,
    ModalErrorComponent,
  ],
  templateUrl: './listado-prestamo.component.html',
  styleUrl: './listado-prestamo.component.css',
})
export class ListadoPrestamoComponent {
  constructor(
    private paginationService: PaginationService,
    private prestamoServicio: PrestamoServicioService,
    private modalService: NgbModal,
    private router: Router,
    private devolverLibroServicio: DevolverLibroService
  ) {}

  searchText = new FormControl();
  prestamos: Prestamo[] = [];
  pageSize = 10;
  paginatedPrestamos: Prestamo[] = [];
  searchField = 'id';
  totalPages = 1;
  currentPage = 1;
  filtro = '';

  validacionLP = false;
  lineaPrestamoActual: number = 0;
  @ViewChild('content') content!: TemplateRef<any>;
  private modalRef?: NgbModalRef;

  @ViewChild('devolucion') devolucion!: TemplateRef<any>;
  private modalRefDevolucion?: NgbModalRef;
  bodyDevolucion = '';

  @ViewChild(ModalErrorComponent) modalErrorComponent!: ModalErrorComponent;

  prestamoModal: Prestamo = {
    id: 0,
    fechaPrestamo: new Date(0),
    ordenLinea: 0,
    estadoPrestamo: '',
    miSocioPrestamo: 0,
    misLpPrestamo: [],
  };
  ngOnInit() {
    this.loadPrestamos();
    this.setupSearchListener();
  }
  setupSearchListener() {
    this.searchText.valueChanges
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe(() => {
        this.currentPage = 1;
        this.updatePagination();
      });
  }

  loadPrestamos(filtro: string = '') {
    this.prestamoServicio.getPrestamos(filtro).subscribe({
      next: (prestamos) => {
        this.prestamos = prestamos;
        this.updatePagination();
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  // Paginación
  updatePagination() {
    const searchValue = this.searchText.value
      ? Number(this.searchText.value)
      : undefined;
    const filteredLibros = this.paginationService.filterItems(
      this.prestamos,
      undefined,
      searchValue,
      this.searchField
    );
    this.totalPages = this.paginationService.getTotalPages(
      filteredLibros,
      this.pageSize
    );
    this.paginatedPrestamos = this.paginationService.paginate(
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

  // Modal
  openScrollableContent(prestamo: Prestamo) {
    this.prestamoModal = prestamo;
    this.modalRef = this.modalService.open(this.content, {
      size: 'lg',
      scrollable: true,
    });
  }
  closeModals() {
    if (this.modalRef) {
      this.modalRef.close();
    }
    if (this.modalRefDevolucion) {
      this.modalRefDevolucion.close();
    }
  }
  closeModalDevolucion() {
    if (this.modalRefDevolucion) {
      this.modalRefDevolucion.close();
    }
  }

  // Modal Devolución

  openModalDevolucion(idLibro: number, idSocio: number) {
    this.bodyDevolucion = `Confirmar devolución del Libro #${idLibro.toString()} prestado al socio #${idSocio.toString()}`;
    this.modalRefDevolucion = this.modalService.open(this.devolucion, {});
  }
  openModalError() {
    if (this.modalErrorComponent) {
      this.modalErrorComponent.open();
    }
  }

  validacion(idSocio: number, idEjemplar: number, idLibro: number) {
    this.devolverLibroServicio
      .validacion$(idSocio, idEjemplar, idLibro)
      .subscribe({
        next: (booleano) => {
          if (booleano) {
            this.openModalDevolucion(idLibro, idSocio);
          } else {
            this.lineaPrestamoActual = 0;
            this.openModalError();
            this.router.navigate(['/404']);
          }
        },
        error: (err) => {
          console.log('Ocurrió un error inesperado', err);
          this.lineaPrestamoActual = 0;
          this.router.navigate(['/404']);
        },
      });
  }
  submitDevolucion() {
    this.devolverLibroServicio
      .devolverLibro(
        this.prestamoModal.id,
        this.lineaPrestamoActual,
        this.prestamoModal.miSocioPrestamo
      )
      .subscribe({
        next: (response) => {
          if ('diasSancion' in response.data) {
            this.bodyDevolucion = `La devolución del préstamo ha sido registrada y el socio ha sido sancionado por ${response.data.diasSancion} días.`;
          } else {
            this.bodyDevolucion =
              'La devolución del préstamo ha sido registrada con éxito.';
          }

          this.closeModals();
          this.loadPrestamos();
        },

        error: (err) => {
          console.log('Ocurrió un error inesperado', err);
          this.lineaPrestamoActual = 0;
          this.openModalError(); // Esto está "de onda", el error ya tendría que haber aparecido en la validación.
          this.router.navigate(['/404']);
        },
      });
  }
}
