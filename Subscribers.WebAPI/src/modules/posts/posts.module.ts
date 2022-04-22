import { Module } from '@nestjs/common';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Post } from '../../common/models/posts.model';
import { UsersModule } from '../users/users.module';
import { DropboxModule } from '../dropbox/dropbox.module';

@Module({
  controllers: [PostsController],
  providers: [PostsService],
  imports: [
    SequelizeModule.forFeature([Post]),
    UsersModule,
    DropboxModule,
  ],
  exports: [PostsService],
})
export class PostsModule {
}
