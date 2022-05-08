import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post } from '@nestjs/common';
import { ChatsService } from './chats.service';
import { Chat } from '../../common/models/chats.model';
import { ChatDto } from '../../common/dtos/chat.dto';

@Controller()
export class ChatsController {

  private static basePath: string = 'chats';

  constructor(private chatsService: ChatsService) {
  }

  @Post(ChatsController.basePath)
  @HttpCode(HttpStatus.CREATED)
  public async create(@Body() chatCreateData: Chat): Promise<ChatDto> {
    return await this.chatsService.create(chatCreateData);
  }

  @Get(`/users/:userId/${ ChatsController.basePath }`)
  @HttpCode(HttpStatus.OK)
  public async getUserChats(@Param('userId') userId: number): Promise<ChatDto[]> {
    return await this.chatsService.getAllByUserId(Number(userId));
  }
}
