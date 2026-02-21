import { Component } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-error-page',
  imports: [MatButtonModule, RouterLink, CommonModule],
  templateUrl: './error-page.html',
  styleUrl: './error-page.scss',
})
export class ErrorPage {
  imageLoaded: boolean = false;
  imageUrl: string = '';
  title: string = '';
  message: string = '';

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    const code = this.route.snapshot.paramMap.get('code');
    this.defineErrorPage(code); //REVISAR si siempre viene null.
  }

  private defineErrorPage(code: string | null): void {
    switch (code) {
      case '0':
        this.title = 'Error 500';
        this.message = 'No se ha podido conectar con el servidor';
        this.imageUrl = 'images/500.svg';
        break;

      case '400':
        this.title = 'Error 400';
        this.message = 'Solicitud incorrecta';
        this.imageUrl = 'images/500.svg';
        break;

      case '404':
        this.title = 'Error 404';
        this.message = 'La página que está buscando no ha sido encontrada';
        this.imageUrl = 'images/404.svg';
        break;

      case '500':
        this.title = 'Error 500';
        this.message = 'Ha ocurrido un error interno del servidor';
        this.imageUrl = 'images/500.svg';
        break;

      default: // Se activa ante un código no contemplado /error/600
        this.title = 'Error 404';
        this.message = 'La página que está buscando no ha sido encontrada';
        this.imageUrl = 'images/404.svg';
        break;
    }
  }
}
