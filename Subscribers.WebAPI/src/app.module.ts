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
      ],
    }),
    UsersModule,
    RolesModule,
    PostsModule,
    AuthModule,
    CommentsModule,
  ],
  providers: [AppGateway],
})
export class AppModule {
}
