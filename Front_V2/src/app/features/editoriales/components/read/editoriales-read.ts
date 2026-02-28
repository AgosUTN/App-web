import { ChangeDetectorRef, Component } from '@angular/core';
import { EditorialCount } from '../../models/editorialCount.model';
import { EditorialService } from '../../services/editorial-service';
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
import { ConfirmationService } from '../../../../shared/services/confirmationService/confirmation-service';

@Component({
  selector: 'app-editoriales-read',
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
  templateUrl: './editoriales-read.html',
  styleUrl: './editoriales-read.scss',
})
export class EditorialesRead extends BasePagedComponent<EditorialCount> {
  icons = icons;
  searchInput = new FormGroup({
    data: new FormControl('', [Validators.maxLength(15)]),
  });
  MOBILE_BREAKPOINT = 768;
  isMobile: boolean = window.innerWidth < this.MOBILE_BREAKPOINT;
  displayedColumns: string[] = ['id', 'nombre', 'cantlibros', 'actions'];

  private mobileSubscription: Subscription = new Subscription();

  constructor(
    private editorialService: EditorialService,
    private viewportService: ViewportService,
    private cdr: ChangeDetectorRef,
    private confirmService: ConfirmationService,
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
    this.editorialService
      .getByPage(this.pageIndex, this.pageSize, this.sortColumn, this.sortOrder, this.filterValue)
      .subscribe({
        next: (res) => {
          this.totalRecords = res.total;
          this.dataSource.data = this.fillMissingRows(res.data);
          if (this.isMobile) {
            this.cdr.markForCheck(); // Este parche solo se necesita en mobile, porque el array no lo maneja la matTable, lo maneja el ngFor.
          }
        },
        error: (err) => console.log(err),
        complete: () => {
          this.isLoading = false;
        },
      });
  }

  override getEmptyObject(): EditorialCount {
    return {
      id: 0,
      nombre: 'nombre',
      cantlibros: 0,
    };
  }
  override getSkeletonObject(): EditorialCount {
    return {
      id: -1,
      nombre: 'nombre',
      cantlibros: 0,
    };
  }
  private initTrackers(): void {
    this.mobileSubscription = this.viewportService.getMobileTracker().subscribe((state) => {
      this.isMobile = state;
      this.cdr.markForCheck();
    });
  }
  deleteEditorial(editorial: EditorialCount): void {
    this.confirmService
      .confirm(
        'Eliminar editorial',
        `¿Seguro que deseas eliminar la editorial "${editorial.nombre}"?`,
      )
      .subscribe((confirmed) => {
        if (!confirmed) return;

        this.editorialService.delete(editorial.id).subscribe({
          next: () => this.loadData(),
          error: (err) => console.error(err),
        });
      });
  }
}
