import { UserDto } from './user.dto';
import { ChatDto } from './chat.dto';

export class MessageDto {

  readonly id?: number;

  readonly content: string;

  readonly senderId: number;

  readonly chatId: number;

  readonly sender?: UserDto;

  readonly chat?: ChatDto;
}