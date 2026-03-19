import { ChangeDetectorRef, Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';

import { PoliticasSancionCreate } from '../create/politicas-sancion-create';
import { NotificationService } from '../../../../shared/services/notificationService/notification-service';
import { PoliticaSancionService } from '../../services/politica-sancion-service';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { PoliticaSancionUpdateDTO } from '../../models/politicaSancionUpdate.dto';

@Component({
  selector: 'app-politicas-sancion-update',
  imports: [ReactiveFormsModule, CommonModule, MatButtonModule],
  templateUrl: '../create/politicas-sancion-create.html',
  styleUrl: '../create/politicas-sancion-create.scss',
})
export class PoliticasSancionUpdate extends PoliticasSancionCreate {
  override submitLabel = 'Guardar cambios';
  override successMessage: string = 'Política actualizada correctamente';
  override politicaForm = new FormGroup({
    diasHasta: new FormControl<string | null>({ value: null, disabled: true }),
    diasSancion: new FormControl('', [Validators.required]),
  });

  private diasHasta!: number;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private notificationService: NotificationService,

    protected override psService: PoliticaSancionService,
  ) {
    super(notificationService, psService);
  }
  ngOnInit(): void {
    this.diasHasta = Number(this.route.snapshot.paramMap.get('id'));
    this.psService.getById(this.diasHasta).subscribe({
      next: (politica) => {
        this.politicaForm.patchValue({
          diasHasta: politica.diasHasta.toString(),
          diasSancion: politica.diasSancion.toString(),
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
    this.loading = true;
    const politica = this.getUpdateDTO();
    this.psService.update(this.diasHasta, politica).subscribe({
      next: () => {
        this.loading = false;
        this.notificationService.success(this.successMessage);
        this.cdr.detectChanges();
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
  private getUpdateDTO(): PoliticaSancionUpdateDTO {
    const politica = this.politicaForm.getRawValue();
    return {
      diasSancion: parseInt(politica.diasSancion!),
    };
  }
}
