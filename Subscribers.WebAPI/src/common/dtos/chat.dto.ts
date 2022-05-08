import { UserDto } from './user.dto';
import { MessageDto } from './message.dto';

export class ChatDto {

  readonly id?: number;

  readonly users: UserDto[];

  readonly messages: MessageDto[];
}