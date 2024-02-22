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
  Res,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCookieAuth,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiNoContentResponse,
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
import { FastifyReply } from 'fastify';
import { Cookies } from 'src/common/decorators/cookies.decorator';
import { CookiesAuth } from './interfaces/cookies-auth.interface';

@ApiTags('1. Autenticación')
@ApiBearerAuth()
@ApiBadRequestResponse({
  description: 'Propiedades invalidas',
  type: GenericResponseDto,
})
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiNoContentResponse({
    description: 'Correo validado',
    type: GenericResponseDto,
  })
  @ApiInternalServerErrorResponse({
    description: 'Correo no encontrado en token',
    type: GenericResponseDto,
  })
  @Get('validate-email')
  @HttpCode(204)
  validateEmail(@Query() { token }: ValidateEmail) {
    return this.authService.validateEmail(token);
  }

  @Auth({ moduleName: 'user' })
  @Post('register')
  @ApiCreatedResponse({
    description: 'Usuario creado exitosamente',
    type: User,
  })
  @ApiNotFoundResponse({
    description: 'Roles no encontrados',
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
  async loginUser(
    @Res({ passthrough: true }) res: FastifyReply,
    @Body() loginUserDto: LoginUserDto,
  ) {
    const { token, refreshToken, user } =
      await this.authService.login(loginUserDto);

    this.setCookie(res, 'refreshToken', refreshToken);

    return {
      ...user,
      token,
    };
  }

  @Post('refresh')
  @ApiCookieAuth('refreshToken')
  @ApiOkResponse({
    description: 'Refrescar token',
    schema: {
      type: 'object',
      properties: {
        token: { type: 'string' },
      },
      example: {
        token:
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6OCwicm9sZXMiOlt7ImlkIjoyLCJuYW1lIjoiVVNFUiIsIm1...',
      },
    },
  })
  @ApiUnauthorizedResponse({
    description: 'Credenciales invalidas',
    type: GenericResponseDto,
  })
  async refresh(
    @Res({ passthrough: true }) res: FastifyReply,
    @Cookies('refreshToken') refreshToken: string,
  ) {
    const { newAccessToken, newRefreshToken } =
      await this.authService.refresh(refreshToken);

    this.setCookie(res, 'refreshToken', newRefreshToken);

    return {
      token: newAccessToken,
    };
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
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.authService.update(id, updateUserDto);
  }

  private setCookie(res: FastifyReply, name: keyof CookiesAuth, value: string) {
    res.setCookie(name, value, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
    });
  }
}
