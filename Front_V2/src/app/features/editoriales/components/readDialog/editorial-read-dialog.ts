import { Component } from '@angular/core';
import { EditorialService } from '../../services/editorial-service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { icons } from '../../../../shared/constants/iconPaths';
import { BasePagedComponent } from '../../../../shared/base/basePagedComponent';
import { EditorialTableDTO } from '../../models/editorialTable.dto';
import { CommonModule } from '@angular/common';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSortModule } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-editorial-read-dialog',
  imports: [
    MatTableModule,
    MatPaginatorModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatSortModule,
    MatTooltipModule,
    CommonModule,
  ],
  templateUrl: './editorial-read-dialog.html',
  styleUrl: './editorial-read-dialog.scss',
})
export class EditorialReadDialog extends BasePagedComponent<EditorialTableDTO> {
  icons = icons;
  searchInput = new FormGroup({
    data: new FormControl('', [Validators.maxLength(30)]),
  });
  displayedColumns: string[] = ['id', 'nombre'];
  override pageSize = 6;

  constructor(
    private editorialService: EditorialService,
    private dialogRef: MatDialogRef<EditorialReadDialog>,
  ) {
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
    this.setLoadingState();
    this.editorialService
      .getByPage(this.pageIndex, this.pageSize, this.sortColumn, this.sortOrder, this.filterValue)
      .subscribe({
        next: (res) => {
          this.totalRecords = res.total;
          this.dataSource.data = this.fillMissingRows(res.data);
        },
        error: (err) => console.log(err),
        complete: () => {
          this.isLoading = false;
        },
      });
  }

  override getEmptyObject(): EditorialTableDTO {
    return {
      id: 0,
      nombre: 'nombre',
      cantlibros: 0,
    };
  }
  override getSkeletonObject(): EditorialTableDTO {
    return {
      id: -1,
      nombre: 'nombre',
      cantlibros: 0,
    };
  }

  // Dialog
  confirm(editorial: EditorialTableDTO): void {
    if (editorial.id == -1 || editorial.id == 0) {
      return;
    }
    this.dialogRef.close(editorial);
  }
}
