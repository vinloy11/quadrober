import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { MeetingComponent } from './meeting.component';
import { MeetingService } from '../services/meeting.service';
import { ActivatedRoute, Router } from '@angular/router';
import { filter, merge, Subject, takeUntil } from 'rxjs';
import { NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-meeting-initializer',
  standalone: true,
  template: '',
  styles: [':host { display: none; }'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MeetingInitializerComponent implements OnInit, OnDestroy {
  private readonly unsubscribe$ = new Subject<void>();

  constructor(
    private readonly meetingService: MeetingService,
    private readonly ngbOffCanvas: NgbOffcanvas,
    private route: ActivatedRoute,
    private router: Router,
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

      const meetingComponentCanvasRef = this.ngbOffCanvas.open(MeetingComponent);
      const meetingComponent = meetingComponentCanvasRef.componentInstance as MeetingComponent;
      meetingComponent.meeting = meeting;

      merge(
        meetingComponentCanvasRef.closed,
        meetingComponentCanvasRef.dismissed,
      ).pipe(takeUntil(this.unsubscribe$)).subscribe(() => {
        this.router.navigate(['/']);
      });
    } catch (e) {
      this.router.navigate(['/']);
    }

  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
