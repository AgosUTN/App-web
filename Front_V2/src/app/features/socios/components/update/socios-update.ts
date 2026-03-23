import { ChangeDetectorRef, Component } from '@angular/core';
import { SociosCreate } from '../create/socios-create';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { OnlyNumbersDirective } from '../../../../shared/directives/onlyNumbers.directive';
import { HttpErrorResponse } from '@angular/common/http';
import { SocioUpdateDTO } from '../../models/socioUpdate.dto';
import { ActivatedRoute, Router } from '@angular/router';
import { DialogService } from '../../../../shared/services/dialogService/dialog-service';
import { SocioService } from '../../services/socio-service';
import { NotificationService } from '../../../../shared/services/notificationService/notification-service';

@Component({
  selector: 'app-socios-update',
  imports: [ReactiveFormsModule, MatButtonModule, CommonModule, OnlyNumbersDirective],
  templateUrl: '../create/socios-create.html',
  styleUrl: '../create/socios-create.scss',
})
export class SociosUpdate extends SociosCreate {
  override submitLabel: string = 'Guardar cambios';
  override successMessage: string = 'Socio actualizado correctamente';
  override socioForm = new FormGroup({
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
    email: new FormControl<string | null>({ value: null, disabled: true }),
  });
  id: number = 0;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    protected override dialogService: DialogService,
    protected override cdr: ChangeDetectorRef,
    protected override socioService: SocioService,
    protected override notificationService: NotificationService,
  ) {
    super(dialogService, socioService, notificationService, cdr);
  }

  ngOnInit(): void {
    this.id = Number(this.route.snapshot.paramMap.get('id'));
    this.socioService.getById(this.id).subscribe({
      next: (socio) => {
        this.socioForm.patchValue({
          nombre: socio.nombre,
          apellido: socio.apellido,
          domicilio: socio.domicilio,
          telefono: socio.telefono,
          email: socio.email,
        });

        this.cdr.markForCheck();
      },
      error: (err) => {
        if (err.status === 404) {
          this.router.navigate(['/error/404']);
        }
      },
    });
  }

  override onSubmit(): void {
    this.isLoading = true;
    const socio = this.getUpdateDTO();
    this.socioService.update(this.id, socio).subscribe({
      next: () => {
        this.isLoading = false;
        this.notificationService.success(this.successMessage);
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
  private getUpdateDTO(): SocioUpdateDTO {
    const socio = this.socioForm.getRawValue();
    return {
      nombre: socio.nombre!,
      apellido: socio.apellido!,
      domicilio: socio.domicilio!,
      telefono: socio.telefono!,
    };
  }
}
