import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { SequelizeModule } from "@nestjs/sequelize";
import { User } from '../../models/users.model';
import { Role } from '../../models/roles.model';
import { UserRolesModel } from '../../models/user-roles.model';
import { RolesModule } from '../roles/roles.module';

@Module({
  controllers: [UsersController],
  providers: [UsersService],
  imports: [
      SequelizeModule.forFeature([User, Role, UserRolesModel]),
      RolesModule,
  ],
})
export class UsersModule {}
