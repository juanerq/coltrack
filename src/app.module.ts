import { Module } from '@nestjs/common';
import { RolesModule } from './contexts/roles/roles.module';

@Module({
  imports: [RolesModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
