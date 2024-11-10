import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { NgbActiveOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Nullable } from '../models/nullable';
import { InputTextComponent } from '../shared/components/input-text/input-text.component';
import { DatePipe, JsonPipe } from '@angular/common';
import { FormControlComponent } from '../shared/components/form-control/form-control.component';
import { dtoToUserForm, SocialMediaLinkForm, UserFormGroup } from './form';
import { SocialMediaLink } from '../models/user/social-media-link';
import { filter, of, Subject, switchMap, takeUntil } from 'rxjs';
import { User } from '../models/user/user';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    InputTextComponent,
    JsonPipe,
    FormControlComponent
  ],
  templateUrl: './user.component.html',
  styleUrl: './user.component.scss',
  providers: [DatePipe]
})
export class UserComponent implements OnDestroy, OnInit {
  protected form: UserFormGroup;
  private readonly unsubscribe$ = new Subject<void>();
  @Input() userDto: Nullable<User> = null;

  constructor(
    private readonly fb: FormBuilder,
    protected readonly offcanvas: NgbActiveOffcanvas,
    private readonly datePipe: DatePipe,
  ) {
    this.form = this.fb.group({
      name: new FormControl<Nullable<string>>(null, Validators.required),
      dateBirthday: new FormControl<Nullable<Date | string>>(null, Validators.required),
      bio: new FormControl<Nullable<string>>(null, Validators.maxLength(500)),
      socialMediaLinks: new FormArray<FormGroup<SocialMediaLinkForm>>([]),
    });
  }

  ngOnInit() {
    dtoToUserForm(this.form, this.userDto, this.datePipe);
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  submit() {
    if (this.form?.invalid) {
      this.form.markAllAsTouched();

      return;
    }
  }
}
