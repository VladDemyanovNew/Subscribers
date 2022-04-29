import { User } from './user';

export interface Post {
  id: number;
  content?: string;
  title: string;
  imagePath?: string;
  ownerId: number;
  owner?: User;
}
