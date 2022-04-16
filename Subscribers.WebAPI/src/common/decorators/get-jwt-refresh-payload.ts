import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { JwtRefreshPayload } from '../types/jwt-refresh-payload.type';

export const GetJwtRefreshPayload = createParamDecorator((data: string, context: ExecutionContext): JwtRefreshPayload => {
  const request = context.switchToHttp().getRequest();
  const user = request.user as JwtRefreshPayload;
  return data ? user[data] : user;
});