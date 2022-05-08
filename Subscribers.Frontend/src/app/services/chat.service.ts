import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Chat } from './models/chat';
import { ApiEndpoints } from '../common/api-endpoints';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  constructor(private http: HttpClient) { }

  public getUserChats(userId: number): Observable<Chat[]> {
    return this.http.get<Chat[]>(`${ ApiEndpoints.Users }/${ userId }/chats`);
  }

  public create(chatCreateData: Chat): Observable<Chat> {
    return this.http.post<Chat>(`${ ApiEndpoints.Chats }`, chatCreateData);
  }
}
