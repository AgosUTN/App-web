import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  // Centraliza configuración, titulos y separa toastr de los componentes.

  constructor(private toastr: ToastrService) {}

  success(message: string) {
    this.toastr.success(message, 'Éxito', {
      timeOut: 3000,
    });
  }

  error(message: string) {
    this.toastr.error(message, 'Error', {
      timeOut: 5000,
      progressBar: true,
    });
  }
}
