import { Body, Controller, Delete, HttpCode, HttpStatus, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { User } from '../../common/models/users.model';
import { Tokens } from '../../common/types/tokens.type';
import { AuthGuard } from '@nestjs/passport';
import { GetJwtAccessPayload } from '../../common/decorators/get-jwt-access-payload';
import { JwtPayload } from '../../common/types/jwt-payload.type';
import { GetJwtRefreshPayload } from '../../common/decorators/get-jwt-refresh-payload';
import { JwtRefreshPayload } from '../../common/types/jwt-refresh-payload.type';
import { JwtAccessAuthGuard } from './guards/jwt-access-auth.guard';
import { JwtRefreshAuthGuard } from './guards/jwt-refresh-auth.guard';

@Controller('auth')
export class AuthController {

  constructor(private authService: AuthService) {
  }

  @Post('/signin')
  @HttpCode(HttpStatus.OK)
  public async signin(@Body() authSigninData: User): Promise<Tokens> {
    return await this.authService.signin(authSigninData);
  }

  @Post('/signup')
  @HttpCode(HttpStatus.CREATED)
  public async signup(@Body() authSignupData: User): Promise<Tokens> {
    return await this.authService.signup(authSignupData);
  }

  @UseGuards(JwtAccessAuthGuard)
  @Post('/logout')
  @HttpCode(HttpStatus.OK)
  public async logout(@GetJwtAccessPayload() jwtPayload: JwtPayload): Promise<void> {
    await this.authService.logout(jwtPayload.sub);
  }

  @UseGuards(JwtRefreshAuthGuard)
  @Post('/refresh')
  @HttpCode(HttpStatus.OK)
  public async refreshToken(@GetJwtRefreshPayload() jwtRefreshPayload: JwtRefreshPayload): Promise<Tokens> {
    return await this.authService.refreshToken(jwtRefreshPayload);
  }
}
