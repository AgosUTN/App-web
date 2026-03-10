import { Component, Input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { icons } from '../../../shared/constants/iconPaths';

@Component({
  selector: 'app-step2-component',
  imports: [ReactiveFormsModule, MatButtonModule, CommonModule],
  templateUrl: './step2-component.html',
  styleUrl: './step2-component.scss',
})
export class Step2Component {
  icons = icons;
  @Input() step2Form!: FormGroup;
  disponibles: number = 2;
  validationErrorPendiente: boolean = false;
  ejemplares: any[] = [
    { titulo: 'Don Quijote de la Mancha', idEjemplar: 1 },
    { titulo: 'Moby Dick', idEjemplar: 2 },
    { titulo: 'Moby Dick', idEjemplar: 2 },
    { titulo: 'Moby Dick y las aventuras del cápitan Halo Montini', idEjemplar: 2 },
    { titulo: 'Moby Dick', idEjemplar: 2 },
  ];
  sanitize(event: Event) {
    const input = event.target as HTMLInputElement;
    input.value = input.value.replace(/[^0-9]/g, '');
  }
  eliminarEjemplar(ej: any): void {}
}
