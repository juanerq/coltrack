import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { validateEnvironment } from './config/env/env.validation';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmConfigService } from './config/database/typeorm.config';
import { RolesModule } from './contexts/roles/roles.module';
import { AuthModule } from './contexts/auth/auth.module';
import { ModulesModule } from './contexts/modules/modules.module';
import { PermissionsModule } from './contexts/permissions/permissions.module';
import { EmailModule } from './contexts/email/email.module';
import { EventEmitterModule } from '@nestjs/event-emitter';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      validate: validateEnvironment,
    }),
    TypeOrmModule.forRootAsync({
      useClass: TypeOrmConfigService,
    }),
    RolesModule,
    AuthModule,
    ModulesModule,
    PermissionsModule,
    EmailModule,
    EventEmitterModule.forRoot(),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
