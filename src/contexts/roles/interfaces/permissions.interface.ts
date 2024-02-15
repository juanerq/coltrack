import { Permission } from '../../permissions/entities/permission.entity';

export interface RolePermissions {
  id: number;
  name: string;
  modules: RolePermissionsModule[];
}

export interface RolePermissionsModule {
  id: number;
  name: string;
  detail: string;
  permissions: Permission[];
}
