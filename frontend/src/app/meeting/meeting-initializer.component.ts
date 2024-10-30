import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { MeetingComponent } from './meeting.component';
import { MeetingService } from '../services/meeting.service';
import { ActivatedRoute, Router } from '@angular/router';
import { filter, merge, Subject, takeUntil } from 'rxjs';
import { NgbOffcanvas, NgbOffcanvasRef } from '@ng-bootstrap/ng-bootstrap';
import { Nullable } from '../models/nullable';
import { NavigationService } from '../services/navigation.service';

@Component({
  selector: 'app-meeting-initializer',
  standalone: true,
  template: '',
  styles: [':host { display: none; }'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MeetingInitializerComponent implements OnInit, OnDestroy {
  private readonly unsubscribe$ = new Subject<void>();
  private meetingComponentCanvasRef: Nullable<NgbOffcanvasRef> = null;

  constructor(
    private readonly meetingService: MeetingService,
    private readonly ngbOffCanvas: NgbOffcanvas,
    private readonly route: ActivatedRoute,
    private readonly navigationService: NavigationService,
  ) {
  }

  ngOnInit() {
    this.route.paramMap.pipe(
      filter(params => !!params.get('meetingId')),
      takeUntil(this.unsubscribe$),
    ).subscribe((params => {
      const meetingId = params.get('meetingId');
      if (meetingId) {
        this.loadMeeting(meetingId);
      }
    }));
  }

  async loadMeeting(meetingId: string) {
    try {
      const meeting = await this.meetingService.getById({ meetingId: meetingId }).toPromise();

      if (!meeting) return;

      this.meetingComponentCanvasRef = this.ngbOffCanvas.open(MeetingComponent);
      const meetingComponent = this.meetingComponentCanvasRef.componentInstance as MeetingComponent;
      meetingComponent.meeting = meeting;

      merge(
        this.meetingComponentCanvasRef.closed,
        this.meetingComponentCanvasRef.dismissed,
      ).pipe(takeUntil(this.unsubscribe$)).subscribe(() => {
        this.goBackOrHome();
      });
    } catch (e) {
      this.goBackOrHome();
    }

  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();

    this.meetingComponentCanvasRef?.close();
  }

  goBackOrHome(): void {
    this.navigationService.goBack();
  }
}
