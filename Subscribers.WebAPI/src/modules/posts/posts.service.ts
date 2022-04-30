import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { Post } from '../../common/models/posts.model';
import { InjectModel } from '@nestjs/sequelize';
import { PostDto } from '../../common/dtos/post.dto';
import { UsersService } from '../users/users.service';
import { isNil } from '@nestjs/common/utils/shared.utils';
import { fillPost, parsePostToDto } from '../../common/helpers/post.helper';
import { DropboxService } from '../dropbox/dropbox.service';
import { Express } from 'express';
import { User } from '../../common/models/users.model';
import { Like } from '../../common/models/likes.model';

@Injectable()
export class PostsService {

  constructor(
    @InjectModel(Post)
    private postModel: typeof Post,
    private userService: UsersService,
    private dropboxService: DropboxService) {
  }

  public async getAll(): Promise<PostDto[]> {
    const rawUsers = await this.postModel.findAll({ include: [User, Like] });
    return rawUsers.map(rawPost => parsePostToDto(rawPost));
  }

  public async create(postCreateData: PostDto, image: Express.Multer.File): Promise<Post> {
    const doesUserExist = !isNil(await this.userService.findById(postCreateData.ownerId));
    if (!doesUserExist) {
      throw new HttpException(
        `User with id=${ postCreateData.ownerId } is not found`,
        HttpStatus.BAD_REQUEST,
      );
    }

    const post = await this.postModel.create(<Post>{ ...postCreateData });
    if (image) {
      const uploadedImageLink = await this.dropboxService.uploadFile(image);
      post.imagePath = uploadedImageLink;
      await post.save();
    }

    return await this.postModel.findByPk(post.id, { include: [User, Like] });
  }

  public async update(postUpdateData: PostDto): Promise<Post> {
    const doesUserExist = !isNil(await this.userService.findById(postUpdateData.ownerId));
    if (!doesUserExist) {
      throw new HttpException(
        `User with id=${ postUpdateData.ownerId } is not found`,
        HttpStatus.BAD_REQUEST,
      );
    }

    const post = await this.postModel.findByPk(postUpdateData.id);
    if (!post) {
      throw new HttpException(
        `Post with id=${ postUpdateData.id } is not found`,
        HttpStatus.BAD_REQUEST,
      );
    }

    fillPost(<Post>{ ...postUpdateData }, post);
    await post.save();
    return post;
  }

  public async findById(postId: number): Promise<Post> {
    return await this.postModel.findByPk(postId);
  }
}
