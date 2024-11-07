import { Routes } from '@angular/router';
import { MeetingInitializerComponent } from './meeting/meeting-initializer.component';
import { PublicComponent } from './public/public/public.component';
import { RegistrationInitializerComponent } from './user/registration/registration-initializer.component';

export const routes: Routes = [
  { path: 'meetings/:meetingId', component: MeetingInitializerComponent },
  { path: 'registration', component: RegistrationInitializerComponent },
  { path: 'public', loadComponent: () => import('./public/public/public.component').then(m => m.PublicComponent) },
  { path: '**', redirectTo: '' }
];
