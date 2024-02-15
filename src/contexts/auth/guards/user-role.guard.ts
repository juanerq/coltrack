import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { META_ROLES } from '../decorators/role-protected.decorator';
import { User } from '../entities/user.entity';
import { RolePermissions } from '../../roles/interfaces/permissions.interface';
import { ValidModule } from '../interfaces';
import { PermissionType } from '../../permissions/entities/permission.entity';

@Injectable()
export class UserRoleGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const validModule: ValidModule = this.reflector.getAllAndMerge(META_ROLES, [
      context.getHandler(),
      context.getClass(),
    ]);

    const req = context.switchToHttp().getRequest();

    const { user, roles } = req.user as {
      user: User;
      roles: RolePermissions[];
    };

    if (!user) throw new BadRequestException('User not found');

    const {
      route: { path, stack },
    } = req;
    const [layer] = stack;
    const { method }: { method: string } = layer;

    const module = path.split('/')[1];
    if (!validModule) validModule.moduleName = module;
    const { moduleName } = validModule;

    const validPermissions = this.checkRolePermissions(roles, {
      moduleName,
      method: method.toUpperCase(),
    });

    if (validPermissions) return true;

    throw new ForbiddenException(
      `User ${user.fullName} is not allowed to make the ${method.toUpperCase()} request in the [${validModule.moduleName}] module.`,
    );
  }

  private checkRolePermissions(
    rolePermissions: RolePermissions[],
    routePermissions: { moduleName: string; method: string },
  ): boolean {
    const { moduleName, method } = routePermissions;

    for (const role of rolePermissions) {
      for (const module of role.modules) {
        if (
          module.detail === moduleName ||
          module.detail === PermissionType.ALL.toLowerCase()
        ) {
          for (const permission of module.permissions) {
            if (
              permission.type === method ||
              permission.type === PermissionType.ALL
            )
              return true;
          }
        }
      }
    }
    return false;
  }
}
