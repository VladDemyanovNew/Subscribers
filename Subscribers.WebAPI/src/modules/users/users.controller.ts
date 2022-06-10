import {
  BadRequestException,
  Body,
  Controller, Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post, Query,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from '../../common/models/users.model';
import { JwtAccessAuthGuard } from '../auth/guards/jwt-access-auth.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { RoleName } from '../../common/enums/role-name';
import { SubscriptionParamDto } from '../../common/dtos/subscription-param.dto';
import { UserDto } from '../../common/dtos/user.dto';
import { CaslAbilityFactory } from '../casl/casl-ability.factory';
import { Public } from '../../common/decorators/public.decorator';
import { GetJwtAccessPayload } from '../../common/decorators/access-token.decorator';
import { JwtPayload } from '../../common/types/jwt-payload.type';

@Controller('users')
export class UsersController {

  constructor(
    private readonly usersService: UsersService,
    private caslAbilityFactory: CaslAbilityFactory,
  ) {
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  public async create(@Body() userCreateData: User): Promise<User> {
    return await this.usersService.create(userCreateData);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  public async getAll(@Query('name') name?: string): Promise<User[]> {
    return await this.usersService.getAll(name);
  }

  @Get(':userId/subscriptions')
  @HttpCode(HttpStatus.OK)
  public async getUserSubscriptions(@Param('userId') userId: number): Promise<UserDto[]> {
    return await this.usersService.getUserSubscriptions(userId);
  }

  @Get(':userId/recommendations')
  @HttpCode(HttpStatus.OK)
  public async getRecommendationsForSubscribe(@Param('userId') userId: number): Promise<UserDto[]> {
    return await this.usersService.getRecommendationsForSubscribe(userId);
  }

  @Post(':ownerId/subscribers/:subscriberId')
  @HttpCode(HttpStatus.NO_CONTENT)
  public async subscribe(@Param() params: SubscriptionParamDto): Promise<void> {
    await this.usersService.subscribe(params.ownerId, params.subscriberId);
  }

  @Delete(':ownerId/subscribers/:subscriberId')
  @HttpCode(HttpStatus.NO_CONTENT)
  public async unsubscribe(@Param() params: SubscriptionParamDto): Promise<void> {
    await this.usersService.unsubscribe(params.ownerId, params.subscriberId);
  }

  @Public()
  @Get('/abilities')
  @HttpCode(HttpStatus.OK)
  public async getUserAbility() {
    const user = await this.usersService.getCurrentUser();
    const abilities = this.caslAbilityFactory.createForUser(user);
    return abilities.rules;
  }
}
