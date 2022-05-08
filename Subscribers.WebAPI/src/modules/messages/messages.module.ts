import { Module } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Message } from '../../common/models/messages.model';
import { MessagesController } from './messages.controller';

@Module({
  providers: [MessagesService],
  imports: [
    SequelizeModule.forFeature([
      Message,
    ]),
  ],
  exports: [MessagesService],
  controllers: [MessagesController],
})
export class MessagesModule {}
