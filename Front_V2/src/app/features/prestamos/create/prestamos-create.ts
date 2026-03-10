import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatStepper, MatStepperModule } from '@angular/material/stepper';
import { ViewportService } from '../../../core/services/viewportService/viewport-service';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { Step2Component } from '../Step2/step2-component';
import { Router } from '@angular/router';
import { NotificationService } from '../../../shared/services/notificationService/notification-service';

@Component({
  selector: 'app-prestamos-create',
  imports: [ReactiveFormsModule, MatStepperModule, MatButtonModule, CommonModule, Step2Component],
  templateUrl: './prestamos-create.html',
  styleUrl: './prestamos-create.scss',
})
export class PrestamosCreate {
  step1Form = new FormGroup({
    idSocio: new FormControl('', [Validators.required]),
  });
  step2Form = new FormGroup({
    idLibro: new FormControl('', []),
    idEjemplar: new FormControl('', []),
  });
  isMobile: boolean = false;
  mobileSubscription: Subscription = new Subscription();
  validationError: boolean = false;
  ejemplares: any[] = [
    { titulo: 'Don Quijote de la Mancha', idEjemplar: 1 },
    { titulo: 'Moby Dick', idEjemplar: 2 },
    { titulo: 'Moby Dick', idEjemplar: 2 },
    { titulo: 'Moby Dick y las aventuras del cápitan Halo Montini', idEjemplar: 2 },
    { titulo: 'Moby Dick', idEjemplar: 2 },
  ];
  //
  estadoSocio: 'success' | 'error' | null = null;
  mensajeSocio = '';
  socioValid = false;

  @ViewChild('stepper') stepper!: MatStepper;

  constructor(
    private viewportService: ViewportService,
    private router: Router,
    private notificationService: NotificationService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.initTrackers();
  }
  ngOnDestroy(): void {
    this.mobileSubscription.unsubscribe();
  }

  confirmLoan(): void {
    this.router.navigate(['/prestamos']);
    this.notificationService.success('Préstamo creado');
  }
  verifySocio(): void {
    if (true /*socio valido*/) {
      this.socioValid = true;
      this.cdr.detectChanges();
      this.stepper.next();
    }
  }

  sanitize(event: Event) {
    const input = event.target as HTMLInputElement;
    input.value = input.value.replace(/[^0-9]/g, '');
  }

  private initTrackers(): void {
    this.mobileSubscription = this.viewportService
      .getMobileTracker()
      .subscribe((estado) => (this.isMobile = estado));
  }
}
