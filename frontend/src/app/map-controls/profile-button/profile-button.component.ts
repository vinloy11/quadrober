import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-profile-button',
  standalone: true,
  imports: [
    RouterLink
  ],
  templateUrl: './profile-button.component.html',
  styleUrl: './profile-button.component.scss'
})
export class ProfileButtonComponent {
  constructor(
    protected readonly userService: UserService,
  ) {
  }
}
