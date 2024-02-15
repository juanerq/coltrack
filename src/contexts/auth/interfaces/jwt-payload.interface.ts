import { RolePermissions } from '../../roles/interfaces/permissions.interface';

export interface JwtPayload {
  id: number;
  roles: RolePermissions[];
}
