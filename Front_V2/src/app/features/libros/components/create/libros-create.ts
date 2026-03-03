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
@Component({
  selector: 'app-libros-create',
  imports: [ReactiveFormsModule, MatButtonModule, CommonModule],
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

  idEditorial: number | null = null;
  idAutor: number = 1; // CAMBIAR CUANDO SE TERMINE CRUD AUTOR.

  constructor(
    private dialogService: DialogService,
    private libroService: LibroService,
    private notification: NotificationService,
    private cdr: ChangeDetectorRef,
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
  onSubmit(): void {
    this.isLoading = true;
    const libro = this.getCreateDTO();
    this.libroService.post(libro).subscribe({
      next: () => {
        this.isLoading = false;
        this.notification.success('Libro creado correctamente');
        this.libroForm.reset();
      },
      error: (error: HttpErrorResponse) => {
        this.isLoading = false;
        this.cdr.detectChanges();
        if (error.status === 400) {
          this.notification.error('Editorial o Autor inexistente');
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
  sanitize(event: Event) {
    const input = event.target as HTMLInputElement;
    input.value = input.value.replace(/[^0-9]/g, '');
  }
  private getCreateDTO(): LibroCreateDTO {
    const libro = this.libroForm.getRawValue();
    return {
      titulo: libro.titulo!,
      descripcion: libro.descripcion!,
      isbn: libro.isbn!,
      miEditorial: this.idEditorial!,
      miAutor: this.idAutor,
      cantEjemplares: Number(libro.cantejemplares!),
    };
  }
}
