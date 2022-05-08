import { Injectable } from '@nestjs/common';
import { Chat } from '../../common/models/chats.model';
import { InjectModel } from '@nestjs/sequelize';
import { User } from '../../common/models/users.model';
import { parseChatToDto } from '../../common/helpers/chat.helper';
import { ChatDto } from '../../common/dtos/chat.dto';
import { Message } from '../../common/models/messages.model';

@Injectable()
export class ChatsService {

  constructor(@InjectModel(Chat) private chatModel: typeof Chat) {
  }

  public async create(chatCreateData: Chat): Promise<ChatDto> {
    const chat = await this.chatModel.create(chatCreateData);
    if (chatCreateData.users.length > 0) {
      await chat.$set('users', chatCreateData.users.map(user => user.id));
    }
    const rawChat = await this.chatModel.findByPk(chat.id, {
      include: [User, Message, { model: Message, include: [User] }],
    });
    return parseChatToDto(rawChat);
  }

  public async getAllByUserId(userId: number): Promise<ChatDto[]> {
    const chats = await this.chatModel.findAll({
      include: [User, Message, { model: Message, include: [User] }],
    });
    return chats
      .filter(chat => chat.users.some(user => user.id === Number(userId)))
      .map(chat => parseChatToDto(chat));
  }
}
