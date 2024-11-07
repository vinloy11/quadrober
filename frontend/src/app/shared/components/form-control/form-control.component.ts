import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, FormGroupDirective } from '@angular/forms';
import { Nullable } from '../../../models/nullable';

@Component({
  selector: 'app-form-control',
  standalone: true,
  imports: [],
  template: `
    <ng-content/>
    @if (formControl && (formControl.dirty || !formControl.untouched) && formControl.errors?.['required']) {
      <span class="validation-message text-danger">Поле обязательно для заполнения</span>
    }
  `,
  styles: [':host { width: 100%; }; .validation-message { font-size: 12px }'],
})
export class FormControlComponent implements OnInit {
  @Input() appFormControlName!: string;

  protected formControl: Nullable<AbstractControl<any>> = null;

  constructor(
    private readonly formGroupDirective: FormGroupDirective
  ) {}

  ngOnInit() {
    if (this.formGroupDirective && this.appFormControlName) {
      this.formControl = this.formGroupDirective.form.controls[this.appFormControlName];
    }
  }

}
