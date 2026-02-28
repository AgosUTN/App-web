import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { ConfirmDialog } from '../../components/confirmDialog/confirm-dialog';

@Injectable({
  providedIn: 'root',
})
export class ConfirmationService {
  constructor(private dialog: MatDialog) {}

  confirm(
    title: string,
    message: string,
    confirmText = 'Eliminar',
    cancelText = 'Cancelar',
    width: string = '400px',
    height: string = '200px',
  ): Observable<boolean> {
    return this.dialog
      .open(ConfirmDialog, {
        height: height,
        width: width,
        disableClose: true,
        data: { title, message, confirmText, cancelText },
        position: {
          top: '50px',
        },
      })
      .afterClosed();
  }
}
