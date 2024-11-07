import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { RegistrationForm, registrationFormToUserDto } from './form';
import { UserService } from '../../services/user.service';
import { catchError, take } from 'rxjs';
import { httpErrorHandler } from '../../shared/utils/http-error-handler';
import { ToastService } from '../../services/toast.service';
import { NgbActiveOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { FormControlComponent } from '../../shared/components/form-control/form-control.component';

@Component({
  selector: 'app-registration',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    FormControlComponent
  ],
  templateUrl: './registration.component.html',
  styleUrl: './registration.component.scss'
})
export class RegistrationComponent {
  form: RegistrationForm;

  constructor(
    private readonly fb: FormBuilder,
    private readonly userService: UserService,
    private readonly toastService: ToastService,
    private readonly activeCanvas: NgbActiveOffcanvas,
    private readonly router: Router,
  ) {
    this.form = this.fb.group({
      name: new FormControl('', Validators.required),
      dateBirthday: new FormControl('', Validators.required)
    }) as RegistrationForm;
  }


  submit() {
    if (this.form?.invalid) {
      this.form.markAllAsTouched();

      return;
    }

    this.userService.createUser(registrationFormToUserDto(this.form))
      .pipe(
        take(1),
        catchError(error => {
          this.toastService.show({
            text: 'Что-то пошло не так, попробуйте еще раз',
            classname: 'bg-danger text-light',
            delay: 3000,
          });
          return httpErrorHandler(error);
        }),
      )
      .subscribe(user => {
        this.activeCanvas.close();
        this.router.navigate(['/']);
      })
  }
}
