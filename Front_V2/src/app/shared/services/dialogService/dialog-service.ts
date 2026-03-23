import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { ConfirmDialog } from '../../components/confirmDialog/confirm-dialog';
import { EditorialReadDialog } from '../../../features/editoriales/components/readDialog/editorial-read-dialog';
import { EditorialTableDTO } from '../../../features/editoriales/models/editorialTable.dto';
import { LibrosDetailDialog } from '../../../features/libros/components/detailDialog/libros-detail-dialog';
import { LibroDetailDTO } from '../../../features/libros/models/libroDetail.dto';
import { AutorTableDTO } from '../../../features/autores/models/autorTable.dto';
import { AutorReadDialog } from '../../../features/autores/components/readDialog/autor-read-dialog';
import { PrestamosDetailDialog } from '../../../features/prestamos/components/detailDialog/prestamos-detail-dialog';
import { PrestamoDetailDTO } from '../../../features/prestamos/models/prestamoDetail.dto';
import { TipoConfirmacion } from '../../models/confirmDialogData.model';
import { SocioDetailDTO } from '../../../features/socios/models/socioDetail.dto';
import { SociosDetail } from '../../../features/socios/components/detail/socios-detail';

@Injectable({
  providedIn: 'root',
})
export class DialogService {
  constructor(private dialog: MatDialog) {}

  confirm(
    title: string,
    message: string,
    tipoConfirmacion: TipoConfirmacion,
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
        data: { title, message, tipoConfirmacion, confirmText, cancelText },
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
  selectAutor(): Observable<AutorTableDTO | undefined> {
    console.log('Anda el select del dialog');
    return this.dialog
      .open(AutorReadDialog, {
        width: '900px',
        height: '600px',
        disableClose: false,
        backdropClass: 'custom-backdrop',

        maxHeight: '95vh',
      })
      .afterClosed();
  }
  openLibroDetail(libro: LibroDetailDTO): Observable<void> {
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
  openPrestamoDetail(prestamo: PrestamoDetailDTO): Observable<boolean> {
    return this.dialog
      .open(PrestamosDetailDialog, {
        width: '900px',
        height: '600px',
        disableClose: false,
        backdropClass: 'custom-backdrop',
        data: prestamo,
        maxHeight: '95vh',
      })
      .afterClosed();
  }
  openSocioDetail(socio: SocioDetailDTO): Observable<void> {
    return this.dialog
      .open(SociosDetail, {
        width: '900px',
        height: '600px',
        disableClose: false,
        backdropClass: 'custom-backdrop',
        data: socio,
        maxHeight: '95vh',
      })
      .afterClosed();
  }
}
