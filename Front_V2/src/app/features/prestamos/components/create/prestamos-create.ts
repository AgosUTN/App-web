import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatStepper, MatStepperModule } from '@angular/material/stepper';
import { ViewportService } from '../../../../core/services/viewportService/viewport-service';
import { Subscription, switchMap } from 'rxjs';
import { CommonModule } from '@angular/common';
import { Step2Component } from '../Step2/step2-component';
import { Router, RouterLink } from '@angular/router';
import { NotificationService } from '../../../../shared/services/notificationService/notification-service';
import { SocioService } from '../../../socios/services/socio-service';
import { HttpErrorResponse } from '@angular/common/http';
import { EjemplarCartDTO } from '../../../libros/models/ejemplarCart.dto';
import { SocioReadDTO } from '../../../socios/models/socioRead.dto';
import { PoliticaBibliotecaService } from '../../../politicaBiblioteca/services/politica-biblioteca-service';
import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { PrestamoService } from '../../services/prestamo-service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { OnlyNumbersDirective } from '../../../../shared/directives/onlyNumbers.directive';

@Component({
  selector: 'app-prestamos-create',
  imports: [
    ReactiveFormsModule,
    MatStepperModule,
    MatButtonModule,
    CommonModule,
    Step2Component,
    RouterLink,
    MatProgressSpinnerModule,
    OnlyNumbersDirective,
  ],
  templateUrl: './prestamos-create.html',
  styleUrl: './prestamos-create.scss',
})
export class PrestamosCreate {
  @ViewChild('stepper') stepper!: MatStepper;

  step1Form = new FormGroup({
    idSocio: new FormControl('', [Validators.required]),
  });

  isMobile: boolean = false;
  mobileSubscription: Subscription = new Subscription();
  isLoading = false;

  //Step 1

  validationErrorSocio: boolean = false;
  socioErrorMessage!: string;
  socioValid: boolean = false;

  //Step2
  selectionConfirmed = false;
  socio!: SocioReadDTO;

  //Step3
  socioLibrosRestantes!: number;
  diasPrestamo!: number;
  fechaDevolucion!: Date;

  // Datos

  idSocio!: string;
  maxCantEjemplares!: number;
  ejemplares: EjemplarCartDTO[] = [];

  constructor(
    private viewportService: ViewportService,
    private router: Router,
    private notificationService: NotificationService,
    private cdr: ChangeDetectorRef,
    private socioService: SocioService,
    private pbService: PoliticaBibliotecaService,
    private prestamoService: PrestamoService,
  ) {}

  ngOnInit(): void {
    this.initTrackers();
    this.initData();
  }
  ngOnDestroy(): void {
    this.mobileSubscription.unsubscribe();
  }

  verifySocio(): void {
    this.isLoading = true;
    this.idSocio = this.step1Form.getRawValue().idSocio!;

    this.socioService
      .verifySocio(this.idSocio)
      .pipe(
        switchMap((disponibles) => {
          this.maxCantEjemplares = disponibles;
          return this.socioService.get(this.idSocio);
        }),
      )
      .subscribe({
        next: (socio) => {
          this.isLoading = false;
          this.socio = socio;
          this.socioValid = true;

          this.cdr.detectChanges();
          this.stepper.next();
        },
        error: (res: HttpErrorResponse) => {
          this.isLoading = false;

          switch (res.status) {
            case 404:
              this.notificationService.error('Socio no encontrado');
              break;

            case 409:
              if (res.error.code === 'DISABLED_SOCIO') {
                this.validationErrorSocio = true;
                this.socioErrorMessage = `El socio #${this.idSocio} se encuentra deshabilitado por poseer un préstamo atrasado.`;
              }

              if (res.error.code === 'SANCTIONED_SOCIO') {
                this.validationErrorSocio = true;
                this.socioErrorMessage = `El socio #${this.idSocio} se encuentra sancionado por devolver fuera de tiempo un libro. No podrá sacar más libros hasta dentro de ${res.error.data} días.`;
              }

              this.cdr.detectChanges();
              break;
          }
        },
      });
  }
  confirmSelection(): void {
    this.selectionConfirmed = true;
    this.socioLibrosRestantes = this.maxCantEjemplares - this.ejemplares.length;
    this.cdr.detectChanges();
    this.stepper.next();
  }

  confirmLoan(): void {
    this.isLoading = true;
    this.prestamoService.post(this.idSocio, this.ejemplares).subscribe({
      next: () => {
        this.isLoading = false;
        this.cdr.detectChanges();
        this.router.navigate(['/prestamos']);
        this.notificationService.success('Préstamo creado');
      },
      error: (err: HttpErrorResponse) => {
        this.isLoading = false;
        this.cdr.detectChanges();
        if (err.error.code === 'BORROWED_EJEMPLAR') {
          // Caso de concurrencia donde se serializan las 2 requests de forma correcta
          this.notificationService.error(
            'Uno de los ejemplares ya fue prestado mientras usted realizaba el préstamo',
          );
        }
        if (err.status === 409) {
          // Caso de concurrencia donde se produce un interbloqueo (mínimo 2 ejemplares en conflicto                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          )
          this.notificationService.error(
            'Dos usuarios quisieron prestar el mismo ejemplar. Por favor reintente.',
          );
        }
        this.notificationService.error('Error al crear el préstamo'); //Todos los errores ya fueron manejados en los pasos anteriores, por eso solo un toast.
      },
    });
  }
  onStepChange(event: StepperSelectionEvent) {
    if (event.selectedIndex === 2) {
      //Al volver al paso 2 se cambia la flag para evitar que se pueda ir al paso 3 sin tocar confirmar selección.
      this.selectionConfirmed = false;
    }
  }

  private initTrackers(): void {
    this.mobileSubscription = this.viewportService.getMobileTracker().subscribe((estado) => {
      this.isMobile = estado;

      this.resetStep2();
    });
  }
  private initData(): void {
    this.pbService.get().subscribe((politica) => {
      this.diasPrestamo = politica.diasPrestamo;
      this.fechaDevolucion = this.calcFechaDevolucion(this.diasPrestamo);
    }); // Si da error, es un error 500 que agarra el interceptor.
  }
  private calcFechaDevolucion(dias: number): Date {
    const hoy = new Date();
    const fecha = new Date(hoy);
    fecha.setDate(hoy.getDate() + dias);
    return fecha;
  }
  private resetStep2(): void {
    if (this.stepper?.selectedIndex === 2) {
      this.stepper.previous();
    }
    this.ejemplares.length = 0; // Reinicia array, el componente del step 2 se destruye en el cambio de orientación.
    this.selectionConfirmed = false;
  }
}
