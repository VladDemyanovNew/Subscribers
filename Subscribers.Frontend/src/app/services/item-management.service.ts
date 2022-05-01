import { EventEmitter, Injectable } from '@angular/core';
import { Post } from './models/post';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ItemManagementService {

  private postItemSource = new Subject<Post>();

  public createPostItem$ = this.postItemSource.asObservable();

  public create(post: Post) {
    this.postItemSource.next(post);
  }
}
