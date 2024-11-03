import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from '../models/user/user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private path = 'api/user';

  constructor(
    private readonly http: HttpClient,
  ) { }

  authorize() {
    return this.http.get<User>(`${this.path}/authorize`, {
      observe: 'body',
      responseType: 'json',
    },);
  }
}
