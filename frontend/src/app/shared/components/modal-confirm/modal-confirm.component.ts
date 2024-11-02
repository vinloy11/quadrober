import { Component, inject, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'ngbd-modal-confirm',
  standalone: true,
  template: `
		<div class="modal-header">
			<h4 class="modal-title" id="modal-title">{{ title || 'Подтверждение действия' }}</h4>
			<button
				type="button"
				class="btn-close"
				aria-describedby="modal-title"
				(click)="modal.dismiss(false)"
			></button>
		</div>
		<div class="modal-body">
			<p>
				{{ textBody }}
			</p>
		</div>
		<div class="modal-footer">
			<button type="button" class="btn btn-outline-secondary" (click)="modal.dismiss(false)">{{ cancelText || 'Отменить' }}</button>
			<button type="button" class="btn {{ confirmButtonClass || 'btn-primary' }}" (click)="modal.close(true)">{{ confirmText || 'Согласен' }}</button>
		</div>
	`,
})
export class ModalConfirmComponent {
  @Input() title!: string | undefined;
  @Input() textBody!: string | undefined;
  @Input() cancelText!: string | undefined;
  @Input() confirmText!: string | undefined;
  @Input() confirmButtonClass!: string | undefined;

  modal = inject(NgbActiveModal);
}
