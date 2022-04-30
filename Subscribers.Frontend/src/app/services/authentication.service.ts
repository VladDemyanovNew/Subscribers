import { Injectable, OnInit } from '@angular/core';
import { BehaviorSubject, Observable, of, single } from 'rxjs';
import { User } from './models/user';
import { CurrentUser } from '../common/constants';
import { HttpClient } from '@angular/common/http';
import { ApiEndpoints } from '../common/api-endpoints';
import { Tokens } from './models/tokens';
import jwtDecode from 'jwt-decode';
import { JwtPayload } from './models/jwt-payload';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  private currentUserSubject: BehaviorSubject<Tokens | null>;

  public currentUser: Observable<Tokens | null>;

  public get currentUserValue(): Tokens | null {
    return this.currentUserSubject?.value;
  }

  public get currentUserDecoded(): JwtPayload | null {
    if (!this.currentUserValue) {
      return null;
    }
    return jwtDecode(this.currentUserValue.accessToken);
  }

  public get isAuthenticated(): boolean {
    const jwtPayload = this.currentUserDecoded;
    console.log(jwtPayload);

    return jwtPayload !== null;
  }

  public set currentUserValue(currentUser: Tokens | null) {
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    this.currentUserSubject?.next(currentUser);
  }

  constructor(private http: HttpClient) {
    this.currentUserSubject = new BehaviorSubject<Tokens | null>(
      JSON.parse(<string>localStorage.getItem(CurrentUser)),
    );
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public signup(userCreateData: User, avatar: File): Observable<Tokens> {
    const formData: FormData = new FormData();
    formData.append('avatar', avatar);
    for (const [key, value] of Object.entries(userCreateData)) {
      formData.append(key, value);
    }

    return this.http.post<Tokens>(`${ ApiEndpoints.Auth }/signup`, formData);
  }

  public logout(): Observable<void> {
    localStorage.removeItem(CurrentUser);
    this.currentUserSubject?.next(null);

    return this.http.post<void>(`${ ApiEndpoints.Auth }/logout`, {});
  }
}
