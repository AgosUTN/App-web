import { ChangeDetectorRef, Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { icons } from '../../../../shared/constants/iconPaths';
import { EjemplarService } from '../../../libros/services/ejemplar-service';
import { EjemplarCartDTO } from '../../../libros/models/ejemplarCart.dto';
import { NotificationService } from '../../../../shared/services/notificationService/notification-service';
import { HttpErrorResponse } from '@angular/common/http';

import { SocioReadDTO } from '../../../socios/models/socioRead.dto';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-step2-component',
  imports: [ReactiveFormsModule, MatButtonModule, CommonModule],
  templateUrl: './step2-component.html',
  styleUrl: './step2-component.scss',
})
export class Step2Component {
  icons = icons;

  @Input() socio!: SocioReadDTO;
  @Input() maxCantEjemplares: number = 0;
  @Output() ejemplarAdded = new EventEmitter<EjemplarCartDTO[]>();

  step2Form = new FormGroup({
    idLibro: new FormControl('', [Validators.required]),
    idEjemplar: new FormControl('', [Validators.required]),
  });

  isLoading = false;

  validationErrorPendiente: boolean = false;
  errorLibroTitulo: string = '';
  ejemplares: EjemplarCartDTO[] = [];

  constructor(
    private ejemplarService: EjemplarService,
    private notificationService: NotificationService,

    private cdr: ChangeDetectorRef,
  ) {}

  addEjemplar(): void {
    this.isLoading = true;
    const { idLibro, idEjemplar } = this.step2Form.getRawValue();
    this.ejemplarService
      .verifyEjemplar(idEjemplar!, idLibro!, this.socio.id.toString())
      .pipe(
        finalize(() => {
          this.isLoading = false;
          this.cdr.detectChanges();
        }),
      )
      .subscribe({
        next: (ejemplar) => {
          if (this.isEjemplarValid(ejemplar)) {
            this.ejemplares.push(ejemplar);
            this.emitEjemplares();
            this.step2Form.reset();
          }
        },
        error: (res: HttpErrorResponse) => {
          switch (res.status) {
            case 400:
              this.notificationService.error('El socio no existe');
              break;
            case 404:
              this.notificationService.error('El libro o ejemplar no existe');
              break;
            case 409:
              if (res.error.code === 'BORROWED_EJEMPLAR') {
                this.notificationService.error('El ejemplar ya está prestado');
              }
              if (res.error.code === 'ALREADY_BORROWED_BY_SOCIO') {
                this.validationErrorPendiente = true;
                this.errorLibroTitulo = (res.error.data as EjemplarCartDTO).nombreLibro;
              }
              break;
          }
        },
      });
  }
  deleteEjemplar(ejemplar: EjemplarCartDTO): void {
    this.ejemplares = this.ejemplares.filter((e) => e.idLibro !== ejemplar.idLibro);
    this.emitEjemplares();
  }

  sanitize(event: Event) {
    const input = event.target as HTMLInputElement;
    input.value = input.value.replace(/[^0-9]/g, '');
  }

  closeError(): void {
    this.validationErrorPendiente = false;
    this.isLoading = false;
    this.cdr.detectChanges();
  }

  private emitEjemplares(): void {
    this.ejemplarAdded.emit(this.ejemplares);
  }

  private isEjemplarValid(ejemplar: EjemplarCartDTO): boolean {
    // Son validaciones en memoria pero igual se validan en el backend en el endpoint el paso 3.
    const duplicated = this.ejemplares.some((e) => e.idLibro === ejemplar.idLibro);
    if (duplicated) {
      this.notificationService.error('Ya se ha elegido un ejemplar del mismo libro');
      return false;
    }
    if (this.ejemplares.length >= this.maxCantEjemplares) {
      this.notificationService.error(
        'Ya se ha alcanzado la máxima cantidad de ejemplares para el socio',
      );
      return false;
    }
    return true;
  }
}
