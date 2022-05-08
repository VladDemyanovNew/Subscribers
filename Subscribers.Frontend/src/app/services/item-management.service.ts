import { Injectable } from '@angular/core';
import { Post } from './models/post';
import { Subject } from 'rxjs';
import { Chat } from './models/chat';

@Injectable({
  providedIn: 'root',
})
export class ItemManagementService {

  private postItemSource = new Subject<Post>();

  private chatItemSource = new Subject<Chat>();

  public createPostItem$ = this.postItemSource.asObservable();

  public createChatItem$ = this.chatItemSource.asObservable();

  public create(post: Post) {
    this.postItemSource.next(post);
  }

  public createChat(chat: Chat) {
    this.chatItemSource.next(chat);
  }
}
