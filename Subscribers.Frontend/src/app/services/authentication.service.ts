import { Injectable, OnInit } from '@angular/core';
import { BehaviorSubject, map, Observable, of, single } from 'rxjs';
import { User } from './models/user';
import { CurrentUser, RefreshTokenHeader } from '../common/constants';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ApiEndpoints } from '../common/api-endpoints';
import { Tokens } from './models/tokens';
import jwtDecode from 'jwt-decode';
import { JwtPayload } from './models/jwt-payload';
import { Router } from '@angular/router';
import { Role } from './enums/role';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  private currentUserSource: BehaviorSubject<Tokens | null>;

  public currentUser$: Observable<Tokens | null>;

  private refreshTokenTimeout: number | undefined;

  public get currentUser(): Tokens | null {
    return this.currentUserSource?.value;
  }

  public set currentUser(currentUser: Tokens | null) {
    localStorage.setItem(CurrentUser, JSON.stringify(currentUser));
    this.currentUserSource?.next(currentUser);
  }

  public get currentUserDecoded(): JwtPayload | null {
    if (!this.currentUser) {
      return null;
    }
    return jwtDecode(this.currentUser.accessToken);
  }

  public get isAuthenticated(): boolean {
    return this.currentUserDecoded !== null;
  }

  public get isAdmin(): boolean {
    return !!this.currentUserDecoded?.roles.find(role => role.name == Role.ADMIN);
  }

  constructor(private http: HttpClient, private router: Router) {
    this.currentUserSource = new BehaviorSubject<Tokens | null>(
      JSON.parse(<string>localStorage.getItem(CurrentUser)),
    );
    this.currentUser$ = this.currentUserSource.asObservable();
  }

  public signup(userCreateData: User, avatar: File): Observable<Tokens> {
    const formData: FormData = new FormData();
    formData.append('avatar', avatar);
    for (const [key, value] of Object.entries(userCreateData)) {
      formData.append(key, value);
    }

    return this.http.post<Tokens>(`${ ApiEndpoints.Auth }/signup`, formData)
      .pipe(map(tokens => {
        this.currentUser = tokens;
        this.startRefreshTokenTimer();
        return tokens;
      }));
  }

  public signin(email: string, password: string): Observable<Tokens> {
    return this.http.post<Tokens>(`${ ApiEndpoints.Auth }/signin`, {
      email: email,
      password: password,
    }).pipe(map((tokens) => {
      this.currentUser = tokens;
      this.startRefreshTokenTimer();
      return tokens;
    }));
  }

  public logout(): void {
    this.http.post<void>(`${ ApiEndpoints.Auth }/logout`, {}).subscribe();

    this.stopRefreshTokenTimer();
    localStorage.removeItem(CurrentUser);
    this.currentUserSource?.next(null);
    this.router?.navigate(['/signin']);
  }

  public refreshToken(): Observable<Tokens> {
    let headers = new HttpHeaders();
    headers = headers.set(RefreshTokenHeader.key, RefreshTokenHeader.value);

    return this.http.post<Tokens>(`${ ApiEndpoints.Auth }/refresh`, {}, {
        headers: headers,
      })
      .pipe(map((tokens) => {
        this.currentUser = tokens;
        this.startRefreshTokenTimer();
        return tokens;
      }));
  }

  private startRefreshTokenTimer(): void {
    if (!this.currentUserDecoded) {
      return;
    }
    const expires = new Date(this.currentUserDecoded.exp * 1000);
    const timeout = expires.getTime() - Date.now() - (60 * 1000);
    this.refreshTokenTimeout = setTimeout(() => this.refreshToken().subscribe(), timeout);
  }

  private stopRefreshTokenTimer(): void {
    clearTimeout(this.refreshTokenTimeout);
  }
}
