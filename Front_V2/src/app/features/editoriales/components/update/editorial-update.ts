import { ChangeDetectorRef, Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { NotificationService } from '../../../../shared/services/notificationService/notification-service';
import { EditorialService } from '../../services/editorial-service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-editoriales-update',
  imports: [ReactiveFormsModule, CommonModule, MatButtonModule],
  templateUrl: '../create/editoriales-create.html',
  styleUrl: '../create/editoriales-create.scss',
})
export class EditorialesUpdate {
  loading = false;
  submitLabel = 'Guardar cambios';

  private id!: number;

  editorialForm = new FormGroup({
    nombre: new FormControl('', [Validators.required, Validators.maxLength(30)]),
  });

  constructor(
    private notification: NotificationService,
    private editorialService: EditorialService,
    private route: ActivatedRoute,
    private router: Router,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.id = Number(this.route.snapshot.paramMap.get('id'));
    this.editorialService.getById(this.id).subscribe({
      next: (editorial) => {
        this.editorialForm.patchValue({ nombre: editorial.nombre });
        this.cdr.markForCheck();
      },
      error: (err) => {
        if (err.status === 404) {
          this.router.navigate(['/error/404']);
        }
      },
    });
  }

  onSubmit(): void {
    const { nombre } = this.editorialForm.getRawValue();
    console.log(nombre);
    this.loading = true;
    this.editorialService.update(this.id, nombre!).subscribe({
      next: () => {
        this.notification.success('Editorial actualizada correctamente');
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        if (err.status === 409) {
          this.editorialForm.get('nombre')?.setErrors({ repetido: true });
        }
      },
    });
  }
}
