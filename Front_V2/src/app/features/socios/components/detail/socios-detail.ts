import { ChangeDetectorRef, Component, Inject } from '@angular/core';
import { PrestamoSocioDTO, SocioDetailDTO } from '../../models/socioDetail.dto';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NotificationService } from '../../../../shared/services/notificationService/notification-service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-socios-detail',
  imports: [CommonModule],
  templateUrl: './socios-detail.html',
  styleUrl: './socios-detail.scss',
})
export class SociosDetail {
  constructor(
    private dialogRef: MatDialogRef<SociosDetail>,
    @Inject(MAT_DIALOG_DATA) public socio: SocioDetailDTO,
    private router: Router,
  ) {}

  closeDialog(): void {
    this.dialogRef.close();
  }

  getPrestamoStyle(p: PrestamoSocioDTO) {
    if (p.fechaFin < new Date()) {
      return 'fecha-vencida';
    } else return '';
  }
  navigateToPrestamos(): void {
    this.closeDialog();
    this.router.navigateByUrl('prestamos', {
      state: {
        idSocio: this.socio.id,
        origen: 'socioDetail',
      },
    });
  }
  navigateToSanciones(): void {
    this.closeDialog();
    this.router.navigateByUrl('sanciones', {
      state: {
        idSocio: this.socio.id,
        origen: 'socioDetail',
      },
    });
  }
  navigateToPrestamo(prestamo: PrestamoSocioDTO): void {
    this.closeDialog();
    this.router.navigateByUrl('prestamos', {
      state: {
        idPrestamo: prestamo.id,
        origen: 'socioDetail',
      },
    });
  }
}
