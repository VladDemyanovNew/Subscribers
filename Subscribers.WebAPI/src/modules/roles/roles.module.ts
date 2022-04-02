import { Module } from '@nestjs/common';
import { RolesService } from './roles.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Role } from '../../models/roles.model';
import { User } from '../../models/users.model';
import { UserRoles } from '../../models/user-roles.model';

@Module({
  providers: [RolesService],
  imports: [
    SequelizeModule.forFeature([Role, User, UserRoles]),
  ],
  exports: [
    RolesService,
  ],
})
export class RolesModule {}
