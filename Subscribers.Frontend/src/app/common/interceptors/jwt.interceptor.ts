import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthenticationService } from '../../services/authentication.service';
import { RefreshTokenHeader } from '../constants';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {

  constructor(private authenticationService: AuthenticationService) {
  }

  public intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const isRefreshToken = !!request.headers.get(RefreshTokenHeader.key);
    let currentUser = this.authenticationService.currentUser;

    if (currentUser && currentUser.accessToken) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${ isRefreshToken ? currentUser.refreshToken : currentUser.accessToken }`
        }
      });
    }

    return next.handle(request);
  }
}
