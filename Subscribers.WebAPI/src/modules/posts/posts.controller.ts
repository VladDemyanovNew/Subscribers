import {
  Body,
  Controller,
  Get,
  Post,
  HttpCode,
  HttpStatus,
  UseInterceptors,
  UploadedFile,
  Query
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostDto } from '../../common/dtos/post.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';

@Controller('posts')
export class PostsController {

  constructor(private postService: PostsService) {
  }

  @Get()
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
}
