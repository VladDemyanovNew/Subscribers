import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiEndpoints } from '../common/api-endpoints';
import { User } from './models/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) {
  }

  public getAll(name?: string): Observable<User[]> {
    let filter = '';
    if (name) {
      filter = `?name=${ name }`;
    }
    return this.http.get<User[]>(`${ ApiEndpoints.Users }${ filter }`);
  }

  public getRecommendationsForSubscribe(userId: number): Observable<User[]> {
    return this.http.get<User[]>(`${ ApiEndpoints.Users }/${ userId }/recommendations`);
  }

  public getUserSubscriptions(userId: number): Observable<User[]> {
    return this.http.get<User[]>(`${ ApiEndpoints.Users }/${ userId }/subscriptions`);
  }

  public subscribe(subscriberId: number, ownerId: number): Observable<void> {
    return this.http.post<void>(`${ ApiEndpoints.Users }/${ ownerId }/subscribers/${ subscriberId }`, {});
  }

  public unsubscribe(subscriberId: number, ownerId: number): Observable<void> {
    return this.http.delete<void>(`${ ApiEndpoints.Users }/${ ownerId }/subscribers/${ subscriberId }`);
  }
}
