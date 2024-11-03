import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';

@Injectable()
export class HttpInterceptorService implements HttpInterceptor {

  constructor(
    private readonly cookieService: CookieService,
  ) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const authData = this.cookieService.get('authData');
    console.log('intercept', authData);
    if (authData) {
      const authReq = req.clone({
        headers: req.headers.set('Authorization', `twa-init-data ${authData}`),
      });
      return next.handle(authReq);
    } else {
      return next.handle(req);
    }
  }
}
