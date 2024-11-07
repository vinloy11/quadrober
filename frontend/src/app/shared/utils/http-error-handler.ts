import { EMPTY } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

export function httpErrorHandler(error: HttpErrorResponse | any) {
  console.error(error);

  return EMPTY;
}
