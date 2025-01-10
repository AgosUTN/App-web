import {
  Component,
  EventEmitter,
  inject,
  Input,
  Output,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-modal-delete',
  standalone: true,
  imports: [],
  templateUrl: './modal-delete.component.html',
  styleUrl: './modal-delete.component.css',
})
export class ModalDeleteComponent {
  @ViewChild('content') content!: TemplateRef<any>;
  private modalRef?: NgbModalRef;
  constructor(private modalService: NgbModal) {}
  @Input() crud: string = '';
  @Input() messageConfirmation: string = '';
  nombre: string = '';
  @Output() confirmacionEvento: EventEmitter<boolean> =
    new EventEmitter<boolean>();
  open(nombre: string) {
    this.nombre = nombre;
    this.modalRef = this.modalService.open(this.content);
  }

  // Recordar que el true lo recibis como parámetro al hacer click en borrar.
  closeModal(confirmacion: boolean = false) {
    if (this.modalRef) {
      this.modalRef.close();
    }
    this.confirmacionEvento.emit(confirmacion);
  }
}
