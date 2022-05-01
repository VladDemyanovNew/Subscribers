import { User } from './user';
import { Comment } from './comment';

export interface Post {
  id: number;
  content?: string;
  title: string;
  imagePath?: string;
  ownerId: number;
  owner?: User;
  comments?: Comment[],
}
