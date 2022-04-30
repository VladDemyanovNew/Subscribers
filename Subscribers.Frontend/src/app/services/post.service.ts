import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Post } from './models/post';
import { ApiEndpoints } from '../common/api-endpoints';
import { Tokens } from './models/tokens';

@Injectable({
  providedIn: 'root'
})
export class PostService {

  constructor(private http: HttpClient) {
  }

  public getAll(): Observable<Post[]> {
    return this.http.get<Post[]>(`${ ApiEndpoints.Posts }`);
  }

  public create(postCreateData: Post, image: File): Observable<Post> {
    const formData: FormData = new FormData();
    formData.append('image', image);
    for (const [key, value] of Object.entries(postCreateData)) {
      formData.append(key, value);
    }

    return this.http.post<Post>(`${ ApiEndpoints.Posts }`, formData);
  }
}
