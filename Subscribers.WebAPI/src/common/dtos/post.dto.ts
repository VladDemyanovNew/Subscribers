import { MaxLength } from 'class-validator';
import { UserDto } from './user.dto';
import { Comment } from '../models/comments.model';
import { Like } from '../models/likes.model';

export class PostDto {

  readonly id?: number;

  @MaxLength(4000, { message: 'Максимальная длина 4000' })
  readonly content?: string;

  @MaxLength(32, { message: 'Максимальная длина 32' })
  readonly title: string;

  readonly imagePath?: string;

  readonly ownerId: number;

  readonly owner?: UserDto;

  readonly comments?: Comment[];

  readonly likes?: Like[];
}