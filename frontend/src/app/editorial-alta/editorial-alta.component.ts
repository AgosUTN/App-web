import { Component, Input, ViewChild, viewChild } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { EditorialServicioService } from '../servicios/editorial-servicio.service.js';
import { ActivatedRoute, RouterLink } from '@angular/router';

import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { ModalErrorComponent } from '../modal-error/modal-error.component.js';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-editorial-alta',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, ModalErrorComponent, RouterLink],
  templateUrl: './editorial-alta.component.html',
  styleUrl: './editorial-alta.component.css',
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
export class EditorialAltaComponent {
  constructor(
    private editorialServicio: EditorialServicioService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  @ViewChild(ModalErrorComponent) modalErrorComponent!: ModalErrorComponent;

  nombre = new FormControl('', [Validators.maxLength(50), Validators.required]);
  showSuccessDiv = false;
  tipoFormulario: string = 'Crear Editorial';
  isEditing = false;
  messageSuccess = '';
  repetido = false;
  ngOnInit() {
    this.route.params.subscribe((params) => {
      const id = params['id'];
      if (id) {
        this.isEditing = true;
        this.tipoFormulario = 'Actualizar Editorial';
        // Aquí puedes cargar los datos de la editorial para editar
        this.editorialServicio.getEditorial(id).subscribe(
          (editorial) => {
            this.nombre.setValue(editorial.nombre);
          },
          (error) => {
            this.router.navigate(['/404']);
          }
        );
      }
    });
  }
  onSubmit() {
    if (this.nombre.valid && this.nombre.value !== null) {
      const id = this.route.snapshot.params['id'];

      if (!this.isEditing) {
        this.submitEditorial(
          this.editorialServicio.postEditorial(this.nombre.value)
        );
      } else {
        this.submitEditorial(
          this.editorialServicio.updateEditorial(id, this.nombre.value)
        );
      }
    }
  }
  private submitEditorial(observable: Observable<any>) {
    observable.subscribe({
      next: (response) => {
        if (!this.isEditing) {
          this.messageSuccess = '¡Editorial creada con éxito!';
          this.nombre.reset();
        } else {
          this.messageSuccess = '¡Editorial actualizada con éxito!';
        }
        this.showSuccessDiv = true;
        setTimeout(() => {
          this.showSuccessDiv = false;
        }, 2000);
      },
      error: (err) => {
        if (err.status === 400) {
          this.openModal();
        } else if (err.status === 409) {
          this.repetido = true;
          const subscription = this.nombre.valueChanges.subscribe(() => {
            this.repetido = false;

            subscription.unsubscribe();
          });
        } else {
          this.router.navigate(['/404']); // No me parece mal esto ya que si el id no existe y se mando la solicitud, es porque el usario manipulo mal el front.
        }
      },
    });
  }

  openModal() {
    if (this.modalErrorComponent) {
      this.modalErrorComponent.open();
    }
  }
}
