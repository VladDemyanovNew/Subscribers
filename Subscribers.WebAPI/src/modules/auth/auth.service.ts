import { ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { User } from '../../common/models/users.model';
import * as bcrypt from 'bcryptjs';
import { isNil } from '@nestjs/common/utils/shared.utils';
import { Tokens } from '../../common/types/tokens.type';
import { JwtPayload } from '../../common/types/jwt-payload.type';
import { JwtRefreshPayload } from '../../common/types/jwt-refresh-payload.type';
import * as argon from 'argon2';

@Injectable()
export class AuthService {

  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
  ) {
  }

  public async signup(userSignupData: User): Promise<Tokens> {
    const doesUserExist = !isNil(await this.userService.findByEmail(userSignupData.email));
    if (doesUserExist) {
      throw new UnauthorizedException(`User with email='${ userSignupData.email }' already exists`);
    }

    const hashPassword = await bcrypt.hash(userSignupData.password, 3);
    const user = await this.userService.create(<User>{
      ...userSignupData,
      password: hashPassword,
    });

    const tokens = await this.generateTokens({
      sub: user.id,
      email: user.email,
      roles: user.roles,
    });
    await this.updateRefreshToken(user.id, tokens.refreshToken);

    return tokens;
  }

  public async signin(userSigninData: User): Promise<Tokens> {
    const user = await this.userService.findByEmail(userSigninData.email);
    if (!user) {
      throw new UnauthorizedException(`User with email='${ userSigninData.email }' is not found`);
    }

    const doesPasswordValid = await bcrypt.compare(userSigninData.password, user.password);
    if (!doesPasswordValid) {
      throw new UnauthorizedException('Password is invalid');
    }

    const tokens = await this.generateTokens({
      sub: user.id,
      email: user.email,
      roles: user.roles,
    });
    await this.updateRefreshToken(user.id, tokens.refreshToken);

    return tokens;
  }

  public async logout(userId: number): Promise<void> {
    const user = await this.userService.findById(userId);
    if (!user) {
      throw new ForbiddenException('User is not found');
    }

    user.refreshToken = null;
    await user.save();
  }

  public async refreshToken(jwtRefreshPayload: JwtRefreshPayload): Promise<Tokens> {
    const user = await this.userService.findById(jwtRefreshPayload.sub);
    if (!user) {
      throw new UnauthorizedException('User is not found');
    }

    const doesRefreshTokenValid = user.refreshToken && await argon.verify(user.refreshToken, jwtRefreshPayload.refreshToken);
    if (!doesRefreshTokenValid) {
      throw new UnauthorizedException('Refresh token is not valid');
    }

    const tokens = await this.generateTokens({
      sub: user.id,
      email: user.email,
      roles: user.roles,
    });
    await this.updateRefreshToken(user.id, tokens.refreshToken);

    return tokens;
  }

  private async generateTokens(jwtPayload: JwtPayload): Promise<Tokens> {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(jwtPayload, {
        secret: process.env.AT_SECRET_KEY,
        expiresIn: process.env.AT_EXPIRES_IN,
      }),
      this.jwtService.signAsync(jwtPayload, {
        secret: process.env.RT_SECRET_KEY,
        expiresIn: process.env.RT_EXPIRES_IN,
      }),
    ]);

    return {
      accessToken: accessToken,
      refreshToken: refreshToken,
    };
  }

  private async updateRefreshToken(userId: number, refreshToken: string): Promise<void> {
    const hashRefreshToken = await argon.hash(refreshToken);
    const user = await this.userService.findById(userId);
    user.refreshToken = hashRefreshToken;
    await user.save();
  }
}
