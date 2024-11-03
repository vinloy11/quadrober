import { Component, inject, TemplateRef } from '@angular/core';
import {
  NgbActiveOffcanvas,
  NgbInputDatepicker,
  NgbOffcanvas,
  OffcanvasDismissReasons
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
  closeResult = '';

  constructor(
    private readonly fb: FormBuilder,
    private readonly mapService: MapService,
  ) {
    this.form = this.fb.group({
      pointDate: new FormControl<Nullable<Date | string>>(null),
    });
  }

  open(content: TemplateRef<any>) {
    this.offcanvasService.open(content, { ariaLabelledBy: 'offcanvas-basic-title' }).result.then(
      (result) => {
        this.closeResult = `Closed with: ${result}`;
      },
      (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      },
    );
  }

  private getDismissReason(reason: any): string {
    switch (reason) {
      case OffcanvasDismissReasons.ESC:
        return 'by pressing ESC';
      case OffcanvasDismissReasons.BACKDROP_CLICK:
        return 'by clicking on the backdrop';
      default:
        return `with: ${reason}`;
    }
  }

  search(offcanvas: NgbActiveOffcanvas) {
    offcanvas.dismiss();
    this.mapService.searchWithCriteria(filterFormToSearchCritera(this.form));
  }
}
