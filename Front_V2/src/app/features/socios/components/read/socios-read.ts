import { ChangeDetectorRef, Component } from '@angular/core';
import { BasePagedComponent } from '../../../../shared/base/basePagedComponent';

import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatSortModule } from '@angular/material/sort';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { icons } from '../../../../shared/constants/iconPaths';
import { Subscription } from 'rxjs';

import { NotificationService } from '../../../../shared/services/notificationService/notification-service';
import { DialogService } from '../../../../shared/services/dialogService/dialog-service';
import { ViewportService } from '../../../../core/services/viewportService/viewport-service';
import { SocioTableDTO } from '../../models/socioTable.dto';
import { SocioService } from '../../services/socio-service';
import { TipoConfirmacion } from '../../../../shared/models/confirmDialogData.model';
import { OnlyNumbersDirective } from '../../../../shared/directives/onlyNumbers.directive';

@Component({
  selector: 'app-socios-read',
  imports: [
    MatTableModule,
    MatPaginatorModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatSortModule,
    MatTooltipModule,
    CommonModule,
    RouterLink,
    OnlyNumbersDirective,
  ],
  templateUrl: './socios-read.html',
  styleUrl: './socios-read.scss',
})
export class SociosRead extends BasePagedComponent<SocioTableDTO> {
  icons = icons;
  searchInput = new FormGroup({
    data: new FormControl('', [Validators.maxLength(100)]),
  });

  displayedColumns: string[] = ['id', 'email', 'estado', 'cantprestamos', 'actions'];

  private mobileSubscription: Subscription = new Subscription();

  constructor(
    private viewportService: ViewportService,
    private cdr: ChangeDetectorRef,
    private dialogService: DialogService,
    private notificationService: NotificationService,
    private socioService: SocioService,
  ) {
    super();
  }

  ngOnInit(): void {
    this.initTrackers();
    this.loadData();
  }
  ngOnDestroy(): void {
    this.mobileSubscription.unsubscribe();
  }

  override onSubmit(): void {
    const { data } = this.searchInput.getRawValue();
    super.onSubmit(data!);
  }

  override loadData(): void {
    this.setLoadingState();
    this.socioService
      .getByPage(this.pageIndex, this.pageSize, this.sortColumn, this.sortOrder, this.filterValue)
      .subscribe({
        next: (res) => {
          this.totalRecords = res.total;
          this.dataSource.data = this.fillMissingRows(res.data);
          if (this.isMobile) {
            this.cdr.markForCheck();
          }
        },
        error: (err) => console.log(err),
        complete: () => {
          this.isLoading = false;
        },
      });
  }
  override getEmptyObject(): SocioTableDTO {
    return {
      id: 0,
      email: 'email',
      estado: 'HABILITADO',
      cantprestamos: 0,
    };
  }
  override getSkeletonObject(): SocioTableDTO {
    return {
      id: -1,
      email: 'email',
      estado: 'HABILITADO',
      cantprestamos: 0,
    };
  }

  deleteSocio(socio: SocioTableDTO): void {
    const { titulo, mensaje, confirmar } = this.getConfirmContent(socio);
    this.dialogService.confirm(titulo, mensaje, confirmar).subscribe((confirmed) => {
      if (!confirmed) return;

      this.socioService.delete(socio.id!).subscribe({
        next: () => {
          this.loadData();
        },

        error: () => {
          this.notificationService.error('No se puede eliminar un socio que tenga préstamos'); // Error no accesible en flujo normal
        },
      });
    });
  }
  openDetailDialog(id: number): void {
    this.socioService.getSocioDetail(id).subscribe({
      next: (socio) => {
        this.dialogService.openSocioDetail(socio);
      },
      error: () => {
        this.notificationService.error('Socio no encontrado');
      },
    });
  }

  private initTrackers(): void {
    this.mobileSubscription = this.viewportService.getMobileTracker().subscribe((state) => {
      this.isMobile = state;
      this.cdr.markForCheck();
    });
  }
  private getConfirmContent(socio: SocioTableDTO): {
    titulo: string;
    mensaje: string;
    confirmar: TipoConfirmacion;
  } {
    return socio.cantprestamos === 0
      ? {
          titulo: 'Eliminar Socio',
          mensaje: `El Socio #${socio.id} no tiene préstamos y será eliminado permanentemente.`,
          confirmar: 'BORRAR',
        }
      : {
          titulo: 'Dar de baja Socio',
          mensaje: `El Socio #${socio.id} tiene préstamos, por lo que será dado de baja. ¿Confirmar baja?`,
          confirmar: 'CONFIRMAR',
        };
  }
}
