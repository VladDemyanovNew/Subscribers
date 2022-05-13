import { Injectable, OnInit } from '@angular/core';
import { BehaviorSubject, Observable, of, single } from 'rxjs';
import { User } from './models/user';
import { CurrentUser } from '../common/constants';
import { HttpClient } from '@angular/common/http';
import { ApiEndpoints } from '../common/api-endpoints';
import { Tokens } from './models/tokens';
import jwtDecode from 'jwt-decode';
import { JwtPayload } from './models/jwt-payload';
import { Router } from '@angular/router';

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
    return jwtPayload !== null;
  }

  public set currentUserValue(currentUser: Tokens | null) {
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    this.currentUserSubject?.next(currentUser);
  }

  constructor(private http: HttpClient, private router: Router) {
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

  public signin(email: string, password: string): Observable<Tokens> {
    return this.http.post<Tokens>(`${ ApiEndpoints.Auth }/signin`, {
      email: email,
      password: password,
    });
  }

  public logout(): void {
    localStorage.removeItem(CurrentUser);
    this.currentUserSubject?.next(null);
    this.router?.navigate(['/signin']);
    this.http.post<void>(`${ ApiEndpoints.Auth }/logout`, {});
  }
}
