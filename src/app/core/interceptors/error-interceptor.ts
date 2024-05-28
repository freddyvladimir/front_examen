import { Injectable, Input } from '@angular/core';
import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { LoginService } from '../authentication/login.service';

export enum STATUS {
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  INTERNAL_SERVER_ERROR = 500,
}

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  private errorPages = [STATUS.FORBIDDEN, STATUS.NOT_FOUND, STATUS.INTERNAL_SERVER_ERROR];

  private getMessage = (error: HttpErrorResponse) => {
    if (error.error?.message) {
      return error.error.message;
    }

    if (error.error?.msg) {
      return error.error.msg;
    }

    return `${error.status} ${error.statusText}`;
  };

  constructor(private router: Router, private toast: ToastrService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next
      .handle(request)
      .pipe(catchError((error: HttpErrorResponse) => this.handleError(error)));
  }

  private handleError(error: HttpErrorResponse) {
    if (this.errorPages.includes(error.status)) {
      this.toast.error('Tenemos un problema interno, intente actualizar.','¡Error en el servidor!', {
        timeOut: 3000,
        progressBar: true,
        closeButton: true,
        newestOnTop: false,
        extendedTimeOut: 0,
        tapToDismiss: false
      });
      /*this.router.navigateByUrl(`/${error.status}`, {
        skipLocationChange: true,
      });*/
    } else {
      console.error(STATUS.UNAUTHORIZED,'ERROR', error);
      //this.toast.error(this.getMessage(error));
      if (error.status === STATUS.UNAUTHORIZED) {
        this.router.navigateByUrl('/auth/login');
      }
    }

    return throwError(error);
  }
}
