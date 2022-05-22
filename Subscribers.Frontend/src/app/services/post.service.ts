import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Post } from './models/post';
import { ApiEndpoints } from '../common/api-endpoints';

@Injectable({
  providedIn: 'root'
})
export class PostService {

  constructor(private http: HttpClient) {
  }

  public getAll(take?: number, skip?: number): Observable<Post[]> {
    return this.http.get<Post[]>(`${ ApiEndpoints.Posts }?take=${ take }&skip=${ skip }`);
  }

  public create(postCreateData: Post, image: File): Observable<Post> {
    const formData: FormData = new FormData();
    formData.append('image', image);
    for (const [key, value] of Object.entries(postCreateData)) {
      formData.append(key, value);
    }

    return this.http.post<Post>(`${ ApiEndpoints.Posts }`, formData);
  }

  public like(postId: number, ownerId: number): Observable<void> {
    return this.http.post<void>(`${ ApiEndpoints.Posts }/${ postId }/likes?ownerId=${ ownerId }`, {});
  }

  public dislike(postId: number, ownerId: number): Observable<void> {
    return this.http.delete<void>(`${ ApiEndpoints.Posts }/${ postId }/likes?ownerId=${ ownerId }`);
  }

  public delete(postId: number): Observable<void> {
    return this.http.delete<void>(`${ ApiEndpoints.Posts }/${ postId }`);
  }
}
