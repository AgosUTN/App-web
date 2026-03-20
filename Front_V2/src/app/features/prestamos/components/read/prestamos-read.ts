import { ChangeDetectorRef, Component } from '@angular/core';
import { BasePagedComponent } from '../../../../shared/base/basePagedComponent';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatSortModule, Sort } from '@angular/material/sort';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { icons } from '../../../../shared/constants/iconPaths';
import { Subscription } from 'rxjs';
import { NotificationService } from '../../../../shared/services/notificationService/notification-service';
import { DialogService } from '../../../../shared/services/dialogService/dialog-service';
import { ViewportService } from '../../../../core/services/viewportService/viewport-service';
import { PrestamoTableDTO } from '../../models/prestamoTable.dto';
import { PrestamoService } from '../../services/prestamo-service';
import { MatButtonToggleChange, MatButtonToggleModule } from '@angular/material/button-toggle';
import { EstadoPrestamo } from '../../models/prestamoEstado.type';
import { OnlyNumbersDirective } from '../../../../shared/directives/onlyNumbers.directive';

@Component({
  selector: 'app-prestamos-read',
  imports: [
    MatTableModule,
    MatPaginatorModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatSortModule,
    MatTooltipModule,
    CommonModule,
    RouterLink,
    MatButtonToggleModule,
    OnlyNumbersDirective,
  ],
  templateUrl: './prestamos-read.html',
  styleUrl: './prestamos-read.scss',
})
export class PrestamosRead extends BasePagedComponent<PrestamoTableDTO> {
  icons = icons;
  searchInput = new FormGroup({
    data: new FormControl('', [Validators.maxLength(10)]),
  });
  override sortColumn: string = 'fechaPrestamo';
  override sortOrder: string = 'desc';
  estadoFilter: EstadoPrestamo | null = null;

  displayedColumns: string[] = ['idsocio', 'fechaPrestamo', 'estado', 'cantlibros', 'actions'];

  private mobileSubscription: Subscription = new Subscription();

  constructor(
    private viewportService: ViewportService,
    private cdr: ChangeDetectorRef,
    private dialogService: DialogService,
    private notificationService: NotificationService,
    private prestamoService: PrestamoService,
  ) {
    super();
  }
  ngOnInit(): void {
    this.initTrackers();
    this.loadData();

    const state = history.state;

    if (state?.origen === 'libroDetail') {
      this.openDetailDialogByEjemplar(history.state.idEjemplar, history.state.idLibro);
    }
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
    this.prestamoService
      .getByPage(
        this.pageIndex,
        this.pageSize,
        this.sortColumn,
        this.sortOrder,
        this.filterValue,
        this.estadoFilter,
      )
      .subscribe({
        next: (res) => {
          this.totalRecords = res.total;
          this.dataSource.data = this.fillMissingRows(res.data);
          if (this.isMobile) {
            this.cdr.markForCheck();
          }
        },
        complete: () => {
          this.isLoading = false;
        },
      });
  }
  override getEmptyObject(): PrestamoTableDTO {
    return {
      id: 0,
      fechaCreacion: new Date(),
      idSocio: 0,
      estado: 'PENDIENTE',
      cantlibros: 0,
    };
  }
  override getSkeletonObject(): PrestamoTableDTO {
    return {
      id: -1,
      fechaCreacion: new Date(),
      idSocio: 0,
      estado: 'PENDIENTE',
      cantlibros: 0,
    };
  }
  override onSortChange(event: Sort): void {
    this.sortColumn = event.active;
    this.sortOrder = event.direction.toString();
    if (this.sortOrder === '') {
      this.sortColumn = 'fechaPrestamo';
      this.sortOrder = 'desc';
    }
    this.resetPaginator();
    this.loadData();
  }

  openDetailDialog(id: number): void {
    this.prestamoService.getPrestamoDetail(id).subscribe({
      next: (prestamo) => {
        this.dialogService.openPrestamoDetail(prestamo).subscribe((prestamoFinalizado: boolean) => {
          if (prestamoFinalizado) {
            this.loadData();
          }
        });
      },
      error: () => {
        this.notificationService.error('Préstamo no encontrado');
      },
    });
  }
  openDetailDialogByEjemplar(idEjemplar: number, idLibro: number): void {
    this.prestamoService.getPrestamoDetailByEjemplar(idEjemplar, idLibro).subscribe({
      next: (prestamo) => {
        this.dialogService.openPrestamoDetail(prestamo).subscribe((prestamoFinalizado: boolean) => {
          history.replaceState({}, '');
          if (prestamoFinalizado) {
            this.loadData();
          }
        });
      },
      error: () => {
        this.notificationService.error('Préstamo no encontrado');
      },
    });
  }

  onToggleChange(event: MatButtonToggleChange): void {
    console.log(event);
    if (event.value) {
      console.log(event.value);
      this.estadoFilter = event.value;
    } else {
      this.estadoFilter = null;
    }
    this.resetPaginator();
    this.loadData();
  }

  private initTrackers(): void {
    this.mobileSubscription = this.viewportService.getMobileTracker().subscribe((state) => {
      this.isMobile = state;
      this.cdr.markForCheck();
    });
  }
}
