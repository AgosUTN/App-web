import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { NotificationService } from '../../../../shared/services/notification-service';

@Component({
  selector: 'app-editoriales-create',

  imports: [ReactiveFormsModule, CommonModule, MatButtonModule],
  templateUrl: './editoriales-create.html',
  styleUrl: './editoriales-create.scss',
})
export class EditorialesCreate {
  repetido: boolean = true;

  editorialForm = new FormGroup({
    nombre: new FormControl('', [Validators.required, Validators.maxLength(15)]),
  });

  constructor(private notification: NotificationService) {}

  onSubmit() {
    this.notification.error('Editorial creada correctamente');
    console.log('Formulario enviado');
  }
}
