import { Component, forwardRef, Input, OnInit } from '@angular/core';
import { Nullable } from '../../../models/nullable';
import {
  AbstractControl,
  ControlValueAccessor, FormControl,
  FormGroupDirective,
  FormsModule,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule
} from '@angular/forms';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-input-text',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    NgIf
  ],
  templateUrl: './input-text.component.html',
  styleUrl: './input-text.component.scss',
})
export class InputTextComponent implements OnInit {
  @Input() placeholder: Nullable<string> = null;
  @Input() className: Nullable<string> = null;
  @Input() readonly = false;
  @Input() appFormControlName: Nullable<string> = null;

  protected appFormControl: Nullable<FormControl<string>> = null;

  constructor(
    private formGroupDirective: FormGroupDirective
  ) {
  }

  ngOnInit() {
    if (this.formGroupDirective && this.appFormControlName) {
      this.appFormControl = this.formGroupDirective.form.controls?.[this.appFormControlName] as FormControl<string>;
    }
  }
}
