import { Component, EventEmitter, Output } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Breadcrumb } from '../breadcrumb/breadcrumb';

@Component({
  selector: 'app-toolbar',
  imports: [MatToolbarModule, MatIconModule, MatButtonModule, Breadcrumb],
  templateUrl: './toolbar.html',
  styleUrl: './toolbar.scss',
})
export class Toolbar {
  @Output() menuClick = new EventEmitter<void>();

  onMenuClick(): void {
    this.menuClick.emit();
  }
}
