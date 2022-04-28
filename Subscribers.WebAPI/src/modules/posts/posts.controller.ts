import { Body, Controller, Get, Post, HttpCode, HttpStatus, UseInterceptors, UploadedFile } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostDto } from '../../common/dtos/post.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';
import { DropboxService } from '../dropbox/dropbox.service';
import { parsePostToDto } from '../../common/helpers/post.helper';

@Controller('posts')
export class PostsController {

  constructor(private postService: PostsService) {
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  public async getAll(): Promise<PostDto[]> {
    return await this.postService.getAll();
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
}
