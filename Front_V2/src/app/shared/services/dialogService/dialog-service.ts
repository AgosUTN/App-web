import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { ConfirmDialog } from '../../components/confirmDialog/confirm-dialog';
import { EditorialReadDialog } from '../../../features/editoriales/components/readDialog/editorial-read-dialog';
import { EditorialTableDTO } from '../../../features/editoriales/models/editorialTable.dto';
import { LibrosDetailDialog } from '../../../features/libros/components/detailDialog/libros-detail-dialog';
import { LibroDetailDTO } from '../../../features/libros/models/libroDetail.dto';

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
  ): Observable<boolean | undefined> {
    return this.dialog
      .open(ConfirmDialog, {
        height: height,
        width: width,
        disableClose: false,
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
        backdropClass: 'custom-backdrop',

        maxHeight: '95vh',
      })
      .afterClosed();
  }
  openLibroDetail(libro: LibroDetailDTO): Observable<any> {
    return this.dialog
      .open(LibrosDetailDialog, {
        width: '900px',
        height: '600px',
        disableClose: false,
        backdropClass: 'custom-backdrop',
        data: libro,
        maxHeight: '95vh',
      })
      .afterClosed();
  }
}
