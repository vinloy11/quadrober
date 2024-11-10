import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { Nullable } from 'ymaps3';
import { User } from '../models/user/user';
import { SocialMediaLink } from '../models/user/social-media-link';
import { DatePipe } from '@angular/common';
import { DATE_LOCAL, DATE_TIME_LOCAL } from '../shared/date-format';

export type UserFormGroup = FormGroup<UserForm>;

export interface UserForm {
  name: FormControl<Nullable<string>>;
  dateBirthday: FormControl<Nullable<Date | string>>;
  bio: FormControl<Nullable<string>>;
  socialMediaLinks: FormArray<FormGroup<SocialMediaLinkForm>>;
}

export interface SocialMediaLinkForm {
  url: FormControl<Nullable<string>>;
  name: FormControl<Nullable<string>>;
}

export function dtoToUserForm(form: UserFormGroup, dto: Nullable<User>, datePipe: DatePipe) {
  if (!dto) return;

  form.patchValue({
    ...form.value,
    name: dto.name,
    dateBirthday: datePipe.transform(dto.dateBirthday, DATE_LOCAL),
    bio: dto.bio,
  })

  if (dto.socialMediaLinks?.length) {
    form.controls.socialMediaLinks = new FormArray(dto.socialMediaLinks.map(link => {
      return new FormGroup({
        url: new FormControl(link.url),
        name: new FormControl(link.name)
      })
    }))
  }
}

export function userFormToDto(form: UserFormGroup, dto: User): Partial<User> {
  const formValue = form.value;

  return {
    ...dto,
    name: formValue.name || undefined,
    dateBirthday: formValue.dateBirthday ? new Date(formValue?.dateBirthday).toJSON() : undefined,
    bio: formValue.bio || undefined,
    socialMediaLinks: formValue.socialMediaLinks as SocialMediaLink[],
  }
}
