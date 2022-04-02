import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Role } from '../../models/roles.model';

@Injectable()
export class RolesService {

    constructor(@InjectModel(Role) private roleModel: typeof Role) { }

    public async getRole(name: string): Promise<Role> {
        return await this.roleModel.findOne({ where: { name } });
    }
}
