import { Component, Input } from '@angular/core';
import { Meeting } from '../models/meeting/meeting';
import { Nullable } from '../models/nullable';
import { JsonPipe } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-meeting',
  standalone: true,
  imports: [
    JsonPipe,
    RouterLink
  ],
  templateUrl: './meeting.component.html',
  styleUrl: './meeting.component.scss'
})
export class MeetingComponent {
  @Input() meeting: Nullable<Meeting> = null;
}
