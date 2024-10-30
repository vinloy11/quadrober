import { Injectable } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NavigationService {
  private previousUrls: string[] = [];

  constructor(private router: Router) {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        // Добавляем текущий URL в массив предыдущих URL
        this.previousUrls.push(event.url);
      });
  }

  getPreviousUrls(): string[] {
    return this.previousUrls;
  }

  goBack() {
    // Удаляем последний URL из массива и возвращаем его
    this.previousUrls.pop();
    const previousUrl = this.previousUrls.pop() || null;

    if (previousUrl) {
      // Если есть предыдущий URL, возвращаемся на него
      this.router.navigateByUrl(previousUrl);
    } else {
      // Если нет, перенаправляем на главную страницу
      this.router.navigate(['/']);
    }
  }
}
