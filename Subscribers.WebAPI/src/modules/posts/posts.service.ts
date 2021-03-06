import {
  BadRequestException,
  ForbiddenException,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Scope
} from '@nestjs/common';
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
import { Comment } from '../../common/models/comments.model';
import { CaslAbilityFactory } from '../casl/casl-ability.factory';
import { Action } from '../../common/enums/action';

@Injectable()
export class PostsService {

  constructor(
    @InjectModel(Post)
    private postModel: typeof Post,
    @InjectModel(Like)
    private likeModel: typeof Like,
    private userService: UsersService,
    private dropboxService: DropboxService,
    private caslAbilityFactory: CaslAbilityFactory) {
  }

  public async getAll(): Promise<PostDto[]> {
    const rawUsers = await this.postModel.findAll({ include: [User, Like] });
    return rawUsers.map(rawPost => parsePostToDto(rawPost));
  }

  public async findSelected(take: number, skip: number): Promise<PostDto[]> {
    const { rows, count } = await this.postModel.findAndCountAll({
      include: [User, Like, Comment, { model: Comment, include: [User] }],
      order: [
        ['id', 'DESC'],
      ],
      offset: skip,
      limit: take,
    });

    return rows.map(rawPost => parsePostToDto(rawPost));
  }

  public async create(postCreateData: PostDto, image: Express.Multer.File): Promise<PostDto> {
    const doesUserExist = !isNil(await this.userService.findById(postCreateData.ownerId));
    if (!doesUserExist) {
      throw new HttpException(
        `User with id=${ postCreateData.ownerId } is not found`,
        HttpStatus.BAD_REQUEST,
      );
    }

    const post = await this.postModel.create(<Post>{ ...postCreateData });
    if (image) {
      post.imagePath = await this.dropboxService.uploadFile(image);
      await post.save();
    }
    const rawPost = await this.postModel.findByPk(post.id, {
      include: [User, Like, Comment, { model: Comment, include: [User] }],
    });
    return parsePostToDto(rawPost);
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

  public async like(postId: number, ownerId: number): Promise<void> {
    const doesPostExist = !isNil(await this.postModel.findByPk(postId));
    if (!doesPostExist) {
      throw new BadRequestException(`Cannot create like for post with id=${ postId }, ` +
        'because it is not found');
    }

    const doesLikeExist = !isNil(await this.likeModel.findOne({
      where: {
        postId: postId,
        ownerId: ownerId,
      },
    }));
    if (doesLikeExist) {
      throw new BadRequestException(`Cannot create like for post with id=${ postId }, ` +
        'because like is already exist');
    }

    await this.likeModel.create(<Like> {
      postId: postId,
      ownerId: ownerId,
    });
  }

  public async dislike(postId: number, ownerId: number): Promise<void> {
    const doesLikeExist = !isNil(await this.likeModel.findOne({
      where: {
        postId: postId,
        ownerId: ownerId,
      },
    }));
    if (!doesLikeExist) {
      throw new BadRequestException(`Cannot delete like from post with id=${ postId }, ` +
        'because like is not found');
    }

    await this.likeModel.destroy({
      where: {
        postId: postId,
        ownerId: ownerId,
      },
    });
  }

  public async delete(postId: number): Promise<void> {
    const post = await this.postModel.findByPk(postId);
    if (!post) {
      throw new HttpException(
        `Can't delete post with id=${ postId }, because it doesn't exist`,
        HttpStatus.BAD_REQUEST,
      );
    }

    const currentUser = await this.userService.getCurrentUser();
    const abilities = this.caslAbilityFactory.createForUser(currentUser);
    const canActivate = abilities.can(Action.Delete, post);
    if (!canActivate) {
      throw new ForbiddenException(
        `Can't delete post with id=${ postId }, because user hasn't permissions.`,
      );
    }

    await this.postModel.destroy({ where: { id: postId } });
  }
}
