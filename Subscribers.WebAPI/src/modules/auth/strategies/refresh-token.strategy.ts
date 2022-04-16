import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ForbiddenException, Injectable } from '@nestjs/common';
import { Request } from 'express';
import { JwtRefreshPayload } from '../../../common/types/jwt-refresh-payload.type';
import { JwtPayload } from '../../../common/types/jwt-payload.type';

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {

  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.SECRET_KEY,
      passReqToCallback: true,
    });
  }

  public validate(request: Request, payload: JwtPayload): JwtRefreshPayload {
    const refreshToken = request.get('authorization')
      .replace('Bearer', '')
      .trim();

    if (!refreshToken) {
      throw new ForbiddenException('Refresh token error');
    }

    return {
      ...payload,
      refreshToken: refreshToken,
    };
  }
}