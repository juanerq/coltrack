import { Module } from '@nestjs/common';
import { PermissionsService } from './permissions.service';
import { PermissionsController } from './permissions.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Permission } from './entities/permission.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  controllers: [PermissionsController],
  imports: [TypeOrmModule.forFeature([Permission]), AuthModule],
  providers: [PermissionsService],
  exports: [TypeOrmModule, PermissionsService],
})
export class PermissionsModule {}
