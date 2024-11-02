import { Component, Input, OnDestroy } from '@angular/core';
import { Meeting } from '../models/meeting/meeting';
import { Nullable } from '../models/nullable';
import { DatePipe, JsonPipe } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { NavigationService } from '../services/navigation.service';
import { MapService, MapState } from '../services/map.service';
import { NgbActiveOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import { DATE_TIME } from '../shared/date-format';
import { MeetingService } from '../services/meeting.service';
import { ModalConfirmService } from '../shared/components/modal-confirm/modal-confirm.service';
import { filter, of, Subject, switchMap, take, takeUntil } from 'rxjs';
import { ToastService } from '../services/toast.service';

@Component({
  selector: 'app-meeting',
  standalone: true,
  imports: [
    JsonPipe,
    RouterLink,
    DatePipe,
  ],
  templateUrl: './meeting.component.html',
  styleUrl: './meeting.component.scss'
})
export class MeetingComponent implements OnDestroy {
  @Input() meeting: Nullable<Meeting> = null;

  private unsubscribe$ = new Subject<void>();

  constructor(
    private readonly navigationService: NavigationService,
    private readonly mapService: MapService,
    private readonly activeCanvas: NgbActiveOffcanvas,
    private readonly meetingService: MeetingService,
    private readonly modalConfirmService: ModalConfirmService,
    private readonly router: Router,
    private readonly toastService: ToastService,
  ) {
  }

  goBack() {
    this.navigationService.goBack();
  }

  edit() {
    this.activeCanvas.dismiss();
    this.mapService.editableMeeting.set(this.meeting);
    this.mapService.setMapState(MapState.FILLING_FORM_ADDRESS);
  }

  protected readonly DATE_TIME = DATE_TIME;

  delete() {
    this.modalConfirmService.open({
      title: 'Отмена встречи',
      textBody: 'Вы действительно хотите отменить встречу',
      cancelText: 'Я передумал',
      confirmText: 'Отменить встречу',
      confirmButtonClass: 'btn-danger',
    }).pipe(
      take(1),
      takeUntil(this.unsubscribe$),
      filter(approve => !!approve),
      switchMap(() => {
        if (this.meeting?.id) {
          return this.meetingService.delete(this.meeting.id);
        }

        return of(false);
      }),
    ).subscribe(
      (deleted: boolean) => {
        if (!deleted) return;

        this.router.navigate(['/']);
        this.mapService.removeMeetingPointById(this.meeting?.id);
        this.toastService.show({
          text: 'Встреча успешно отменена',
          classname: 'bg-success text-light',
          delay: 3000,
        });
      },
    );
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
