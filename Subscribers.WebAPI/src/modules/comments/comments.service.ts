import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Comment } from '../../common/models/comments.model';
import { PostsService } from '../posts/posts.service';
import { isNil } from '@nestjs/common/utils/shared.utils';
import { InjectModel } from '@nestjs/sequelize';
import { User } from '../../common/models/users.model';

@Injectable()
export class CommentsService {

  constructor(
    @InjectModel(Comment)
    private commentModel: typeof Comment,
    private postService: PostsService) {
  }

  public async create(postId: number, commentCreateData: Comment): Promise<Comment> {
    const doesPostExist = !isNil(await this.postService.findById(postId));
    if (!doesPostExist) {
      throw new HttpException(
        `Post with id=${ postId } is not found`,
        HttpStatus.BAD_REQUEST,
      );
    }

    const comment = await this.commentModel.create({
      ...commentCreateData,
      postId: postId,
    });
    return await this.commentModel.findByPk(comment.id, { include: [User] });
  }

  public async getAllByPostId(postId: number): Promise<Comment[]> {
    const doesPostExist = isNil(await this.postService.findById(postId));
    if (doesPostExist) {
      throw new HttpException(
        `Post with id=${ postId } is not found`,
        HttpStatus.BAD_REQUEST,
      );
    }

    return await this.commentModel.findAll({
      where: { postId: postId },
    });
  }
}
