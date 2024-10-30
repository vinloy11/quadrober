import { Component, Input } from '@angular/core';
import { Meeting } from '../models/meeting/meeting';
import { Nullable } from '../models/nullable';
import { DatePipe, JsonPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { NavigationService } from '../services/navigation.service';

@Component({
  selector: 'app-meeting',
  standalone: true,
  imports: [
    JsonPipe,
    RouterLink,
    DatePipe
  ],
  templateUrl: './meeting.component.html',
  styleUrl: './meeting.component.scss'
})
export class MeetingComponent {
  @Input() meeting: Nullable<Meeting> = null;

  constructor(
    private readonly navigationService: NavigationService,
  ) {
  }

  goBack() {
    this.navigationService.goBack();
  }
}
