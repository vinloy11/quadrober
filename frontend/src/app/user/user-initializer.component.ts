import { ChangeDetectionStrategy, Component, OnDestroy } from '@angular/core';
import { NgbOffcanvas, NgbOffcanvasRef } from '@ng-bootstrap/ng-bootstrap';
import { UserComponent } from './user.component';
import { filter, of, race, Subject, switchMap, takeUntil } from 'rxjs';
import { Nullable } from '../models/nullable';
import { ActivatedRoute, Router } from '@angular/router';
import { NavigationService } from '../services/navigation.service';
import { UserService } from '../services/user.service';
import { User } from '../models/user/user';

@Component({
  selector: 'app-user-initializer',
  standalone: true,
  template: '',
  styles: [':host { display: none; }'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserInitializerComponent implements OnDestroy {
  private userComponentCanvasRef: Nullable<NgbOffcanvasRef> = null;
  private unsubscribe$: Subject<void> = new Subject();

  constructor(
    private readonly ngbOffCanvas: NgbOffcanvas,
    private readonly router: Router,
    private readonly navigationService: NavigationService,
    private readonly route: ActivatedRoute,
    private readonly userService: UserService,
  ) {
    this.openUserProfile();
  }

  openUserProfile() {
    this.route.paramMap.pipe(
      filter(params => !!params.get('userId')),
      takeUntil(this.unsubscribe$),
      switchMap(params => {
        const userId = params.get('userId');

        if (!userId) return of(null);

        if (this.userService.currentUser()?.id !== userId.trim()) {
          return this.userService.getUserById({ userId })
        } else {
          return of(this.userService.currentUser())
        }
      }),
    ).subscribe((user => {
      this.initUserComponent(user);
    }));
  }

  initUserComponent(user: Nullable<User>) {
    this.userComponentCanvasRef = this.ngbOffCanvas.open(UserComponent);
    const userComponent = this.userComponentCanvasRef.componentInstance as UserComponent;
    userComponent.userDto = user;

    race(
      this.userComponentCanvasRef.closed,
      this.userComponentCanvasRef.dismissed,
    ).pipe(takeUntil(this.unsubscribe$)).subscribe((isEdit) => {
      if (isEdit) {
        this.router.navigate(['/']);
      } else {
        this.navigationService.goBack();
      }
    });
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
