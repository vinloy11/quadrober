import { Component, OnInit, Optional, TemplateRef } from '@angular/core';
import { NgIf } from '@angular/common';
import { MapService, MapState } from '../../services/map.service';
import { FormGroupDirective, ReactiveFormsModule } from '@angular/forms';
import { Nullable } from '../../models/nullable';
import { PointForm } from '../map/map.component';
import { LngLat } from 'ymaps3';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ApproveInfoModalComponent } from '../approve-info-modal/approve-info-modal.component';
import { catchError, EMPTY, merge, take } from 'rxjs';
import { Meeting } from '../../models/meeting/meeting';
import { MeetingService } from '../../services/meeting.service';
import { ToastService } from '../../services/toast.service';
import { Router, RouterLink } from '@angular/router';
import { UserService } from '../../services/user.service';
import { httpErrorHandler } from '../../shared/utils/http-error-handler';

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
    private readonly router: Router,
    private readonly userService: UserService,
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
        isEditableMeetingPoint: true,
      });
    }
  }

  goNext() {
    if (!this.form) return;

    const component = this.modalService.open(ApproveInfoModalComponent);
    const componentInstance = component.componentInstance as ApproveInfoModalComponent;
    const isEditable = !!this.mapService.editableMeeting();
    componentInstance.form = this.form;
    componentInstance.isEditable = isEditable;

    merge(
      component.dismissed,
      component.closed
    )
      .pipe(take(1))
      .subscribe((response: boolean) => {
        if (response) {
          const formValue = this.form?.value;
          if (!formValue || !formValue?.pointDateTime || !formValue?.address) return;

          if (isEditable) {
            const editableMeeting = this.mapService.editableMeeting();
            if (editableMeeting) {
              this.updateMeeting({
                ...editableMeeting,
                meetingDateTime: new Date(formValue?.pointDateTime).toJSON(),
                address: formValue.address,
              });
            }
          } else {
            const currentUser = this.userService.currentUser();
            if (!currentUser) return;

            const meeting: Meeting = {
              owner: currentUser,
              followers: [],
              meetingDateTime: new Date(formValue?.pointDateTime).toJSON(),
              address: formValue.address
            }

            this.createMeeting(meeting);
          }
        } else {
          this.mapService.mapState.set(MapState.FILLING_FORM_DATETIME);
        }
      })
  }

  updateMeeting(meeting: Meeting) {
    this.meetingService.update(meeting).pipe(
      take(1),
      catchError(err => {
        this.toastService.show({
          text: err?.error?.title || 'Произошла ошибка во время обновления. Попробуйте еще раз',
          classname: 'bg-danger text-light',
          delay: 5000,
        });
        return httpErrorHandler(err);
      }),
    ).subscribe(
      (response) => {
        this.form?.reset();
        this.mapService.mapState.set(MapState.INITIAL);

        if (response.id) {
          this.router.navigate(['/meetings/', response.id]);
          this.addPoint(meeting);

          this.toastService.show({
            text: 'Ваша встреча успешно обновлена',
            classname: 'bg-success text-light',
            delay: 10000,
          });
        }
      },
    );
  }

  createMeeting(meeting: Meeting) {
    this.meetingService.create(meeting).pipe(
      take(1),
      catchError(err => {
        this.toastService.show({
          text: err?.error?.title || 'Произошла ошибка во время создания. Попробуйте еще раз',
          classname: 'bg-danger text-light',
          delay: 5000,
        });

        return httpErrorHandler(err);
      }),
    ).subscribe((response) => {
      this.form?.reset();
      this.mapService.mapState.set(MapState.INITIAL);

      if (response.meetingId) {
        this.router.navigate(['/meetings/', response.meetingId]);
        this.addPoint(meeting);

        this.toastService.show({
          text: 'Ваша встреча успешно создана',
          classname: 'bg-success text-light',
          delay: 10000,
        });
        // TODO Отображать список ближайших встреч
      } else if (response.nearMeetings.length) {
        this.toastService.show({
          text: 'Уже есть встречи в это время в этом месте',
          classname: 'bg-danger text-light',
          delay: 10000,
        });
      }
    },);
  }

  private addPoint(meeting: Meeting) {
    this.mapService.addPoint({
      isEditableMeetingPoint: true,
      pointId: meeting.id,
      coordinates: [meeting.address.point[0], meeting.address.point[1]],
      draggable: false,
      hasTitle: false,
      hasSubtitle: false,
    })
  }
}
