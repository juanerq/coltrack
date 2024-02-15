import { UseGuards, applyDecorators } from '@nestjs/common';
import { RoleProtected } from './role-protected.decorator';
import { AuthGuard } from '@nestjs/passport';
import { UserRoleGuard } from '../guards/user-role.guard';
import { ValidModule } from '../interfaces';

export function Auth(args?: ValidModule) {
  return applyDecorators(
    RoleProtected(args),
    UseGuards(AuthGuard(), UserRoleGuard),
  );
}
