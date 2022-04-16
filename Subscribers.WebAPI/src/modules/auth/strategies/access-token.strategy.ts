import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Injectable } from '@nestjs/common';
import { JwtPayload } from '../../../common/types/jwt-payload.type';

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(Strategy, 'jwt') {

  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.AT_SECRET_KEY,
    });
  }

  public validate(payload: JwtPayload): JwtPayload {
    return payload;
  }
}