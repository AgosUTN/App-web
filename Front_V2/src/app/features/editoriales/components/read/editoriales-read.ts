import { Component } from '@angular/core';
import { EditorialCount } from '../../models/editorialCount.model';
import { EditorialService } from '../../services/editorial-service';
import { MatTableModule } from '@angular/material/table';
import {MatPaginatorModule} from '@angular/material/paginator';
@Component({
  selector: 'app-editoriales-read',
  imports: [MatTableModule,MatPaginatorModule],
  templateUrl: './editoriales-read.html',
  styleUrl: './editoriales-read.scss',
})
export class EditorialesRead {
  editoriales: EditorialCount[] = [
    { id: 1, nombre: 'Planeta', cantLibros: 120 },
    { id: 2, nombre: 'Sudamericana', cantLibros: 85 },
    { id: 3, nombre: 'Alfaguara', cantLibros: 64 },
    { id: 4, nombre: 'Anagrama', cantLibros: 47 },
    { id: 5, nombre: 'Seix Barral', cantLibros: 92 },
    { id: 6, nombre: 'Siglo XXI', cantLibros: 38 },
    { id: 7, nombre: 'Paidós', cantLibros: 73 },
    { id: 8, nombre: 'Ariel', cantLibros: 55 },
    { id: 9, nombre: 'Eudeba', cantLibros: 29 },
    { id: 10, nombre: 'Tusquets', cantLibros: 66 },
    { id: 11, nombre: 'Emecé', cantLibros: 41 },
    { id: 12, nombre: 'Océano', cantLibros: 34 },
    { id: 13, nombre: 'Norma', cantLibros: 58 },
    { id: 14, nombre: 'Salamandra', cantLibros: 77 },
    { id: 15, nombre: 'Debate', cantLibros: 49 },
  ];
  dataSource: EditorialCount[] = [];
  displayedColumns: string[] = ['id', 'nombre', 'cantLibros'];

  constructor(private editorialService: EditorialService) {}

  ngOnInit(): void {
    this.dataSource = this.editoriales;
  }
}
