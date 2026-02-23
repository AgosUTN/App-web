import { Component } from '@angular/core';
import { EditorialCount } from '../../models/editorialCount.model';
import { EditorialService } from '../../services/editorial-service';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatSortModule, Sort } from '@angular/material/sort';
import { icons } from '../../../../shared/constants/iconPaths';
import { BasePagedComponent } from '../../../../shared/base/basePagedComponent';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-editoriales-read',
  imports: [
    MatTableModule,
    MatPaginatorModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatSortModule,
    MatTooltipModule,
  ],
  templateUrl: './editoriales-read.html',
  styleUrl: './editoriales-read.scss',
})
export class EditorialesRead extends BasePagedComponent<EditorialCount> {
  icons = icons;
  searchInput = new FormGroup({
    data: new FormControl('', [Validators.maxLength(15)]),
  });

  displayedColumns: string[] = ['id', 'nombre', 'cantlibros', 'editar', 'borrar'];

  constructor(private editorialService: EditorialService) {
    super();
  }

  ngOnInit(): void {
    this.loadData();
  }

  override onSubmit(): void {
    const { data } = this.searchInput.getRawValue();
    super.onSubmit(data!);
  }

  override loadData(): void {
    this.isLoading = true;
    this.editorialService
      .getByPage(this.pageIndex, this.pageSize, this.sortColumn, this.sortOrder, this.filterValue)
      .subscribe({
        next: (res) => {
          this.totalRecords = res.total;

          const data = [...res.data]; // copia

          const emptyRows = this.pageSize - data.length;

          if (emptyRows > 0) {
            const emptyArray = Array.from({ length: emptyRows }, () => ({
              id: 0,
              nombre: 'nombre',
              cantlibros: 0,
            }));

            this.dataSource.data = [...data, ...emptyArray];
          } else {
            this.dataSource.data = data;
          }
        },
        error: (err) => console.log(err),
        complete: () => (this.isLoading = false),
      });
  }
}
