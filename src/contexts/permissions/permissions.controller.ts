import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  HttpCode,
} from '@nestjs/common';
import { PermissionsService } from './permissions.service';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Permission } from './entities/permission.entity';

import { Auth } from '../auth/decorators';
import { GenericResponseDto } from 'src/common/dtos/generic-response.dto';

@ApiTags('4. Permisos')
@ApiBearerAuth()
@Auth({ moduleName: 'permisos' })
@Controller('permissions')
export class PermissionsController {
  constructor(private readonly permissionsService: PermissionsService) {}

  @Post()
  @ApiCreatedResponse({
    description: 'El permiso ha sido creado exitosamente',
    type: Permission,
  })
  @ApiConflictResponse({
    description: 'El permiso ya existe',
    type: GenericResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Propiedades invalidas',
    type: GenericResponseDto,
  })
  create(@Body() createPermissionDto: CreatePermissionDto) {
    return this.permissionsService.create(createPermissionDto);
  }

  @Get()
  @ApiOkResponse({ description: 'Lista de permisos', type: [Permission] })
  findAll() {
    return this.permissionsService.findAll();
  }

  @Get('types')
  @ApiOkResponse({ description: 'Lista de tipos de permisos', type: [String] })
  getPermissionTypes() {
    return this.permissionsService.getPermissionTypes();
  }

  @Patch(':id')
  @ApiOkResponse({
    description: 'El permiso ha sido actualizado exitosamente',
    type: Permission,
  })
  @ApiConflictResponse({
    description: 'El permiso ya existe',
    type: GenericResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Propiedades invalidas',
    type: GenericResponseDto,
  })
  @ApiNotFoundResponse({
    description: 'Permiso no encontrado',
    type: GenericResponseDto,
  })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePermissionDto: UpdatePermissionDto,
  ) {
    return this.permissionsService.update(id, updatePermissionDto);
  }

  @Delete(':id')
  @HttpCode(204)
  @ApiNoContentResponse({
    description: 'El permiso ha sido eliminado exitosamente',
  })
  @ApiNotFoundResponse({
    description: 'Permiso no encontrado',
    type: GenericResponseDto,
  })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.permissionsService.remove(id);
  }
}
