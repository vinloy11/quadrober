import { Routes } from '@angular/router';
import { MeetingInitializerComponent } from './meeting/meeting-initializer.component';

export const routes: Routes = [
  { path: 'meetings/:meetingId', component: MeetingInitializerComponent },
  { path: '**', redirectTo: '' }
];
