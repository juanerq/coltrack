import { Module, forwardRef } from '@nestjs/common';
import { RolesService } from './roles.service';
import { RolesController } from './roles.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from './entities/role.entity';
import { RolesPermissions } from './entities/roles_permission.entity';
import { PermissionsModule } from '../permissions/permissions.module';
import { ModulesModule } from '../modules/modules.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  controllers: [RolesController],
  providers: [RolesService],
  imports: [
    forwardRef(() => AuthModule),
    TypeOrmModule.forFeature([Role, RolesPermissions]),
    PermissionsModule,
    ModulesModule,
  ],
  exports: [TypeOrmModule, RolesService],
})
export class RolesModule {}
