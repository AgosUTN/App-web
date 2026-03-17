import { Component } from '@angular/core';

import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { icons } from '../../../../shared/constants/iconPaths';
import { BasePagedComponent } from '../../../../shared/base/basePagedComponent';

import { CommonModule } from '@angular/common';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSortModule } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatDialogRef } from '@angular/material/dialog';
import { AutorTableDTO } from '../../models/autorTable.dto';
import { AutorService } from '../../services/autor-service';

@Component({
  selector: 'app-autor-read-dialog',
  imports: [
    MatTableModule,
    MatPaginatorModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatSortModule,
    MatTooltipModule,
    CommonModule,
  ],
  templateUrl: './autor-read-dialog.html',
  styleUrl: './autor-read-dialog.scss',
})
export class AutorReadDialog extends BasePagedComponent<AutorTableDTO> {
  icons = icons;
  searchInput = new FormGroup({
    data: new FormControl('', [Validators.maxLength(100)]),
  });
  displayedColumns: string[] = ['id', 'nombrecompleto'];
  override pageSize = 6;

  constructor(
    private autorService: AutorService,
    private dialogRef: MatDialogRef<AutorReadDialog>,
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
    this.autorService
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

  override getEmptyObject(): AutorTableDTO {
    return {
      id: 0,
      nombrecompleto: 'nombrecompleto',
      cantlibros: 0,
    };
  }
  override getSkeletonObject(): AutorTableDTO {
    return {
      id: -1,
      nombrecompleto: 'nombrecompleto',
      cantlibros: 0,
    };
  }

  confirm(autor: AutorTableDTO): void {
    if (autor.id == -1 || autor.id == 0) {
      return;
    }
    this.dialogRef.close(autor);
  }
}
