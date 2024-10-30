import { Component, inject, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { PointForm } from '../map/map.component';
import { Nullable } from '../../models/nullable';
import { DatePipe, NgIf } from '@angular/common';
import { DATE_TIME } from '../../shared/date-format';

@Component({
  selector: 'ngbd-modal-confirm',
  standalone: true,
  template: `
    <div class="modal-header">
      <h4 class="modal-title" id="modal-title">{{ isEditable ? 'Подтверждение изменения встречи' : 'Подтверждение встречи' }}</h4>
      <button
        type="button"
        class="btn-close"
        aria-describedby="modal-title"
        (click)="modal.dismiss(false)"
      ></button>
    </div>
    <div class="modal-body" *ngIf="form?.value as formValue">
      <div>
        <div class="text-muted">Место встречи</div>
        <strong>{{ formValue.address?.description }} {{ formValue.address?.name }}</strong>
      </div>
      <div class="mt-2">
        <div class="text-muted">Время встречи</div>
        <strong>{{ formValue.pointDateTime | date : DATE_TIME }}</strong>
      </div>
    </div>
    <div class="modal-footer">
      <button type="button" class="btn btn-outline-secondary" (click)="modal.dismiss(false)">Отмена</button>
      <button type="button" class="btn btn-primary" (click)="modal.close(true)">{{ isEditable ? 'Изменить встречу' : 'Запланировать встречу' }}</button>
    </div>
  `,
  imports: [
    NgIf,
    DatePipe
  ]
})
export class ApproveInfoModalComponent {
  @Input() form: Nullable<PointForm> = null;
  @Input() isEditable = false;

  modal = inject(NgbActiveModal);
  protected readonly DATE_TIME = DATE_TIME;
}
