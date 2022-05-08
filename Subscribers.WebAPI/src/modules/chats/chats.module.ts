import { Module } from '@nestjs/common';
import { ChatsService } from './chats.service';
import { ChatsController } from './chats.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Chat } from '../../common/models/chats.model';

@Module({
  providers: [ChatsService],
  controllers: [ChatsController],
  imports: [
    SequelizeModule.forFeature([
      Chat,
    ]),
  ],
  exports: [ChatsService],
})
export class ChatsModule {
}
