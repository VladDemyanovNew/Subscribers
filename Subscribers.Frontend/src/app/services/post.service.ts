import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Post } from './models/post';
import { ApiEndpoints } from '../common/api-endpoints';

@Injectable({
  providedIn: 'root'
})
export class PostService {

  constructor(private http: HttpClient) { }

  public getAll(): Observable<Post[]> {
    return this.http.get<Post[]>(`${ApiEndpoints.Posts}`);
  }
}
