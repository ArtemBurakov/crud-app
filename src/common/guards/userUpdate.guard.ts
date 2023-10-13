import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';

@Injectable()
export class UserUpdateGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const userFromJwt = request.user;
    const routeId = +request.params.id;

    if (userFromJwt.role === 'admin') return true;

    if (userFromJwt.sub === routeId) return true;

    return false;
  }
}
