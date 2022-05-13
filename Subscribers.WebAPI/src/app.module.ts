import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './modules/users/users.module';
import { User } from './common/models/users.model';
import { RolesModule } from './modules/roles/roles.module';
import { Role } from './common/models/roles.model';
import { UserRoles } from './common/models/user-roles.model';
import { PostsModule } from './modules/posts/posts.module';
import { Post } from './common/models/posts.model';
import { Like } from './common/models/likes.model';
import { Subscription } from './common/models/subscriptions.model';
import { Comment } from './common/models/comments.model';
import { AppGateway } from './app.gateway';
import { AuthModule } from './modules/auth/auth.module';
import { CommentsModule } from './modules/comments/comments.module';
import { Message } from './common/models/messages.model';
import { Chat } from './common/models/chats.model';
import { ChatUsers } from './common/models/chat-users.model';
import { ChatsModule } from './modules/chats/chats.module';
import { MessagesModule } from './modules/messages/messages.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAccessAuthGuard } from './modules/auth/guards/jwt-access-auth.guard';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
    }),
    SequelizeModule.forRoot({
      dialect: 'mssql',
      host: process.env.MSSQL_HOST,
      port: Number(process.env.MSSQL_PORT),
      username: process.env.MSSQL_USER,
      password: process.env.MSSQL_PASSWORD,
      database: process.env.MSSQL_DB,
      autoLoadModels: true,
      models: [
        User,
        Role,
        UserRoles,
        Post,
        Like,
        Subscription,
        Comment,
        Message,
        Chat,
        ChatUsers,
      ],
    }),
    UsersModule,
    RolesModule,
    PostsModule,
    AuthModule,
    CommentsModule,
    ChatsModule,
    MessagesModule,
  ],
  providers: [AppGateway, { provide: APP_GUARD, useClass: JwtAccessAuthGuard }],
})
export class AppModule {
}
