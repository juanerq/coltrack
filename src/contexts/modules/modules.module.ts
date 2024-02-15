import { Module } from '@nestjs/common';
import { ModulesService } from './modules.service';
import { ModulesController } from './modules.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module as ModuleEntity } from './entities/module.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  controllers: [ModulesController],
  imports: [TypeOrmModule.forFeature([ModuleEntity]), AuthModule],
  providers: [ModulesService],
  exports: [ModulesService],
})
export class ModulesModule {}
