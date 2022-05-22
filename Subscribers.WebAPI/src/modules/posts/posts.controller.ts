import {
  Body,
  Controller,
  Get,
  Post,
  HttpCode,
  HttpStatus,
  UseInterceptors,
  UploadedFile,
  Query, UseGuards, Param, Delete
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostDto } from '../../common/dtos/post.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';
import { JwtAccessAuthGuard } from '../auth/guards/jwt-access-auth.guard';

@Controller('posts')
export class PostsController {

  constructor(private postService: PostsService) {
  }

  @Get()
  @UseGuards(JwtAccessAuthGuard)
  @HttpCode(HttpStatus.OK)
  public async findSelected(
    @Query('take') take: number,
    @Query('skip') skip: number,
  ): Promise<PostDto[]> {
    return await this.postService.findSelected(Number(take), Number(skip));
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(FileInterceptor('image'))
  public async create(
    @UploadedFile() image: Express.Multer.File,
    @Body() postCreateData: PostDto,
  ): Promise<PostDto> {
    return await this.postService.create(postCreateData, image);
  }

  @Post('/:postId/likes')
  @HttpCode(HttpStatus.CREATED)
  public async like(
    @Param('postId') postId: string,
    @Query('ownerId') ownerId: string): Promise<void> {
    await this.postService.like(Number(postId), Number(ownerId));
  }

  @Delete('/:postId/likes')
  @HttpCode(HttpStatus.NO_CONTENT)
  public async dislike(
    @Param('postId') postId: string,
    @Query('ownerId') ownerId: string): Promise<void> {
    await this.postService.dislike(Number(postId), Number(ownerId));
  }

  @Delete('/:postId')
  @HttpCode(HttpStatus.NO_CONTENT)
  public async delete(@Param('postId') postId: string): Promise<void> {
    await this.postService.delete(Number(postId));
  }
}
