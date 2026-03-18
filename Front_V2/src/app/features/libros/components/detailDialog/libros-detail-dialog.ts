import { ChangeDetectorRef, Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { LibroDetailDTO } from '../../models/libroDetail.dto';
import { CommonModule } from '@angular/common';
import { icons } from '../../../../shared/constants/iconPaths';
import { EjemplarTableDTO, EstadoEjemplar } from '../../models/ejemplarTable.dto';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { EjemplarService } from '../../services/ejemplar-service';
import { NotificationService } from '../../../../shared/services/notificationService/notification-service';
import { DialogService } from '../../../../shared/services/dialogService/dialog-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-libros-detail-dialog',
  imports: [CommonModule, MatProgressSpinnerModule],
  templateUrl: './libros-detail-dialog.html',
  styleUrl: './libros-detail-dialog.scss',
})
export class LibrosDetailDialog {
  icons = icons;
  ejemplares: EjemplarTableDTO[] = [];
  isLoading: boolean = false;
  constructor(
    private dialogRef: MatDialogRef<LibrosDetailDialog>,
    @Inject(MAT_DIALOG_DATA) public libro: LibroDetailDTO,
    private ejemplarService: EjemplarService,
    private cdr: ChangeDetectorRef,
    private notificationService: NotificationService,
    private dialogService: DialogService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.ejemplares = this.libro.ejemplares;
  }
  closeDialog(): void {
    this.dialogRef.close();
  }
  getStateStyle(estado: EstadoEjemplar): string {
    switch (estado) {
      case 'DISPONIBLE':
        return 'estado-disponible';
      case 'ELIMINADO':
        return 'estado-eliminado';
      case 'PRESTADO':
        return 'estado-prestado';
      case 'NUEVO':
        return 'estado-nuevo';
      default:
        return '';
    }
  }
  createEjemplar(idLibro: number): void {
    this.isLoading = true;
    this.ejemplarService.post(idLibro).subscribe({
      next: (ejemplar) => {
        this.ejemplares = [...this.ejemplares, ejemplar];
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.isLoading = false;
        this.cdr.detectChanges();
        this.closeDialog();
        this.notificationService.error('Error inesperado al crear el ejemplar'); // (Libro not found o condición de carrera)
      },
    });
  }
  deleteEjemplar(ejemplar: EjemplarTableDTO): void {
    const { titulo, mensaje } = this.getConfirmContent(ejemplar);

    this.dialogService.confirm(titulo, mensaje).subscribe((confirmed) => {
      if (!confirmed) return;

      this.ejemplarService.delete(ejemplar.idEjemplar, ejemplar.idLibro).subscribe({
        next: () => {
          this.ejemplares = this.ejemplares.filter((e) => e.idEjemplar !== ejemplar.idEjemplar);
          this.cdr.detectChanges();
        },

        error: (res) => {
          this.closeDialog();
          if (res.error.code === 'DELETED_EJEMPLAR') {
            this.notificationService.error('El ejemplar ya está dado de baja');
          } else if (res.error.code === 'BOOKED_EJEMPLAR') {
            this.notificationService.error('No se puede eliminar un ejemplar en préstamo');
          } else {
            this.notificationService.error(
              'Se ha producido un error al intentar eliminar el ejemplar',
            );
          }
        },
      });
    });
  }
  navigateToPrestamo(ejemplar: EjemplarTableDTO): void {
    if (ejemplar.estado !== 'PRESTADO') {
      return;
    }
    this.dialogService
      .confirm('Ir a préstamo', '¿Desea ir al préstamo del ejemplar?', 'Confirmar')
      .subscribe((confirmed) => {
        if (!confirmed) return;

        const idEjemplar = ejemplar.idEjemplar;
        const idLibro = ejemplar.idLibro;
        this.closeDialog();
        this.router.navigateByUrl('prestamos', {
          state: {
            idEjemplar: idEjemplar,
            idLibro: idLibro,
            origen: 'libroDetail',
          },
        });
      });
  }

  private getConfirmContent(ejemplar: EjemplarTableDTO): { titulo: string; mensaje: string } {
    return ejemplar.estado === 'NUEVO'
      ? {
          titulo: 'Eliminar Ejemplar',
          mensaje: `El ejemplar #${ejemplar.idEjemplar} es nuevo y será eliminado permanentemente.`,
        }
      : {
          titulo: 'Dar de baja Ejemplar',
          mensaje: `El ejemplar #${ejemplar.idEjemplar} está disponible. ¿Confirmar baja?`,
        };
  }
}
