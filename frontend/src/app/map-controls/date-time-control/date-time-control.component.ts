import { Component, OnInit, Optional, TemplateRef } from '@angular/core';
import { NgIf } from '@angular/common';
import { MapService, MapState } from '../../services/map.service';
import { FormGroupDirective, ReactiveFormsModule } from '@angular/forms';
import { Nullable } from '../../models/nullable';
import { PointForm } from '../map/map.component';
import { LngLat } from 'ymaps3';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ApproveInfoModalComponent } from '../approve-info-modal/approve-info-modal.component';
import { merge, Subject, take } from 'rxjs';
import { Meeting } from '../../models/meeting/meeting';
import { MeetingService } from '../../services/meeting.service';
import { ToastService } from '../../services/toast.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-date-time-control',
  standalone: true,
  imports: [
    NgIf,
    ReactiveFormsModule,
    RouterLink
  ],
  templateUrl: './date-time-control.component.html',
  styleUrl: './date-time-control.component.scss'
})
export class DateTimeControlComponent implements OnInit {
  protected form: Nullable<PointForm> = null;
  /**
   * Преобразована для корректного min в инпуте
   * 2021-06-07T14:47:57
   * @protected
   */
  protected readonly currentDate = new Date().toISOString().slice(0,new Date().toISOString().lastIndexOf(":"));

  constructor(
    private readonly mapService: MapService,
    private readonly modalService: NgbModal,
    private readonly meetingService: MeetingService,
    private readonly toastService: ToastService,
    @Optional() private readonly formGroupDirective: FormGroupDirective,
  ) {
  }

  ngOnInit() {
    this.form = this.formGroupDirective.control;
  }

  goPrev() {
    this.mapService.setMapState(MapState.FILLING_FORM_ADDRESS);
    if (this.form) {
      this.mapService.addPoint({
        // Ставим точно такую же точку на тех же координатах, только которую можно двигать
        coordinates: this.form.value.address?.point as LngLat,
        draggable: true,
      });
    }
  }

  goNext(successMetingTemplate: TemplateRef<any>) {
    if (!this.form) return;

    const component = this.modalService.open(ApproveInfoModalComponent);
    component.componentInstance.form = this.form;

    merge(
      component.dismissed,
      component.closed
    )
      .pipe(take(1))
      .subscribe((response: boolean) => {
        if (response) {
          const formValue = this.form?.value;
          if (!formValue || !formValue?.pointDateTime || !formValue?.address) return;

          const meeting: Meeting = {
            owner: {
              id: 'string',
              name: 'string',
            },
            followers: [],
            meetingDateTime: new Date(formValue?.pointDateTime).toJSON(),
            address: formValue.address
          }

          this.meetingService.create(meeting).pipe(
            take(1),
          ).subscribe((response) => {
            console.log(response);
            this.form?.reset();
            this.mapService.mapState.set(MapState.INITIAL);

            // TODO Добавить отображение результата
            if (response.meetingId) {
              this.toastService.show({
                text: 'Ваша встреча успешно создана',
                classname: 'bg-success text-light',
                delay: 10000,
              });
            } else if (response.nearMeetings.length) {
              this.toastService.show({
                text: 'Уже есть встречи в это время в этом месте',
                classname: 'bg-danger text-light',
                delay: 10000,
              });
            }
          });
        } else {
          this.mapService.mapState.set(MapState.FILLING_FORM_DATETIME);
        }
      })
  }
}
