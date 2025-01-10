import { Component, Input, TemplateRef, ViewChild } from '@angular/core';

import {
  NgbDatepickerModule,
  NgbModal,
  NgbModalRef,
} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-modal-error',
  standalone: true,
  imports: [NgbDatepickerModule],
  templateUrl: './modal-error.component.html',
  styleUrl: './modal-error.component.css',
})
export class ModalErrorComponent {
  @ViewChild('content') content!: TemplateRef<any>;

  private modalRef?: NgbModalRef; // Referencia al modal abierto

  @Input() title: string = '';

  constructor(private modalService: NgbModal) {}

  open() {
    this.modalRef = this.modalService.open(this.content);
  }

  closeModal() {
    if (this.modalRef) {
      this.modalRef.close();
    }
  }
}
