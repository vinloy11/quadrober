import { Injectable, signal, WritableSignal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from '../models/user/user';
import { Nullable } from '../models/nullable';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly apiPath = '/api/meetings';
  currentUser: WritableSignal<Nullable<User>> = signal(null);

  constructor(
    private readonly http: HttpClient
  ) { }

  getUser() {
    return this.http.get<User>(this.apiPath).pipe(map(
      response => {
        this.currentUser.set(response);
        return response;
      }
    ));
  }

  createUser(user: User) {
    return this.http.post<User>(this.apiPath, user);
  }

  deleteUser() {
    return this.http.delete<boolean>(this.apiPath);
  }

  updateUser(user: User) {
    return this.http.put<User>(this.apiPath, user);
  }
}
