import { ChangeDetectorRef, Component } from '@angular/core';
import { BasePagedComponent } from '../../../../shared/base/basePagedComponent';
import { LibroTableDTO } from '../../models/libroTable.dto';
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
import { LibroService } from '../../services/libro-service';
import { NotificationService } from '../../../../shared/services/notificationService/notification-service';
import { DialogService } from '../../../../shared/services/dialogService/dialog-service';
import { ViewportService } from '../../../../core/services/viewportService/viewport-service';

@Component({
  selector: 'app-libros-read',
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
  templateUrl: './libros-read.html',
  styleUrl: './libros-read.scss',
})
export class LibrosRead extends BasePagedComponent<LibroTableDTO> {
  icons = icons;
  searchInput = new FormGroup({
    data: new FormControl('', [Validators.maxLength(100)]),
  });

  displayedColumns: string[] = ['id', 'titulo', 'autor', 'editorial', 'cantprestamos', 'actions'];

  private mobileSubscription: Subscription = new Subscription();

  constructor(
    private viewportService: ViewportService,
    private cdr: ChangeDetectorRef,
    private dialogService: DialogService,
    private notificationService: NotificationService,
    private libroService: LibroService,
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
    this.libroService
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
  override getEmptyObject(): LibroTableDTO {
    return {
      id: 0,
      titulo: 'nombre',
      autor: 'autor',
      editorial: 'editorial',
      cantprestamos: 0,
    };
  }
  override getSkeletonObject(): LibroTableDTO {
    return {
      id: -1,
      titulo: 'nombre',
      autor: 'autor',
      editorial: 'editorial',
      cantprestamos: 0,
    };
  }

  deleteLibro(libro: LibroTableDTO): void {
    this.dialogService
      .confirm(
        'Eliminar libro',
        `¿Seguro que deseas eliminar el libro "${libro.titulo}" y todos sus ejemplares?`,
        'BORRAR',
      )
      .subscribe((confirmed) => {
        if (!confirmed) return;

        this.libroService.delete(libro.id!).subscribe({
          next: () => {
            this.loadData();
          },

          error: () => {
            this.notificationService.error('No se puede eliminar un libro que haya sido prestado'); // Error no accesible en flujo normal
          },
        });
      });
  }
  openDetailDialog(id: number): void {
    this.libroService.getLibroDetail(id).subscribe({
      next: (libro) => {
        this.dialogService.openLibroDetail(libro);
      },
      error: () => {
        this.notificationService.error('Libro no encontrado');
      },
    });
  }

  private initTrackers(): void {
    this.mobileSubscription = this.viewportService.getMobileTracker().subscribe((state) => {
      this.isMobile = state;
      this.cdr.markForCheck();
    });
  }
}
