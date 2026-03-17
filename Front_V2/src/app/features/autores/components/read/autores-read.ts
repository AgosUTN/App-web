import { ChangeDetectorRef, Component } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatSortModule } from '@angular/material/sort';
import { icons } from '../../../../shared/constants/iconPaths';
import { BasePagedComponent } from '../../../../shared/base/basePagedComponent';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CommonModule } from '@angular/common';
import { ViewportService } from '../../../../core/services/viewportService/viewport-service';
import { Subscription } from 'rxjs';
import { RouterLink } from '@angular/router';
import { DialogService } from '../../../../shared/services/dialogService/dialog-service';
import { AutorTableDTO } from '../../models/autorTable.dto';
import { NotificationService } from '../../../../shared/services/notificationService/notification-service';
import { AutorService } from '../../services/autor-service';

@Component({
  selector: 'app-autores-read',
  imports: [
    MatTableModule,
    MatPaginatorModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatSortModule,
    MatTooltipModule,
    CommonModule,
    RouterLink,
  ],
  templateUrl: './autores-read.html',
  styleUrl: './autores-read.scss',
})
export class AutoresRead extends BasePagedComponent<AutorTableDTO> {
  icons = icons;
  searchInput = new FormGroup({
    data: new FormControl('', [Validators.maxLength(100)]),
  });

  displayedColumns: string[] = ['id', 'nombrecompleto', 'cantlibros', 'actions'];

  private mobileSubscription: Subscription = new Subscription();

  constructor(
    private autorService: AutorService,
    private viewportService: ViewportService,
    private cdr: ChangeDetectorRef,
    private dialogService: DialogService,
    private notificationService: NotificationService,
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
    this.autorService
      .getByPage(this.pageIndex, this.pageSize, this.sortColumn, this.sortOrder, this.filterValue)
      .subscribe({
        next: (res) => {
          this.isLoading = false;
          this.totalRecords = res.total;
          this.dataSource.data = this.fillMissingRows(res.data);
          if (this.isMobile) {
            this.cdr.markForCheck();
          }
        },
        error: (err) => {
          this.isLoading = false;
          console.log(err);
        },
      });
  }

  override getEmptyObject(): AutorTableDTO {
    return {
      id: 0,
      nombrecompleto: 'nombre',
      cantlibros: 0,
    };
  }
  override getSkeletonObject(): AutorTableDTO {
    return {
      id: -1,
      nombrecompleto: 'nombre',
      cantlibros: 0,
    };
  }
  private initTrackers(): void {
    this.mobileSubscription = this.viewportService.getMobileTracker().subscribe((state) => {
      this.isMobile = state;
      this.cdr.markForCheck();
    });
  }
  deleteAutor(autor: AutorTableDTO): void {
    this.dialogService
      .confirm('Eliminar autor', `¿Seguro que deseas eliminar al autor "${autor.nombrecompleto}"?`)
      .subscribe((confirmed) => {
        if (!confirmed) return;

        this.autorService.delete(autor.id!).subscribe({
          next: () => this.loadData(),
          error: () => this.notificationService.error('El autor posee libros'),
        });
      });
  }
}
