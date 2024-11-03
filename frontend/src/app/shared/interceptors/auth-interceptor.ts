import { HttpHandlerFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

export function authInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn) {
  const cookieService = inject(CookieService);
  const authData = cookieService.get('authData');
  console.log('intercept', authData);
  if (authData) {
    const authReq = req.clone({
      headers: req.headers.set('Authorization', `twa-init-data ${authData}`),
    });
    return next(authReq);
  } else {
    return next(req);
  }
}
