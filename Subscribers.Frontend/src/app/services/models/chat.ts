import { User } from './user';
import { Message } from './message';

export interface Chat {
  readonly id: number;
  readonly users: User[];
  readonly messages: Message[];
}
