import { FormControl, FormGroup } from '@angular/forms';
import { User } from '../../models/user/user';

export type RegistrationForm = FormGroup<RegistrationFormGroup>;

export interface RegistrationFormGroup {
  name: FormControl<string>;
  dateBirthday: FormControl<string>;
}

export function registrationFormToUserDto(form: RegistrationForm): User {
  const formValue = form.value as Required<typeof form.value>;

  return {
    name: formValue.name,
    dateBirthday: new Date(formValue?.dateBirthday).toJSON(),
  }
}
