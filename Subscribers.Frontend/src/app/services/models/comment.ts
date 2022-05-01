import { User } from './user';

export interface Comment {
  readonly id: number;
  readonly message: string;
  readonly ownerId: number;
  readonly postId: number;
  readonly owner: User;
}
