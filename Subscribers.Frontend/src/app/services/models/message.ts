import { User } from './user';

export interface Message {
  readonly id?: number;
  readonly content?: string;
  readonly senderId: number;
  readonly chatId: number;
  readonly sender?: User;
}
