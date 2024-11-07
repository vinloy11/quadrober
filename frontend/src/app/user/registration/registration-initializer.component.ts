import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import { RegistrationComponent } from './registration.component';

@Component({
  selector: 'app-user-initializer',
  standalone: true,
  template: '',
  styles: [':host { display: none; }'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegistrationInitializerComponent {
  constructor(
    private readonly ngbOffCanvas: NgbOffcanvas,
  ) {
    this.openRegistrationForm();
  }

  openRegistrationForm() {
    this.ngbOffCanvas.open(RegistrationComponent);
  }
}
