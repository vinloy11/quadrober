import { Component, OnInit} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NgIf } from '@angular/common';
import { AddPointButtonComponent } from './map-controls/add-point-button/add-point-button.component';
import { MapComponent } from './map-controls/map/map.component';
import { AuthService } from './services/auth.service';
import { CookieService } from 'ngx-cookie-service';
import { take } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NgIf, AddPointButtonComponent, MapComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  webApp = window.Telegram.WebApp;
  user: any = {};
  error = '';

  constructor(
    private readonly authService: AuthService,
    // private readonly router: Router,
    private readonly cookieService: CookieService,
  ) {
    const params = new URLSearchParams(window.location.hash.slice(1));
    const initDataString = params.get('tgWebAppData');
    const initData = new URLSearchParams(initDataString as any);
    const user = initData.get('user') || this.cookieService.get('user');
    const hash = initData.get('hash');

    if (hash) {
      initDataString && this.cookieService.set('authData', initDataString);
      const userData = initData.get('user');
      if (userData) {
        this.cookieService.set('user', userData)
      }
    }

    if (user) {
      this.user = JSON.parse(user);
    }

    // this.authService.authorize()
    //   .pipe(take(1))
    //   .subscribe(
    //     response => {
    //       // this.store.dispatch(setUserInfo({ user: response }));
    //     },
    //     error => {
    //       this.error = error.error.reason
    //     },
    //   );

    this.webApp.expand();
  }

  ngOnInit() {
  }
}
