import { Component, OnInit} from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { NgIf } from '@angular/common';
import { AddPointButtonComponent } from './map-controls/add-point-button/add-point-button.component';
import { MapComponent } from './map-controls/map/map.component';
import { CookieService } from 'ngx-cookie-service';
import { catchError, take } from 'rxjs';
import { UserService } from './services/user.service';
import { httpErrorHandler } from './shared/utils/http-error-handler';
import { HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { ToastService } from './services/toast.service';

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
    private readonly router: Router,
    private readonly userService: UserService,
    private readonly cookieService: CookieService,
    private readonly toastService: ToastService,
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

    this.userService.getUser()
      .pipe(
        take(1),
        catchError((error: HttpErrorResponse) => {
          switch (error.status) {
            case HttpStatusCode.NotFound:
              this.router.navigate(['/registration']);
              break;
            case HttpStatusCode.Unauthorized:
              this.router.navigate(['/public']);
              break;
            default:
              this.toastService.show({
                text: 'Что-то пошло не так, попробуйте перезайти в приложение',
                classname: 'bg-danger text-light',
                delay: 5000,
              });
          }

          return httpErrorHandler(error);
        }),
      )
      .subscribe(
        response => {
          console.log('Пользователь авторизован и зарегистрирован', response)
          // this.store.dispatch(setUserInfo({ user: response }));
        },
      );

    this.webApp.expand();
  }

  ngOnInit() {
  }
}
