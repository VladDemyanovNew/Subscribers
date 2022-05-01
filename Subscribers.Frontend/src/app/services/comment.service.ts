import { Injectable } from '@angular/core';
import { Post } from './models/post';
import { Observable } from 'rxjs';
import { ApiEndpoints } from '../common/api-endpoints';
import { HttpClient } from '@angular/common/http';
import { Comment } from './models/comment';

@Injectable({
  providedIn: 'root'
})
export class CommentService {

  constructor(private http: HttpClient) {
  }

  public create(commentCreateData: Comment, postId: number): Observable<Comment> {
    return this.http.post<Comment>(`${ ApiEndpoints.Posts }/${ postId }/comments`, commentCreateData);
  }
}
