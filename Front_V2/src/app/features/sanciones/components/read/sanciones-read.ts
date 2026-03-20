import { ChangeDetectorRef, Component } from '@angular/core';
import { BasePagedComponent } from '../../../../shared/base/basePagedComponent';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatSortModule, Sort } from '@angular/material/sort';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CommonModule } from '@angular/common';
import { icons } from '../../../../shared/constants/iconPaths';
import { Subscription } from 'rxjs';
import { NotificationService } from '../../../../shared/services/notificationService/notification-service';
import { DialogService } from '../../../../shared/services/dialogService/dialog-service';
import { ViewportService } from '../../../../core/services/viewportService/viewport-service';

import { MatButtonToggleChange, MatButtonToggleModule } from '@angular/material/button-toggle';

import { OnlyNumbersDirective } from '../../../../shared/directives/onlyNumbers.directive';
import { SancionTableDTO } from '../../models/sancionTable.dto';
import { EstadoSancion } from '../../models/estadoSancion.type';
import { SancionService } from '../../services/sancion-service';

@Component({
  selector: 'app-sanciones-read',
  imports: [
    MatTableModule,
    MatPaginatorModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatSortModule,
    MatTooltipModule,
    CommonModule,

    MatButtonToggleModule,
    OnlyNumbersDirective,
  ],
  templateUrl: './sanciones-read.html',
  styleUrl: './sanciones-read.scss',
})
export class SancionesRead extends BasePagedComponent<SancionTableDTO> {
  icons = icons;
  searchInput = new FormGroup({
    data: new FormControl('', [Validators.maxLength(10)]),
  });
  override sortColumn: string = 'fechaSancion';
  override sortOrder: string = 'desc';
  estadoFilter: EstadoSancion | null = null;

  displayedColumns: string[] = [
    'idsocio',
    'titulo',
    'fechaSancion',
    'fechaFin',
    'estado',
    'actions',
  ];

  private mobileSubscription: Subscription = new Subscription();

  constructor(
    private viewportService: ViewportService,
    private cdr: ChangeDetectorRef,
    private dialogService: DialogService,
    private notificationService: NotificationService,
    private sancionService: SancionService,
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
    this.sancionService
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
        error: () => {}, // No llega error
        complete: () => {
          this.isLoading = false;
        },
      });
  }
  override getEmptyObject(): SancionTableDTO {
    return {
      id: 0,
      idSocio: 0,
      titulo: '',
      fechaInicio: new Date(),
      fechaFin: new Date(),
      estado: 'FINALIZADA',
    };
  }
  override getSkeletonObject(): SancionTableDTO {
    return {
      id: -1,
      idSocio: -1,
      titulo: '',
      fechaInicio: new Date(),
      fechaFin: new Date(),
      estado: 'FINALIZADA',
    };
  }

  override onSortChange(event: Sort): void {
    this.sortColumn = event.active;
    this.sortOrder = event.direction.toString();
    if (this.sortOrder === '') {
      this.sortColumn = 'fechaSancion';
      this.sortOrder = 'desc';
    }
    this.resetPaginator();
    this.loadData();
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

  revocarSancion(id: number, idSocio: number): void {
    this.dialogService
      .confirm(
        'Revocar sanción',
        `¿Está seguro que desea revocar la sanción del socio #${idSocio}?`,
        'CONFIRMAR',
        'Confirmar',
      )
      .subscribe(() => {
        this.sancionService.delete(id).subscribe(() => {
          this.loadData();
        });
      });
  }

  private initTrackers(): void {
    this.mobileSubscription = this.viewportService.getMobileTracker().subscribe((state) => {
      this.isMobile = state;
      this.cdr.markForCheck();
    });
  }
}
