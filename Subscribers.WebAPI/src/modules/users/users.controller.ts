import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from '../../common/models/users.model';
import { JwtAccessAuthGuard } from '../auth/guards/jwt-access-auth.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { RoleName } from '../../common/enums/role-name';

@Controller('users')
export class UsersController {

  constructor(private readonly usersService: UsersService) {
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  public async create(@Body() userCreateData: User): Promise<User> {
    return await this.usersService.create(userCreateData);
  }

  @Roles(RoleName.USER)
  @UseGuards(JwtAccessAuthGuard)
  @Get()
  @HttpCode(HttpStatus.OK)
  public async getAll(): Promise<User[]> {
    return await this.usersService.getAll();
  }

  @Roles(RoleName.ADMIN)
  @UseGuards(JwtAccessAuthGuard)
  @Get(':username')
  @HttpCode(HttpStatus.OK)
  public async findOne(@Param('username') username: string): Promise<User> {
    const user: User = await this.usersService.findByEmail(username);
    if (!user) {
      throw new BadRequestException(`User with username=${ username } doesnt exist`);
    }
    return user;
  }
}
