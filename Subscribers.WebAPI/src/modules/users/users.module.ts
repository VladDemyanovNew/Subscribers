import { forwardRef, Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from '../../common/models/users.model';
import { Role } from '../../common/models/roles.model';
import { UserRoles } from '../../common/models/user-roles.model';
import { RolesModule } from '../roles/roles.module';
import { AuthModule } from '../auth/auth.module';
import { Subscription } from '../../common/models/subscriptions.model';
import { ChatsModule } from '../chats/chats.module';
import { CaslModule } from '../casl/casl.module';

@Module({
  controllers: [UsersController],
  providers: [UsersService],
  imports: [
    SequelizeModule.forFeature([
      User,
      Role,
      UserRoles,
      Subscription,
    ]),
    RolesModule,
    forwardRef(() => AuthModule),
    ChatsModule,
    CaslModule,
  ],
  exports: [UsersService],
})
export class UsersModule {
}
