import { ChangeDetectorRef, Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { MatButtonModule } from '@angular/material/button';
import { icons } from '../../../../shared/constants/iconPaths';
import { DialogService } from '../../../../shared/services/dialogService/dialog-service';
import { NotificationService } from '../../../../shared/services/notificationService/notification-service';
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { OnlyNumbersDirective } from '../../../../shared/directives/onlyNumbers.directive';
import { SocioService } from '../../services/socio-service';
import { SocioCreateDTO } from '../../models/socioCreate.dto';

@Component({
  selector: 'app-socios-create',
  imports: [ReactiveFormsModule, MatButtonModule, CommonModule, OnlyNumbersDirective],
  templateUrl: './socios-create.html',
  styleUrl: './socios-create.scss',
})
export class SociosCreate {
  icons = icons;
  socioForm = new FormGroup({
    nombre: new FormControl('', [
      Validators.required,
      Validators.maxLength(50),
      Validators.minLength(3),
    ]),
    apellido: new FormControl('', [Validators.required, Validators.maxLength(50)]),
    domicilio: new FormControl('', [Validators.required, Validators.maxLength(50)]),
    telefono: new FormControl('', [
      Validators.required,
      Validators.maxLength(20),
      Validators.minLength(4),
    ]),
    email: new FormControl('', [Validators.required, Validators.maxLength(50), Validators.email]),
  });
  isLoading: boolean = false;
  submitLabel: string = 'Crear Socio';
  successMessage: string = 'Socio creado correctamente';

  constructor(
    protected dialogService: DialogService,
    protected socioService: SocioService,
    protected notificationService: NotificationService,
    protected cdr: ChangeDetectorRef,
  ) {}

  onSubmit(): void {
    this.isLoading = true;
    const socio = this.getCreateDTO();
    this.socioService.post(socio).subscribe({
      next: () => {
        this.isLoading = false;
        this.notificationService.success(this.successMessage);
        this.socioForm.reset();
      },
      error: (error: HttpErrorResponse) => {
        this.isLoading = false;
        this.cdr.detectChanges();

        if (error.status === 409) {
          this.socioForm.get('email')?.setErrors({ duplicated: true });
        }
      },
    });
  }

  protected getCreateDTO(): SocioCreateDTO {
    const socio = this.socioForm.getRawValue();
    return {
      nombre: socio.nombre!,
      apellido: socio.apellido!,
      domicilio: socio.domicilio!,
      telefono: socio.telefono!,
      email: socio.email!,
    };
  }
}
