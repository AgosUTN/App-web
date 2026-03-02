import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { ConfirmDialog } from '../../components/confirmDialog/confirm-dialog';
import { EditorialReadDialog } from '../../../features/editoriales/components/readDialog/editorial-read-dialog';
import { EditorialTableDTO } from '../../../features/editoriales/models/editorialTable.dto';

@Injectable({
  providedIn: 'root',
})
export class DialogService {
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
  selectEditorial(): Observable<EditorialTableDTO | undefined> {
    return this.dialog
      .open(EditorialReadDialog, {
        width: '900px',
        height: '600px',
        disableClose: false,
      })
      .afterClosed();
  }
}
