import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { LibroDetailDTO } from '../../models/libroDetail.dto';
import { CommonModule } from '@angular/common';
import { icons } from '../../../../shared/constants/iconPaths';
import { EjemplarTableDTO, EstadoEjemplar } from '../../models/ejemplarTable.dto';

@Component({
  selector: 'app-libros-detail-dialog',
  imports: [CommonModule],
  templateUrl: './libros-detail-dialog.html',
  styleUrl: './libros-detail-dialog.scss',
})
export class LibrosDetailDialog {
  icons = icons;
  constructor(
    private dialogRef: MatDialogRef<LibrosDetailDialog>,
    @Inject(MAT_DIALOG_DATA) public libro: LibroDetailDTO,
  ) {}

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
    }
    return '';
  }
}
