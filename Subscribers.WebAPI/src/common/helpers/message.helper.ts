import { Message } from '../models/messages.model';
import { MessageDto } from '../dtos/message.dto';
import { parseUserToDto } from './user.helper';
import { parseChatToDto } from './chat.helper';

export function parseMessageToDto(message: Message): MessageDto {
  return <MessageDto> {
    id: message.id,
    content: message.content,
    senderId: message.senderId,
    chatId: message.chatId,
    sender: message.sender ? parseUserToDto(message.sender) : null,
    chat: message.chat ? parseChatToDto(message.chat) : null,
  }
}