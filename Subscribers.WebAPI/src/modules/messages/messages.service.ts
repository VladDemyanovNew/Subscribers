import { Injectable } from '@nestjs/common';
import { MessageDto } from '../../common/dtos/message.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Message } from '../../common/models/messages.model';
import { User } from '../../common/models/users.model';
import { Chat } from '../../common/models/chats.model';
import { parseMessageToDto } from '../../common/helpers/message.helper';

@Injectable()
export class MessagesService {

  constructor(@InjectModel(Message) private messageModel: typeof Message) {
  }

  public async create(messageCreateData: Message): Promise<MessageDto> {
    const message = await this.messageModel.create(messageCreateData);
    const rawMessage = await this.messageModel.findByPk(message.id, {
      include: [User, Chat],
    });
    return parseMessageToDto(rawMessage);
  }
}
