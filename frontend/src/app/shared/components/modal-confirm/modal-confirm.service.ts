import { Injectable, Input } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalConfirmComponent } from './modal-confirm.component';
import { race } from 'rxjs';

@Injectable({
  providedIn: 'root',

})
export class ModalConfirmService {
  constructor(
    private readonly modalService: NgbModal,
  ) {
  }

  open({title, textBody, cancelText, confirmText, confirmButtonClass}: {
    title?: string;
    textBody?: string;
    cancelText?: string;
    confirmText?: string;
    confirmButtonClass?: string;
  }) {
    const modal = this.modalService.open(ModalConfirmComponent);
    const component = modal.componentInstance as ModalConfirmComponent;
    component.title = title;
    component.textBody = textBody;
    component.cancelText = cancelText;
    component.confirmText = confirmText;
    component.confirmButtonClass = confirmButtonClass;

    return race(
      modal.closed,
      modal.dismissed
    );
  }
}
