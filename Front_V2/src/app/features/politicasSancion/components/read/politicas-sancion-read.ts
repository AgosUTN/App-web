import { Component, ChangeDetectorRef } from '@angular/core';
import { BasePagedComponent } from '../../../../shared/base/basePagedComponent';
import { PoliticaSancionReadDTO } from '../../models/politicaSancionRead.dto';
import { icons } from '../../../../shared/constants/iconPaths';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatSortModule, Sort } from '@angular/material/sort';
import { CommonModule } from '@angular/common';
import { ViewportService } from '../../../../core/services/viewportService/viewport-service';
import { Subscription } from 'rxjs';
import { RouterLink } from '@angular/router';
import { DialogService } from '../../../../shared/services/dialogService/dialog-service';
import { PoliticaSancionService } from '../../services/politica-sancion-service';
import { PoliticaSancionTableDTO } from '../../models/politicaSancionTable.dto';
import { OnlyNumbersDirective } from '../../../../shared/directives/onlyNumbers.directive';

@Component({
  selector: 'app-politicas-sancion-read',
  imports: [
    MatTableModule,
    MatPaginatorModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatSortModule,
    CommonModule,
    RouterLink,
    OnlyNumbersDirective,
  ],
  templateUrl: './politicas-sancion-read.html',
  styleUrl: './politicas-sancion-read.scss',
})
export class PoliticasSancionRead extends BasePagedComponent<PoliticaSancionReadDTO> {
  icons = icons;
  searchInput = new FormGroup({
    data: new FormControl(''),
  });
  override sortColumn: string = 'diasHasta';

  displayedColumns: string[] = ['diasHasta', 'diasSancion', 'actions'];

  private mobileSubscription: Subscription = new Subscription();

  constructor(
    private psService: PoliticaSancionService,
    private viewportService: ViewportService,
    private cdr: ChangeDetectorRef,
    private dialogService: DialogService,
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
    this.psService
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

  override getEmptyObject(): PoliticaSancionTableDTO {
    return {
      diasHasta: 0,
      diasSancion: 0,
    };
  }
  override getSkeletonObject(): PoliticaSancionTableDTO {
    return {
      diasHasta: -1,
      diasSancion: 0,
    };
  }

  override onSortChange(event: Sort): void {
    this.sortColumn = event.active;
    this.sortOrder = event.direction.toString();
    if (this.sortOrder === '') {
      this.sortColumn = 'diasHasta';
      this.sortOrder = 'asc';
    }
    this.resetPaginator();
    this.loadData();
  }

  deletePolitica(politica: PoliticaSancionTableDTO): void {
    this.dialogService
      .confirm(
        'Eliminar política',
        `¿Seguro que deseas eliminar la politica de "${politica.diasHasta}" días de atraso máximo?`,
        'BORRAR',
      )
      .subscribe((confirmed) => {
        if (!confirmed) return;

        this.psService.delete(politica.diasHasta).subscribe({
          next: () => this.loadData(),
          error: () => {}, // No hay error que llegue.
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
