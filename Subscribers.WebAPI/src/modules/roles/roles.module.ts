import { Module } from '@nestjs/common';
import { RolesService } from './roles.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Role } from '../../common/models/roles.model';
import { User } from '../../common/models/users.model';
import { UserRoles } from '../../common/models/user-roles.model';

@Module({
  providers: [RolesService],
  imports: [
    SequelizeModule.forFeature([Role, User, UserRoles]),
  ],
  exports: [
    RolesService,
  ],
})
export class RolesModule {
}
