import { IsNumberString } from 'class-validator';

export class CommentParamDto {
  @IsNumberString()
  readonly postId: number;
}