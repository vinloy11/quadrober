import { FormControl, FormGroup } from '@angular/forms';
import { Nullable } from '../../models/nullable';
import { MeetingSearchCriteria } from '../../models/meeting/meeting-search-criteria';

export type MeetingFilterForm = FormGroup<MeetingFilterFormGroup>;

export interface MeetingFilterFormGroup {
  pointDate: FormControl<Nullable<Date | string>>;
}

export function filterFormToSearchCritera(form: MeetingFilterForm): MeetingSearchCriteria {
  const formValue = form.value;

  return {
    date: formValue.pointDate ? new Date(formValue?.pointDate).toJSON() : undefined,
  }
}
