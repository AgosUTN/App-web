import { Component } from '@angular/core';
import { AutorCreateDTO } from '../../models/autorCreate.dto';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NotificationService } from '../../../../shared/services/notificationService/notification-service';
import { AutorService } from '../../services/autor-service';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-autores-create',
  imports: [CommonModule, ReactiveFormsModule, MatButtonModule],
  templateUrl: './autores-create.html',
  styleUrl: './autores-create.scss',
})
export class AutoresCreate {
  loading: boolean = false;
  submitLabel = 'Crear Autor';
  autorForm = new FormGroup({
    nombrecompleto: new FormControl('', [Validators.required, Validators.maxLength(100)]),
  });

  constructor(
    private notification: NotificationService,
    private autorService: AutorService,
  ) {}

  onSubmit(): void {
    const editorialCreate = this.getCreateDTO();

    this.loading = true;

    this.autorService.post(editorialCreate).subscribe({
      next: () => {
        this.notification.success('Autor creado correctamente');
        this.autorForm.reset();
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        if (err.status === 409) {
          this.autorForm.get('nombrecompleto')?.setErrors({ repetido: true });
        }
      },
    });
  }

  private getCreateDTO(): AutorCreateDTO {
    const { nombrecompleto } = this.autorForm.getRawValue();
    return { nombrecompleto: nombrecompleto! };
  }
}
