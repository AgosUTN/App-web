import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { NotificationService } from '../../../../shared/services/notification-service';
import { EditorialService } from '../../services/editorial-service';

@Component({
  selector: 'app-editoriales-create',

  imports: [ReactiveFormsModule, CommonModule, MatButtonModule],
  templateUrl: './editoriales-create.html',
  styleUrl: './editoriales-create.scss',
})
export class EditorialesCreate {
  loading: boolean = false;

  editorialForm = new FormGroup({
    nombre: new FormControl('', [Validators.required, Validators.maxLength(15)]),
  });

  constructor(
    private notification: NotificationService,
    private editorialService: EditorialService,
  ) {}

  onSubmit(): void {
    const { nombre } = this.editorialForm.getRawValue();

    this.loading = true;

    this.editorialService.post(nombre!).subscribe({
      next: () => {
        this.notification.success('Editorial creada correctamente');
        this.editorialForm.reset();
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
