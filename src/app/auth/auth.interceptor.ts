import {
    HttpEvent,
  } from '@angular/common/http';
  import { Injectable } from '@angular/core';
  import {
    HttpInterceptor,
    HttpHandler,
    HttpRequest,
  } from '@angular/common/http';
  import { Observable, throwError } from 'rxjs';
  import { catchError } from 'rxjs/operators';
  import { ToastrService } from 'ngx-toastr';
  import { TokenService } from '../_services/token.service';
  
  @Injectable()
  export class AuthInterceptor implements HttpInterceptor {
    constructor(
      private tokenService: TokenService,
      private toastService: ToastrService,
    ) { }
  
    intercept(
      req: HttpRequest<any>,
      next: HttpHandler
    ): Observable<HttpEvent<Object>> {
      const token = this.tokenService.getAccessToken();
  
      if (token) {
        // req = req.clone({
        //   headers: req.headers.set('Authorization', 'Bearer ' + token),
        // });

        req = req.clone({
          headers: req.headers.set('Authorization', `Bearer ${token}`),
        });
      }
  
      return next.handle(req).pipe(
        catchError((res) => {
          if (res.status === 403 && res.error.error === 'Forbidden') {
            // should redirect to /403 page
            // this.toastService.error('Forbidden');
            this.toastService.error('Bạn cần đăng nhập');
          }
  
          return throwError(res);
        })
      );
    }
  }