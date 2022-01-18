import {Injectable} from '@angular/core';
import {HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpResponse} from '@angular/common/http';
import {BehaviorSubject, Observable, throwError} from 'rxjs';
import {catchError, switchMap, filter, take, tap, map} from 'rxjs/operators';
import {Router} from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import {AuthApi} from '../api/auth.api';
import {of} from 'rxjs';
// import {AppSettings} from '../app-settings';
import {CookieService} from "ngx-cookie-service";


@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private refreshTokenInProgress = false;
  // Refresh Token Subject tracks the current token, or is null if no token is currently
  // available (e.g. refresh pending).
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(
    null
  );

  constructor(
    private router: Router,
    public snackBar: MatSnackBar,
    private cookieService: CookieService,
    // private openDialogService: OpenDialogService,
    private authApi: AuthApi) {
  }

  private addAuthHeader(request: HttpRequest<any>) {
    if((request.urlWithParams.toLowerCase().startsWith('http://localhost:9092/auth/local-login'))) {
      return request.clone();
    } else if((request.urlWithParams.toLowerCase().startsWith('http://localhost:9092/auth/refresh-token'))) {
      const headersObj = request.headers.keys().map((key) => {
        const info = {
          key,
          value: request.headers.get(key)

        }
        return info;
      });

      const result = headersObj.find(p => p.value === 'application/octet-stream');

      const refreshToken = this.cookieService.get('refresh_token');

      if (result) {

        return request.clone({
          setHeaders: {
            Authorization: `Bearer ${refreshToken}`
          },
          responseType: 'blob'
        });
      } else {
        return request.clone({
          setHeaders: {
            Authorization: `Bearer ${refreshToken}`
          }
        });
      }
    } else {
      const headersObj = request.headers.keys().map((key) => {
        const info = {
          key,
          value: request.headers.get(key)

        }
        return info;
      });

      const result = headersObj.find(p => p.value === 'application/octet-stream');

      const accessToken = this.cookieService.get('access_token');

      if (result) {

        return request.clone({
          setHeaders: {
            Authorization: `Bearer ${accessToken}`
          },
          responseType: 'blob'
        });
      } else {
        return request.clone({
          setHeaders: {
            Authorization: `Bearer ${accessToken}`
          }
        });
      }
    }
  }

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler,
  ): Observable<HttpEvent<any>> {
    request = this.addAuthHeader(request);

    return this.sendRequest(request, next);
  }

  sendRequest(
    request: HttpRequest<any>,
    next: HttpHandler): Observable<HttpEvent<any>> {
    const apiRoot = 'http://localhost:9092/';

    return next.handle(request).pipe(
      map(((event: HttpEvent<any>) => {
        if (event instanceof HttpResponse) {
          if (
            (request.urlWithParams.toLowerCase().startsWith(apiRoot + 'auth/local-login')) ||
            (request.urlWithParams.toLowerCase().startsWith(apiRoot + 'auth/refresh-token'))

          ) {
            this.cookieService.set('access_token', event.body.accessToken, { path: '/', sameSite: 'Strict' });
            this.cookieService.set('refresh_token', event.body.refreshToken, { path: '/', sameSite: 'Strict' });
            event = event.clone({body: {}});
          }
        }

        return event;
      })),
      catchError(error => {
        if (
          (request.urlWithParams.toLowerCase().startsWith(apiRoot + 'auth/local-login')) ||
          (request.urlWithParams.toLowerCase().startsWith(apiRoot + 'auth/refresh-token'))
        ) {
          return throwError(error);
        }

        if (error.status !== 401) {
          return throwError(error);
        }

        if (this.refreshTokenInProgress) {
          return this.refreshTokenSubject
            .pipe(filter(result => result !== null))
            .pipe(take(1))
            .pipe(switchMap(() => next.handle(this.addAuthHeader(request))));
        } else {
          this.refreshTokenInProgress = true;

          this.refreshTokenSubject.next(null);

          return this.authApi
            .refreshToken()
            .pipe(switchMap((token: any) => {
              // this.authorizationService.storeToken(token, false);
              this.refreshTokenInProgress = false;
              this.refreshTokenSubject.next(token);

              return next.handle(this.addAuthHeader(request));
            }))
            .pipe(catchError((err: any) => {
              const url = this.router.url;
              //this.notificationService.showError('The Token has expired, or your Session has been terminated!');
              // this.openDialogService.closeAll();
              this.cookieService.delete('access_token', '/');
              this.cookieService.delete('refresh_token', '/');
              this.router.navigate(['/login'], {queryParams: {returnUrl: url}}).then(() => {
              });
              this.refreshTokenInProgress = false;
              return throwError(err);
            }));
        }
      }));
  }
}
