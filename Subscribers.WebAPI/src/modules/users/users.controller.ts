import { Body, Controller, Get, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from '../../models/users.model';

@Controller('users')
export class UsersController {

    constructor(private readonly usersService: UsersService) { }

    @Post()
    public async create(@Body() userCreateData: User): Promise<User> {
        return await this.usersService.create(userCreateData);
    }

    @Get()
    public async getAll(): Promise<User[]> {
        return await this.usersService.getAll();
    }
}
