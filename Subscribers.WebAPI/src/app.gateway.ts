import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway, WebSocketServer
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { UsersService } from "./modules/users/users.service";
import {RolesService} from "./modules/roles/roles.service";

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class AppGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {

  @WebSocketServer()
  server: Server;

  constructor(private roleService: RolesService) {
  }

  @SubscribeMessage('message')
  public async handleMessage(client: Socket, payload: string): Promise<void> {
    console.log(payload);
    const test = await this.roleService.getRole('ADMIN');
    console.log(test);
    this.server.emit('msgToClient', payload);
  }

  public afterInit(server: Server): void {
    console.log('Init WS Server');
  }

  public handleConnection(client: Socket, ...args: any[]): void {
    console.log(`Client connected: ${client.id}`);
  }

  public handleDisconnect(client: Socket): void {
    console.log(`Client disconnected: ${client.id}`);
  }
}
