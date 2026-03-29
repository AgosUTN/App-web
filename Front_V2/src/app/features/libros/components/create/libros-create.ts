import { ChangeDetectorRef, Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { isbnValidator } from '../../../../shared/validators/isbn.validator';
import { MatButtonModule } from '@angular/material/button';
import { icons } from '../../../../shared/constants/iconPaths';
import { DialogService } from '../../../../shared/services/dialogService/dialog-service';
import { LibroCreateDTO } from '../../models/libroCreate.dto';
import { LibroService } from '../../services/libro-service';
import { NotificationService } from '../../../../shared/services/notificationService/notification-service';
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { OnlyNumbersDirective } from '../../../../shared/directives/onlyNumbers.directive';

@Component({
  selector: 'app-libros-create',
  imports: [ReactiveFormsModule, MatButtonModule, CommonModule, OnlyNumbersDirective],
  templateUrl: './libros-create.html',
  styleUrl: './libros-create.scss',
})
export class LibrosCreate {
  icons = icons;
  libroForm = new FormGroup({
    titulo: new FormControl('', [Validators.required, Validators.maxLength(100)]),
    isbn: new FormControl('', [Validators.required, isbnValidator()]),
    cantejemplares: new FormControl('', [Validators.min(0)]),
    editorial: new FormControl<string | null>({ value: null, disabled: true }),
    autor: new FormControl<string | null>({ value: null, disabled: true }),
    descripcion: new FormControl('', [Validators.required, Validators.maxLength(500)]),
  });
  isLoading: boolean = false;
  submitLabel: string = 'Crear Libro';
  successMessage: string = 'Libro creado correctamente';
  idEditorial: number | null = null;
  idAutor: number | null = null;

  constructor(
    protected dialogService: DialogService,
    protected libroService: LibroService,
    protected notificationService: NotificationService,
    protected cdr: ChangeDetectorRef,
  ) {}

  selectEditorial(): void {
    this.dialogService.selectEditorial().subscribe((editorial) => {
      if (editorial) {
        this.libroForm.patchValue({ editorial: editorial.nombre });
        this.idEditorial = editorial.id;
        this.cdr.detectChanges(); //Necesario porque la actualización de idEditorial sucede por fuera de reactive forms.
      }
    });
  }
  selectAutor(): void {
    this.dialogService.selectAutor().subscribe((autor) => {
      if (autor) {
        this.libroForm.patchValue({ autor: autor.nombrecompleto });
        this.idAutor = autor.id;
        this.cdr.detectChanges();
      }
    });
  }
  onSubmit(): void {
    this.isLoading = true;
    const libro = this.getCreateDTO();
    this.libroService.post(libro).subscribe({
      next: () => {
        this.isLoading = false;
        this.notificationService.success(this.successMessage);
        this.libroForm.reset();
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

  protected getCreateDTO(): LibroCreateDTO {
    const libro = this.libroForm.getRawValue();
    return {
      titulo: libro.titulo!,
      descripcion: libro.descripcion!,
      isbn: libro.isbn!,
      miEditorial: this.idEditorial!,
      miAutor: this.idAutor!,
      cantEjemplares: Number(libro.cantejemplares!),
    };
  }
}
