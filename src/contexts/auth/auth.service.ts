import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { LoginUserDto } from './dto/login-user.dto';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './interfaces';
import { RolesService } from '../roles/roles.service';
import { RolePermissions } from '../roles/interfaces/permissions.interface';
import { UpdateUserDto } from './dto';
import { ConfigService } from '@nestjs/config';
import { TypedEventEmitter } from '../../events/event-emitter/typed-event-emitter.class';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
    private readonly roleService: RolesService,
    private readonly configService: ConfigService,
    private readonly eventEmitter: TypedEventEmitter,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const { password, roles, ...userData } = createUserDto;

    const user = this.userRepository.create({
      ...userData,
      isActive: false,
      password: bcrypt.hashSync(password, 10),
    });

    if (roles) {
      const rolesFound = await this.roleService.findAllByIds(roles);
      if (rolesFound.length != roles.length) {
        const rolesNotfound = roles.filter(
          (roleId) => !rolesFound.some((rf) => roleId == rf.id),
        );
        if (rolesNotfound.length)
          throw new NotFoundException(
            `Roles with id ${rolesNotfound.join(', ')} not found`,
          );
      }

      user.roles = rolesFound;
    }

    this.eventEmitter.emit('user.welcome', {
      email: user.email,
      name: user.fullName,
    });

    const confirmation_url = this.getConfirmUrlToken({ email: user.email });

    this.eventEmitter.emit('user.verify-email', {
      email: user.email,
      name: user.fullName,
      confirmation_url,
    });

    await this.userRepository.save(user);

    delete user.password;

    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const { roles, password, ...toUpdate } = updateUserDto;

    const data: Partial<User> = { id, ...toUpdate };

    if (roles) {
      const rolesFound = await this.roleService.findAllByIds(roles);

      if (Array.isArray(roles) && rolesFound.length != roles.length) {
        const rolesNotfound = roles.filter(
          (roleId) => !rolesFound.some((rf) => roleId == rf.id),
        );
        if (rolesNotfound.length)
          throw new NotFoundException(
            `Roles with id ${rolesNotfound.join(', ')} not found`,
          );
      }

      data.roles = rolesFound;
    }

    if (password) {
      data.password = bcrypt.hashSync(password, 10);
    }

    const user = await this.userRepository.preload(data);
    if (!user) throw new NotFoundException(`User with id ${id} not found`);

    await this.userRepository.save(user);

    delete user.password;

    return user;
  }

  async login(loginUserDto: LoginUserDto) {
    const { password, email } = loginUserDto;

    const user = await this.userRepository.findOne({
      where: { email },
      select: { email: true, password: true, id: true },
      relations: {
        roles: true,
      },
    });

    if (!user)
      throw new UnauthorizedException('Credentials are not valid (email)');

    const roles: RolePermissions[] = [];

    if (user.roles) {
      for (const role of user.roles) {
        const permissionsModules = await this.roleService.findOne(role.id);
        roles.push(permissionsModules);
      }
    }

    if (!bcrypt.compareSync(password, user.password))
      throw new UnauthorizedException('Credentials are not valid (password)');

    delete user.password;

    const payload = {
      id: user.id,
      roles,
    };

    return {
      ...user,
      token: this.getJwtToken(payload),
    };
  }

  async validateEmail(token: string) {
    const payload = await this.validateToken(token);

    if (!payload.email)
      throw new InternalServerErrorException('Email not found in token');

    await this.activateUser({ email: payload.email });

    return 'Email validated';
  }

  async activateUser(where: { email: string } | { id: number }) {
    try {
      await this.userRepository.update(where, { isActive: true });
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('Error activating user');
    }
  }

  async validateToken(token: string) {
    try {
      const payload = this.jwtService.verify(token);
      if (!payload) throw new UnauthorizedException('Invalid Token');

      return payload as { email: string };
    } catch (error) {
      throw new UnauthorizedException('Invalid Token');
    }
  }

  private getJwtToken(payload: JwtPayload) {
    return this.jwtService.sign(payload);
  }

  private getConfirmUrlToken({ email }: { email: string }) {
    const token = this.jwtService.sign({ email });

    return `${this.configService.get('WEBSERVICE_URL')}/auth/validate-email?token=${token}`;
  }
}
