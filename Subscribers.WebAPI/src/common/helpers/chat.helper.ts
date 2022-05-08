import { Chat } from '../models/chats.model';
import { ChatDto } from '../dtos/chat.dto';
import { parseUserToDto } from './user.helper';
import { parseMessageToDto } from './message.helper';

export function parseChatToDto(chat: Chat): ChatDto {
  return <ChatDto> {
    id: chat.id,
    users: chat.users?.map(user => parseUserToDto(user)),
    messages: chat.messages?.map(message => parseMessageToDto(message)),
  };
}