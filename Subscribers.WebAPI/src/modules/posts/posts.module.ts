import { forwardRef, Module } from '@nestjs/common';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Post } from '../../common/models/posts.model';
import { UsersModule } from '../users/users.module';
import { DropboxModule } from '../dropbox/dropbox.module';
import { AuthModule } from '../auth/auth.module';
import { Like } from '../../common/models/likes.model';

@Module({
  controllers: [PostsController],
  providers: [PostsService],
  imports: [
    SequelizeModule.forFeature([Post, Like]),
    UsersModule,
    DropboxModule,
    forwardRef(() => AuthModule),
  ],
  exports: [PostsService],
})
export class PostsModule {
}
