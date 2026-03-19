import { ChangeDetectorRef, Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { NotificationService } from '../../../../shared/services/notificationService/notification-service';

import { OnlyNumbersDirective } from '../../../../shared/directives/onlyNumbers.directive';
import { PoliticaBibliotecaService } from '../../services/politica-biblioteca-service';
import { PoliticaBibliotecaUpdateDTO } from '../../models/politicaBibliotecaUpdate.dto';
import { Router } from '@angular/router';

@Component({
  selector: 'app-politica-biblioteca-update',
  imports: [ReactiveFormsModule, MatButtonModule, CommonModule, OnlyNumbersDirective],
  templateUrl: './politica-biblioteca-update.html',
  styleUrl: './politica-biblioteca-update.scss',
})
export class PoliticaBibliotecaUpdate {
  loading: boolean = false;

  politicaForm = new FormGroup({
    diasSancionMaxima: new FormControl('', [Validators.required]),
    diasPrestamo: new FormControl('', [Validators.required]),
    cantPendientesMaximo: new FormControl('', [Validators.required]),
  });

  constructor(
    private notification: NotificationService,
    private pbService: PoliticaBibliotecaService,
    private cdr: ChangeDetectorRef,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.pbService.get().subscribe({
      next: (p) => {
        this.politicaForm.patchValue({
          diasSancionMaxima: p.diasSancionMaxima.toString(),
          diasPrestamo: p.diasPrestamo.toString(),
          cantPendientesMaximo: p.cantPendientesMaximo.toString(),
        });
        this.cdr.detectChanges();
      },
      error: (err) => {
        if (err.status === 404) {
          this.router.navigate(['/error/404']);
        } // De todas formas daría un 500, lo dejo igual.
      },
    });
  }

  onSubmit(): void {
    const politicaUpdate = this.getUpdateDTO();

    this.loading = true;

    this.pbService.update(politicaUpdate).subscribe({
      next: () => {
        this.notification.success('Política actualizada correctamente');
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        // No llega error.
      },
    });
  }

  private getUpdateDTO(): PoliticaBibliotecaUpdateDTO {
    const { diasPrestamo, diasSancionMaxima, cantPendientesMaximo } =
      this.politicaForm.getRawValue();
    return {
      diasPrestamo: parseInt(diasPrestamo!),
      diasSancionMaxima: parseInt(diasSancionMaxima!),
      cantPendientesMaximo: parseInt(cantPendientesMaximo!),
    };
  }
}
