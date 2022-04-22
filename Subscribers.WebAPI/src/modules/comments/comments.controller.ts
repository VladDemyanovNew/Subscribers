import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post } from '@nestjs/common';
import { Comment } from '../../common/models/comments.model';
import { CommentsService } from './comments.service';
import { CommentParamDto } from '../../common/dtos/comment-param.dto';

@Controller()
export class CommentsController {
  constructor(private commentsService: CommentsService) {
  }

  @Post('posts/:postId/comments')
  @HttpCode(HttpStatus.CREATED)
  public async create(
    @Body() commentCreateData: Comment,
    @Param() params: CommentParamDto): Promise<Comment> {
    return await this.commentsService.create(params.postId, commentCreateData);
  }

  @Get('posts/:postId/comments')
  @HttpCode(HttpStatus.OK)
  public async getAll(@Param() params: CommentParamDto): Promise<Comment[]> {
    return await this.commentsService.getAllByPostId(params.postId);
  }
}
