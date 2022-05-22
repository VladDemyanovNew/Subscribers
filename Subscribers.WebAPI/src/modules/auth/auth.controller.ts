import { Body, Controller, HttpCode, HttpStatus, Post, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { AuthService } from './auth.service';
import { User } from '../../common/models/users.model';
import { Tokens } from '../../common/types/tokens.type';
import { GetJwtAccessPayload } from '../../common/decorators/access-token.decorator';
import { JwtPayload } from '../../common/types/jwt-payload.type';
import { GetJwtRefreshPayload } from '../../common/decorators/refresh-token.decorator';
import { JwtRefreshPayload } from '../../common/types/jwt-refresh-payload.type';
import { JwtAccessAuthGuard } from './guards/jwt-access-auth.guard';
import { JwtRefreshAuthGuard } from './guards/jwt-refresh-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';
import { Public } from '../../common/decorators/public.decorator';

@Controller('auth')
export class AuthController {

  constructor(private authService: AuthService) {
  }

  @Public()
  @Post('/signin')
  @HttpCode(HttpStatus.OK)
  public async signin(@Body() authSigninData: User): Promise<Tokens> {
    return await this.authService.signin(authSigninData);
  }

  @Public()
  @Post('/signup')
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(FileInterceptor('avatar'))
  public async signup(
    @Body() authSignupData: User,
    @UploadedFile() avatar: Express.Multer.File | undefined,
  ): Promise<Tokens> {
    return await this.authService.signup(authSignupData, avatar);
  }

  @Post('/logout')
  @HttpCode(HttpStatus.OK)
  public async logout(@GetJwtAccessPayload() jwtPayload: JwtPayload): Promise<void> {
    console.log(jwtPayload);
    await this.authService.logout(jwtPayload.sub);
  }

  @Public()
  @UseGuards(JwtRefreshAuthGuard)
  @Post('/refresh')
  @HttpCode(HttpStatus.OK)
  public async refreshToken(@GetJwtRefreshPayload() jwtRefreshPayload: JwtRefreshPayload): Promise<Tokens> {
    return await this.authService.refreshToken(jwtRefreshPayload);
  }
}
