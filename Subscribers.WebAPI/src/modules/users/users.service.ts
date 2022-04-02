import { Injectable } from '@nestjs/common';
import { User } from '../../models/users.model';
import { InjectModel } from '@nestjs/sequelize';
import { RolesService } from '../roles/roles.service';
import { RoleName } from '../../common/enums/role-name';
import { Role } from '../../models/roles.model';

@Injectable()
export class UsersService {

    constructor(
        @InjectModel(User)
        private userModel: typeof User,
        private roleService: RolesService,
    ) { }

    public async create(userCreateData: User): Promise<User> {
        const user = await this.userModel.create(userCreateData);
        const role = await this.roleService.getRole(RoleName.USER);
        await user.$set('roles', [role.id]);
        user.roles = [role];

        return user;
    }

    public async getAll(): Promise<User[]> {
        return await this.userModel.findAll({ include: Role })
    }
}
