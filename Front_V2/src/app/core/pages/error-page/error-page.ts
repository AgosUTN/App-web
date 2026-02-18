import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-error-page',
  imports: [],
  templateUrl: './error-page.html',
  styleUrl: './error-page.scss',
})
export class ErrorPage {
  imageUrl: string = '';
  title: string = '';
  messsage: string = '';

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    const code = this.route.snapshot.paramMap.get('code');
    this.defineErrorPage(code as string); //REVISAR
  }

  private defineErrorPage(code: string): void {}
}
