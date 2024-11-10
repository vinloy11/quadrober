import { Component, inject, TemplateRef } from '@angular/core';
import {
  NgbActiveOffcanvas,
  NgbInputDatepicker,
  NgbOffcanvas,
} from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormControl, ReactiveFormsModule } from '@angular/forms';
import { Nullable } from '../../models/nullable';
import { filterFormToSearchCritera, MeetingFilterForm } from './form';
import { MapService } from '../../services/map.service';

@Component({
  selector: 'app-meeting-filter',
  standalone: true,
  imports: [
    NgbInputDatepicker,
    ReactiveFormsModule
  ],
  templateUrl: './meeting-filter.component.html',
  styleUrl: './meeting-filter.component.scss',
})
export class MeetingFilterComponent {
  form: MeetingFilterForm;
  private offcanvasService = inject(NgbOffcanvas);

  constructor(
    private readonly fb: FormBuilder,
    private readonly mapService: MapService,
  ) {
    this.form = this.fb.group({
      pointDate: new FormControl<Nullable<Date | string>>(null),
    });
  }

  open(content: TemplateRef<any>) {
    this.offcanvasService.open(content, { ariaLabelledBy: 'offcanvas-basic-title' });
  }

  search(offcanvas: NgbActiveOffcanvas) {
    offcanvas.dismiss();
    this.mapService.searchWithCriteria(filterFormToSearchCritera(this.form));
  }
}
