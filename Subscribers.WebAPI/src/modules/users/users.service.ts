import { Injectable } from '@nestjs/common';
import { User } from '../../common/models/users.model';
import { InjectModel } from '@nestjs/sequelize';
import { RolesService } from '../roles/roles.service';
import { RoleName } from '../../common/enums/role-name';
import { Role } from '../../common/models/roles.model';
import { isNil } from '@nestjs/common/utils/shared.utils';

@Injectable()
export class UsersService {

  constructor(
    @InjectModel(User)
    private userModel: typeof User,
    private roleService: RolesService,
  ) {
  }

  public async create(userCreateData: User): Promise<User> {
    if (isNil(userCreateData.nickname)) {
      userCreateData.nickname = userCreateData.email;
    }
    const user = await this.userModel.create(userCreateData);
    const role = await this.roleService.getRole(RoleName.USER);
    await user.$set('roles', [role.id]);
    user.roles = [role];

    return user;
  }

  public async getAll(): Promise<User[]> {
    return await this.userModel.findAll({ include: Role })
  }

  public async findByEmail(email: string): Promise<User> {
    return await this.userModel.findOne({ where: { email: email } });
  }

  public async findById(userId: number): Promise<User> {
    return await this.userModel.findOne({ where: { id: userId } });
  }
}
