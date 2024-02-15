import { Module, forwardRef } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategies/jwt.strategy';
import { RolesModule } from '../roles/roles.module';
import { TypedEventEmitter } from '../../events/event-emitter/typed-event-emitter.class';

@Module({
  controllers: [AuthController],
  imports: [
    TypeOrmModule.forFeature([User]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: {
          expiresIn: '2h',
        },
      }),
    }),
    forwardRef(() => RolesModule),
  ],
  providers: [AuthService, JwtStrategy, ConfigService, TypedEventEmitter],
  exports: [
    TypeOrmModule,
    JwtStrategy,
    PassportModule,
    JwtModule,
    ConfigService,
  ],
})
export class AuthModule {}
