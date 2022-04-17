import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { JwtPayload } from '../types/jwt-payload.type';

export const GetJwtAccessPayload = createParamDecorator((data: string, context: ExecutionContext): JwtPayload => {
  const request = context.switchToHttp().getRequest();
  const user = request.user as JwtPayload;
  return data ? user[data] : user;
});