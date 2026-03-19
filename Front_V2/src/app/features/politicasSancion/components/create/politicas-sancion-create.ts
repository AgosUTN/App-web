import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { NotificationService } from '../../../../shared/services/notificationService/notification-service';
import { PoliticaSancionService } from '../../services/politica-sancion-service';
import { PoliticaSancionCreateDTO } from '../../models/politicaSancionCreate.dto';
import { HttpErrorResponse } from '@angular/common/http';
import { OnlyNumbersDirective } from '../../../../shared/directives/onlyNumbers.directive';

@Component({
  selector: 'app-politicas-sancion-create',
  imports: [ReactiveFormsModule, CommonModule, MatButtonModule, OnlyNumbersDirective],
  templateUrl: './politicas-sancion-create.html',
  styleUrl: './politicas-sancion-create.scss',
})
export class PoliticasSancionCreate {
  loading: boolean = false;
  submitLabel: string = 'Crear Política';
  successMessage: string = 'Política creada correctamente';
  politicaForm = new FormGroup({
    diasHasta: new FormControl('', [Validators.required]),
    diasSancion: new FormControl('', [Validators.required]),
  });

  constructor(
    private notification: NotificationService,
    protected psService: PoliticaSancionService,
  ) {}

  onSubmit(): void {
    const politicaCreate = this.getCreateDTO();

    this.loading = true;

    this.psService.post(politicaCreate).subscribe({
      next: () => {
        this.notification.success(this.successMessage);
        this.politicaForm.reset();
        this.loading = false;
      },
      error: (err: HttpErrorResponse) => {
        this.loading = false;

        // Los dos vuelven con 409 por eso condición con code.

        if (err.error.code === 'DUPLICATED_POLITICA') {
          this.politicaForm.get('diasHasta')?.setErrors({ repetido: true });
        } else if (err.error.code === 'ZERO_DAYS') {
          this.politicaForm.get('diasSancion')?.setErrors({ zero: true });
        }
      },
    });
  }

  private getCreateDTO(): PoliticaSancionCreateDTO {
    const { diasHasta, diasSancion } = this.politicaForm.getRawValue();
    return { diasHasta: parseInt(diasHasta!), diasSancion: parseInt(diasSancion!) };
  }
}
