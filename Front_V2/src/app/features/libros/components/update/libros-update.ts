import { ChangeDetectorRef, Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { MatButtonModule } from '@angular/material/button';

import { CommonModule } from '@angular/common';

import { LibrosCreate } from '../create/libros-create';
import { ActivatedRoute, Router } from '@angular/router';
import { DialogService } from '../../../../shared/services/dialogService/dialog-service';
import { LibroService } from '../../services/libro-service';
import { NotificationService } from '../../../../shared/services/notificationService/notification-service';
import { isbnValidator } from '../../../../shared/validators/isbn.validator';
import { HttpErrorResponse } from '@angular/common/http';
import { LibroUpdateDTO } from '../../models/libroUpdate.dto';
@Component({
  selector: 'app-libros-update',
  imports: [ReactiveFormsModule, MatButtonModule, CommonModule],
  templateUrl: '../create/libros-create.html',
  styleUrl: '../create/libros-create.scss',
})
export class LibrosUpdate extends LibrosCreate {
  override submitLabel: string = 'Guardar cambios';
  override successMessage: string = 'Libro actualizado correctamente';
  override libroForm = new FormGroup({
    titulo: new FormControl('', [Validators.required, Validators.maxLength(100)]),
    isbn: new FormControl('', [Validators.required, isbnValidator()]),
    cantejemplares: new FormControl<string | null>({ value: null, disabled: true }),
    editorial: new FormControl<string | null>({ value: null, disabled: true }),
    autor: new FormControl<string | null>({ value: null, disabled: true }),
    descripcion: new FormControl('', [Validators.required, Validators.maxLength(500)]),
  });
  id: number = 0;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    protected override dialogService: DialogService,
    protected override cdr: ChangeDetectorRef,
    protected override libroService: LibroService,
    protected override notificationService: NotificationService,
  ) {
    super(dialogService, libroService, notificationService, cdr);
  }

  ngOnInit(): void {
    this.id = Number(this.route.snapshot.paramMap.get('id'));
    this.libroService.getById(this.id).subscribe({
      next: (libro) => {
        this.libroForm.patchValue({
          titulo: libro.titulo,
          isbn: libro.isbn,
          descripcion: libro.descripcion,
          editorial: libro.editorial.nombre,
          autor: libro.autor.nombreCompleto,
          cantejemplares: libro.cantejemplares,
        });
        this.idEditorial = libro.editorial.id;
        this.idAutor = libro.autor.id;
        this.cdr.markForCheck();
      },
      error: (err) => {
        if (err.status === 404) {
          this.router.navigate(['/error/404']);
        }
      },
    });
  }
  override onSubmit(): void {
    this.isLoading = true;
    const libro = this.getUpdateDTO();
    this.libroService.update(this.id, libro).subscribe({
      next: () => {
        this.isLoading = false;
        this.notificationService.success(this.successMessage);
        this.cdr.detectChanges();
      },
      error: (error: HttpErrorResponse) => {
        this.isLoading = false;
        this.cdr.detectChanges();
        if (error.status === 400) {
          this.notificationService.error('Editorial o Autor inexistente');
        }
        if (error.status === 409) {
          if (error.error.code === 'ISBN_DUPLICATE') {
            this.libroForm.get('isbn')?.setErrors({ duplicated: true });
          }
          if (error.error.code === 'TITULO_DUPLICATE') {
            this.libroForm.get('titulo')?.setErrors({ duplicated: true });
          }
        }
      },
    });
  }
  private getUpdateDTO(): LibroUpdateDTO {
    const libro = this.libroForm.getRawValue();
    return {
      titulo: libro.titulo!,
      descripcion: libro.descripcion!,
      isbn: libro.isbn!,
      miEditorial: this.idEditorial!,
      miAutor: this.idAutor,
    };
  }
}
