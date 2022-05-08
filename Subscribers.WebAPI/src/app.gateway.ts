import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway, WebSocketServer
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { MessagesService } from './modules/messages/messages.service';
import { Message } from './common/models/messages.model';

@WebSocketGateway(3003, {
  namespace: 'ws',
  cors: {
    origin: '*',
  },
})
export class AppGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {

  @WebSocketServer()
  public server: Server;

  constructor(private messagesService: MessagesService) {
  }

  @SubscribeMessage('sendPrivateMessageToServer')
  public async handlePrivateMessage(client: Socket, messageCreateData: Message): Promise<void> {
    const message = await this.messagesService.create(messageCreateData);
    this.server
      .in(messageCreateData.chatId.toString())
      .emit('sendPrivateMessageToClient', message);
  }

  @SubscribeMessage('joinPrivateRoom')
  public handleJoinPrivateRoom(client: Socket, roomId: number): void {
    client.join(roomId.toString());
  }

  @SubscribeMessage('leavePrivateRoom')
  public handleLeavePrivateRoom(client: Socket, roomId: number): void {
    client.leave(roomId.toString());
  }

  public afterInit(server: Server): void {
    console.log('Init WS Server');
  }

  public handleConnection(client: Socket, ...args: any[]): void {
    console.log(`Client connected: ${ client.id }`);
  }

  public handleDisconnect(client: Socket): void {
    console.log(`Client disconnected: ${ client.id }`);
  }
}
