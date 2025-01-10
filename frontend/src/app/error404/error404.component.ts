import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-error404',
  standalone: true,
  imports: [],
  templateUrl: './error404.component.html',
  styleUrl: './error404.component.css',
})
export class Error404Component {
  errorStatus: number;
  h1 = 'Error 404: Recurso no encontrado';

  constructor(private router: Router) {
    const navigation = this.router.getCurrentNavigation();
    this.errorStatus = navigation?.extras?.state?.['errorStatus'] ?? -1;
  }

  ngOnInit() {
    switch (this.errorStatus) {
      case 0:
        this.h1 = 'Error: No se puede conectar con el Servidor.';
        break;
      case 400:
        this.h1 =
          'Error 400: Ha ocurrido un error interno en la comunicación con el Servidor';
        break;
      case 500:
        this.h1 = 'Error 500: Ha ocurrido un error interno del Servidor. ';
        break;
    }
  }
}
