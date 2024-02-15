import {
  Controller,
  Post,
  Body,
  Patch,
  Param,
  ParseIntPipe,
  HttpCode,
  Get,
  Query,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import { UpdateUserDto, LoginUserDto, CreateUserDto } from './dto';
import { User } from './entities/user.entity';
import { AuthService } from './auth.service';
import { Auth } from './decorators';
import { ValidateEmail } from './dto/validate-email.dto';
import { GenericResponseDto } from 'src/common/dtos/generic-response.dto';
import { LoginResponse } from './dto/login-response.dto';

@ApiTags('1. Autenticación')
@ApiBearerAuth()
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiCreatedResponse({
    description: 'Correo validado',
    type: ValidateEmail,
  })
  @Get('validate-email')
  validateEmail(@Query() { token }: ValidateEmail) {
    return this.authService.validateEmail(token);
  }

  //@Auth({ moduleName: 'user' })
  @Post('register')
  @ApiCreatedResponse({
    description: 'Usuario creado exitosamente',
    type: User,
  })
  @ApiNotFoundResponse({
    description: 'Roles no encontrados',
    type: GenericResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Propiedades invalidas',
    type: GenericResponseDto,
  })
  create(@Body() createUserDto: CreateUserDto) {
    return this.authService.create(createUserDto);
  }

  @Post('login')
  @HttpCode(200)
  @ApiOkResponse({ description: 'Login realizado', type: LoginResponse })
  @ApiUnauthorizedResponse({
    description: 'Credenciales invalidas',
    type: GenericResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Propiedades invalidas',
    type: GenericResponseDto,
  })
  loginUser(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }

  @Auth({ moduleName: 'user' })
  @Patch(':id')
  @ApiOkResponse({
    description: 'Usuario actualizado exitosamente',
    type: User,
  })
  @ApiNotFoundResponse({
    description: 'Roles no encontrados | Usuario no encontrado',
    type: GenericResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Propiedades invalidas',
    type: GenericResponseDto,
  })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.authService.update(id, updateUserDto);
  }
}
