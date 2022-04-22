import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { Post } from '../../common/models/posts.model';
import { InjectModel } from '@nestjs/sequelize';
import { PostDto } from '../../common/dtos/post.dto';
import { UsersService } from '../users/users.service';
import { isNil } from '@nestjs/common/utils/shared.utils';

@Injectable()
export class PostsService {

  constructor(
    @InjectModel(Post)
    private postModel: typeof Post,
    private userService: UsersService) {
  }

  public async getAll(): Promise<Post[]> {
    return await this.postModel.findAll();
  }

  public async create(postCreateData: PostDto): Promise<PostDto> {
    const doesUserExist = !isNil(await this.userService.findById(postCreateData.ownerId));
    if (!doesUserExist) {
      throw new HttpException(
        `User with id=${ postCreateData.ownerId } is not found`,
        HttpStatus.BAD_REQUEST,
      );
    }

    const post = await this.postModel.create(postCreateData);
    return post;
  }

  public async findById(postId: number): Promise<Post> {
    return await this.postModel.findByPk(postId);
  }
}
