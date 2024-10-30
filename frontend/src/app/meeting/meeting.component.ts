import { Component, Input } from '@angular/core';
import { Meeting } from '../models/meeting/meeting';
import { Nullable } from '../models/nullable';
import { DatePipe, JsonPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { NavigationService } from '../services/navigation.service';
import { MapService, MapState } from '../services/map.service';
import { NgbActiveOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import { DATE_TIME } from '../shared/date-format';

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
export class MeetingComponent {
  @Input() meeting: Nullable<Meeting> = null;

  constructor(
    private readonly navigationService: NavigationService,
    private readonly mapService: MapService,
    private readonly activeCanvas: NgbActiveOffcanvas,
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
}
