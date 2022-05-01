import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { User } from '../../common/models/users.model';
import { InjectModel } from '@nestjs/sequelize';
import { RolesService } from '../roles/roles.service';
import { RoleName } from '../../common/enums/role-name';
import { Role } from '../../common/models/roles.model';
import { isNil } from '@nestjs/common/utils/shared.utils';
import { Subscription } from '../../common/models/subscriptions.model';
import { Sequelize } from 'sequelize-typescript';
import { UserDto } from '../../common/dtos/user.dto';
import { Queries } from '../../common/sql/queries';
import { parseUserToDto } from '../../common/helpers/user.helper';
import { QueryTypes } from 'sequelize';
import { getNRandomElements } from '../../common/helpers/array.helper';

@Injectable()
export class UsersService {

  constructor(
    @InjectModel(User)
    private userModel: typeof User,
    @InjectModel(Subscription)
    private subscriptionsModel: typeof Subscription,
    private roleService: RolesService,
    private sequelize: Sequelize,
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
    return await this.userModel.findAll({ include: [Role, Subscription] })
  }

  public async getUserSubscriptions(userId: number): Promise<UserDto[]> {
    const queryResult = await this.sequelize.query(Queries.GetUserSubscriptions, {
      replacements: { userId: userId },
      type: QueryTypes.SELECT,
    });
    return queryResult.map(rawUser => parseUserToDto(rawUser as User));
  }

  public async getRecommendationsForSubscribe(userId: number): Promise<UserDto[]> {
    const queryResult = await this.sequelize.query(Queries.GetRecommendationsForSubscribe, {
      replacements: { userId: userId },
      type: QueryTypes.SELECT,
    });
    const rawResultSet = queryResult.map(rawUser => parseUserToDto(rawUser as User));
    const resultLength = 7;
    return getNRandomElements<UserDto>(rawResultSet, resultLength);
  }

  public async findByEmail(email: string): Promise<User> {
    return await this.userModel.findOne({ where: { email: email }, include: { all: true } });
  }

  public async findById(userId: number): Promise<User> {
    return await this.userModel.findOne({ where: { id: userId }, include: { all: true } });
  }

  public async subscribe(ownerId: number, subscriberId: number): Promise<void> {
    const doesOwnerExist = !isNil(await this.findById(ownerId));
    if (!doesOwnerExist) {
      throw new HttpException(
        `Unable to subscribe on user with id=${ ownerId }, ` +
        `because it doesn't exist`,
        HttpStatus.BAD_REQUEST,
      );
    }

    const doesSubscriberExist = !isNil(await this.findById(subscriberId));
    if (!doesSubscriberExist) {
      throw new HttpException(
        `Unable to subscribe user with id=${ subscriberId }, ` +
        `because it doesn't exist`,
        HttpStatus.BAD_REQUEST,
      );
    }

    const hasUserAlreadySubscribed = !isNil(await this.subscriptionsModel.findOne({
      where: {
        subscriberId: subscriberId,
        ownerId: ownerId,
      },
    }));
    if (hasUserAlreadySubscribed) {
      throw new HttpException(
        `Unable to subscribe on user with id=${ ownerId }, ` +
        `because the subscription already exists`,
        HttpStatus.BAD_REQUEST,
      );
    }

    await this.subscriptionsModel.create({ ownerId: ownerId, subscriberId: subscriberId });
  }

  public async unsubscribe(ownerId: number, subscriberId: number): Promise<void> {
    const doesOwnerExist = !isNil(await this.findById(ownerId));
    if (!doesOwnerExist) {
      throw new HttpException(
        `Unable to unsubscribe from user with id=${ ownerId }, ` +
        `because it doesn't exist`,
        HttpStatus.BAD_REQUEST,
      );
    }

    const doesSubscriberExist = !isNil(await this.findById(subscriberId));
    if (!doesSubscriberExist) {
      throw new HttpException(
        `Unable to unsubscribe user with id=${ subscriberId }, ` +
        `because it doesn't exist`,
        HttpStatus.BAD_REQUEST,
      );
    }

    const isUserSubscribed = !isNil(await this.subscriptionsModel.findOne({
      where: {
        subscriberId: subscriberId,
        ownerId: ownerId,
      },
    }));
    if (!isUserSubscribed) {
      throw new HttpException(
        `Unable to unsubscribe from user with id=${ ownerId }, ` +
        `because the subscription not exists`,
        HttpStatus.BAD_REQUEST,
      );
    }

    await this.subscriptionsModel.destroy({ where: { subscriberId: subscriberId, ownerId: ownerId } });
  }
}
