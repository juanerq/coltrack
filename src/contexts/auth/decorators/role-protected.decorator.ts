import { SetMetadata } from '@nestjs/common';
import { ValidModule } from '../interfaces';

export const META_ROLES = 'roles';

export const RoleProtected = (args?: ValidModule) => {
  return SetMetadata(META_ROLES, args);
};
