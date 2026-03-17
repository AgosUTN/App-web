import { Component } from '@angular/core';
import { LineaPrestamoDTO, PrestamoDetailDTO } from '../../models/prestamoDetail.dto';
import { EstadoPrestamo } from '../../models/prestamoEstado.type';
import { ChangeDetectorRef, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { CommonModule } from '@angular/common';
import { icons } from '../../../../shared/constants/iconPaths';

import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NotificationService } from '../../../../shared/services/notificationService/notification-service';

import { PrestamoService } from '../../services/prestamo-service';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-prestamos-detail-dialog',
  imports: [CommonModule, MatProgressSpinnerModule, MatTooltipModule],
  templateUrl: './prestamos-detail-dialog.html',
  styleUrl: './prestamos-detail-dialog.scss',
})
export class PrestamosDetailDialog {
  icons = icons;
  isLoading: boolean = false;

  prestamoFinalizado: boolean = false;

  socioSancionado: boolean = false;
  socioSancionadoMessage: string = '';

  constructor(
    private dialogRef: MatDialogRef<PrestamosDetailDialog>,
    @Inject(MAT_DIALOG_DATA) public prestamo: PrestamoDetailDTO,
    private cdr: ChangeDetectorRef,
    private notificationService: NotificationService,

    private prestamoService: PrestamoService,
  ) {}

  getEstadoStyle(estado: EstadoPrestamo): string {
    if (estado === 'FINALIZADO') {
      return 'estado-finalizado';
    } else return 'estado-nuevo';
  }

  isAtrasada(lp: LineaPrestamoDTO): boolean {
    return (
      !!lp.fechaDevolucionReal &&
      new Date(lp.fechaDevolucionReal) > new Date(lp.fechaDevolucionTeorica)
    );
  }

  devolverEjemplar(lp: LineaPrestamoDTO): void {
    this.isLoading = true;
    this.prestamoService
      .devolverEjemplar(this.prestamo, lp)
      .pipe(finalize(() => ((this.isLoading = false), this.cdr.detectChanges())))
      .subscribe({
        next: (data) => {
          this.refreshPrestamo(data.prestamo);
          if (data.prestamo.estadoPrestamo === 'FINALIZADO') {
            this.prestamoFinalizado = true;
          }
          if (data.diasSancion > 0) {
            this.socioSancionadoMessage =
              'El socio fue sancionado durante ' +
              data.diasSancion +
              ' días por devolver el libro fuera de término.';
            this.socioSancionado = true;

            this.cdr.detectChanges();
          }
        },
        error: () => {
          this.closeDialog;
          this.notificationService.error('Ocurrió un error al intentar devolver el ejemplar'); // Entidad no encontrada.
        },
      });
  }
  closeSancionadoMessage(): void {
    this.socioSancionado = false;
  }

  closeDialog(): void {
    this.dialogRef.close(this.prestamoFinalizado);
  }

  refreshPrestamo(prestamo: PrestamoDetailDTO): void {
    this.prestamo = prestamo;
  }
}
