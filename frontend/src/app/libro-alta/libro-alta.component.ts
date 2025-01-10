import { Component, TemplateRef, ViewChild } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';

import {
  isbnValidator,
  notUndefinedValidator,
  positiveIntegerValidator,
} from '../utils/validations.js';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

import { ListadoEditorialLiteComponent } from '../listado-editorial-lite/listado-editorial-lite.component';
import { LibroServicioService } from '../servicios/libro-servicio.service.js';
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { take } from 'rxjs/operators';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ModalErrorComponent } from '../modal-error/modal-error.component.js';
import { Observable } from 'rxjs';
@Component({
  selector: 'app-libro-alta',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    ListadoEditorialLiteComponent,
    ModalErrorComponent,
    RouterLink,
  ],
  templateUrl: './libro-alta.component.html',
  styleUrl: './libro-alta.component.css',
  animations: [
    trigger('fadeInOut', [
      state(
        'void',
        style({
          opacity: 0,
        })
      ),
      transition(':leave', [animate(300)]),
    ]),
  ],
})
export class LibroAltaComponent {
  libroForm!: FormGroup;
  @ViewChild('content') content!: TemplateRef<any>;
  @ViewChild(ModalErrorComponent) modalErrorComponent!: ModalErrorComponent;

  private modalRef?: NgbModalRef; // Referencia al modal abierto. Recordar guardarla para poder cerrarlo.
  messageSuccess = '';
  showSuccessDiv = false;
  tituloRepetido = false;
  isbnRepetido = false;

  // Reutilización
  tipoFormulario: string = 'Crear Libro';
  isEditing = false;

  constructor(
    private modalService: NgbModal,
    private libroService: LibroServicioService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.libroForm = new FormGroup({
      titulo: new FormControl('', [
        Validators.required,
        Validators.maxLength(60),
      ]),
      descripcion: new FormControl('', [
        Validators.required,
        Validators.maxLength(500),
      ]),
      isbn: new FormControl('', [Validators.required, isbnValidator()]), // Touch para validación, mejora la usabilidad (HTML).
      miEditorial: new FormControl({ value: null, disabled: true }, [
        Validators.required,
        positiveIntegerValidator,
        notUndefinedValidator,
      ]),
      nombreEditorial: new FormControl({ value: null, disabled: true }, [
        Validators.required,
      ]),
      miAutor: new FormControl('', [
        Validators.required,
        positiveIntegerValidator,
      ]),
      cantEjemplares: new FormControl('', [positiveIntegerValidator]), // No disabled aca porque no funciona de forma dinamica.
    });
    this.route.params.subscribe((params) => {
      const id = params['id'];
      if (id) {
        this.isEditing = true;
        this.tipoFormulario = 'Actualizar Libro';
        this.libroForm.get('cantEjemplares')?.disable();

        this.libroService.getLibro(id).subscribe(
          (libro) => {
            this.libroForm.patchValue({
              titulo: libro.titulo,
              descripcion: libro.descripcion,
              isbn: libro.isbn,
              miEditorial: libro.miEditorial.id,
              nombreEditorial: libro.miEditorial.nombre,
              miAutor: libro.misAutores[0].id,
              cantEjemplares: libro.codigoEjemplarActual,
            });
          },
          (error) => {
            this.router.navigate(['/404']);
          }
        );
      }
    });
  }
  openXl() {
    this.modalRef = this.modalService.open(this.content, { size: 'xl' });
  }
  closeModal() {
    if (this.modalRef) {
      this.modalRef.close();
    }
  }
  setDatosEditorial(datos: { id: number; nombre: string }) {
    this.closeModal();

    const { id, nombre } = datos;

    this.libroForm.get('nombreEditorial')?.setValue(nombre);
    this.libroForm.get('miEditorial')?.setValue(id);
  }
  onKeyDown(event: KeyboardEvent) {
    if (event.key === '-') {
      event.preventDefault();
    }
  }
  onSubmit() {
    if (this.libroForm.valid) {
      const id = this.route.snapshot.params['id'];
      let libro = {
        titulo: this.libroForm.get('titulo')?.value,
        descripcion: this.libroForm.get('descripcion')?.value,
        isbn: this.libroForm.get('isbn')?.value,
        miEditorial: this.libroForm.get('miEditorial')?.value,
        misAutores: [this.libroForm.get('miAutor')?.value], // Lo convierto en array
        cantEjemplares: this.libroForm.get('cantEjemplares')?.value || 0,
      };
      if (!this.isEditing) {
        this.submitLibro(this.libroService.postLibro(libro));
      } else {
        delete libro.cantEjemplares;
        this.submitLibro(this.libroService.updateLibro(id, libro));
      }
    }
  }
  private submitLibro(observable: Observable<any>) {
    observable.subscribe({
      next: (response) => {
        if (!this.isEditing) {
          this.messageSuccess = '¡Libro creado con éxito!';
          this.libroForm.reset();
        } else {
          this.messageSuccess = '¡Libro actualizado con éxito!';
        }
        this.showSuccessDiv = true;
        setTimeout(() => {
          this.showSuccessDiv = false;
        }, 2000);
      },
      error: (err) => {
        switch (err.status) {
          case 400:
            this.openModalError();
            break;
          case 409:
            const errorMessage = err.error.message || '';
            this.tituloRepetido = errorMessage.includes('Titulo');
            this.isbnRepetido = errorMessage.includes('ISBN');

            const tituloControl = this.libroForm.get('titulo');
            const isbnControl = this.libroForm.get('isbn');
            if (tituloControl && this.tituloRepetido) {
              tituloControl.valueChanges.pipe(take(1)).subscribe(() => {
                // El take(1) hace la desuscripción de forma automatica, mucho mejor que en editorial alta.
                this.tituloRepetido = false;
              });
            }

            if (isbnControl && this.isbnRepetido) {
              isbnControl.valueChanges.pipe(take(1)).subscribe(() => {
                this.isbnRepetido = false;
              });
            }
            break;

          default:
            this.router.navigate(['/404']);
        }
      },
    });
  }

  isFormValid() {
    return (
      this.libroForm.valid && this.libroForm.get('miEditorial')?.value !== null
    ); // Es necesario esto porque el disabled del campo miEditorial hace que no sea tenido en cuenta para la validación
  }
  openModalError() {
    if (this.modalErrorComponent) {
      this.modalErrorComponent.open();
    }
  }
}
