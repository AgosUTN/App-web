import { ChangeDetectorRef, Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { NotificationService } from '../../../../shared/services/notificationService/notification-service';

import { ActivatedRoute, Router } from '@angular/router';

import { AutorUpdateDTO } from '../../models/autorUpdate.dto';
import { AutorService } from '../../services/autor-service';

@Component({
  selector: 'app-autores-update',
  imports: [ReactiveFormsModule, CommonModule, MatButtonModule],
  templateUrl: '../create/autores-create.html',
  styleUrl: '../create/autores-create.scss',
})
export class AutoresUpdate {
  loading = false;
  submitLabel = 'Guardar cambios';

  private id!: number;

  autorForm = new FormGroup({
    nombrecompleto: new FormControl('', [Validators.required, Validators.maxLength(100)]),
  });

  constructor(
    private notification: NotificationService,
    private autorService: AutorService,
    private route: ActivatedRoute,
    private router: Router,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.id = Number(this.route.snapshot.paramMap.get('id'));
    this.autorService.getById(this.id).subscribe({
      next: (autor) => {
        this.autorForm.patchValue({ nombrecompleto: autor.nombrecompleto });
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
    const autorUpdateDTO = this.getUpdateDTO();

    this.loading = true;
    this.autorService.update(this.id, autorUpdateDTO).subscribe({
      next: () => {
        this.notification.success('Autor actualizado correctamente');
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

  private getUpdateDTO(): AutorUpdateDTO {
    const { nombrecompleto } = this.autorForm.getRawValue();
    return { nombrecompleto: nombrecompleto! };
  }
}
