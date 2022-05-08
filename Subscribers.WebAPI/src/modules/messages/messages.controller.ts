import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { Message } from '../../common/models/messages.model';
import { MessageDto } from '../../common/dtos/message.dto';

@Controller('messages')
export class MessagesController {

  constructor(private messagesService: MessagesService) {
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  public async create(@Body() messageCreateData: Message): Promise<MessageDto> {
    return await this.messagesService.create(messageCreateData);
  }
}
