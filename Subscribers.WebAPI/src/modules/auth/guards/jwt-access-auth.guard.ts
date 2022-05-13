import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { ROLES_KEY } from '../../../common/decorators/roles.decorator';
import { JwtPayload } from '../../../common/types/jwt-payload.type';
import { RoleName } from '../../../common/enums/role-name';
import { JwtService } from '@nestjs/jwt';
import { IS_PUBLIC_KEY } from '../../../common/decorators/public.decorator';

@Injectable()
export class JwtAccessAuthGuard extends AuthGuard('jwt') {

  constructor(
    private reflector: Reflector,
    private jwtService: JwtService,
  ) {
    super();
  }

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }

    const requiredRoles = this.reflector.getAllAndOverride<RoleName[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    const canActivate = (await super.canActivate(context)) as boolean;
    if (!requiredRoles || !canActivate) {
      return canActivate;
    }

    const request = context.switchToHttp().getRequest();
    const token = request.get('authorization')
      .replace('Bearer', '')
      .trim();
    const payload = this.jwtService.verify(token, {
      secret: process.env.AT_SECRET_KEY,
    }) as JwtPayload;

    const doRolesValid = payload.roles.some(role => requiredRoles.includes(role.name as RoleName))
    return doRolesValid && canActivate;
  }
}
