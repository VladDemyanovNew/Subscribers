import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Socket } from 'ngx-socket-io';
import { Message } from './models/message';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {

  private privateMessageSource: Subject<Message> = new Subject<Message>();

  public sendPrivateMessageToClient$: Observable<Message> = this.privateMessageSource.asObservable();

  constructor(private socket: Socket) {
    this.socket.on('sendPrivateMessageToClient', (message: Message) => {
      this.privateMessageSource.next(message);
    });
  }

  public sendPrivateMessage(message: Message): void {
    this.socket.emit('sendPrivateMessageToServer', message);
  }

  public joinRoom(roomId: number): void {
    this.socket.emit('joinPrivateRoom', roomId);
  }

  public leaveRoom(roomId: number): void {
    this.socket.emit('leavePrivateRoom', roomId);
  }
}
