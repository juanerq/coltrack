import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  Query,
  HttpCode,
} from '@nestjs/common';
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { AddPermissionsRoleDto } from './dto/add-permissions-role.dto';
import { RemovePermissionsRoleDto } from './dto/remove-permissions-role.dto';
import { Auth } from '../auth/decorators';
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
import { Role, RolesPermissions } from './entities';
import { GenericResponseDto } from 'src/common/dtos/generic-response.dto';

@ApiTags('2. Roles')
@ApiBearerAuth()
@Auth({ moduleName: 'roles' })
@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Post()
  @ApiCreatedResponse({
    description: 'El rol ha sido creado exitosamente',
    type: Role,
  })
  @ApiConflictResponse({
    description: 'El rol ya existe',
    type: GenericResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Propiedades invalidas',
    type: GenericResponseDto,
  })
  create(@Body() createRoleDto: CreateRoleDto) {
    return this.rolesService.create(createRoleDto);
  }

  @Get()
  @ApiOkResponse({ description: 'Lista de roles', type: [Role] })
  findAll() {
    return this.rolesService.findAll();
  }

  @Get(':id')
  @ApiOkResponse({ description: 'rol', type: Role })
  @ApiNotFoundResponse({
    description: 'Rol no encontrado',
    type: GenericResponseDto,
  })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.rolesService.findOne(id);
  }

  @Patch(':id')
  @ApiOkResponse({
    description: 'El rol ha sido actualizado exitosamente',
    type: Role,
  })
  @ApiConflictResponse({
    description: 'El rol ya existe',
    type: GenericResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Propiedades invalidas',
    type: GenericResponseDto,
  })
  @ApiNotFoundResponse({
    description: 'Rol no encontrado',
    type: GenericResponseDto,
  })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateRoleDto: UpdateRoleDto,
  ) {
    return this.rolesService.update(id, updateRoleDto);
  }

  @Delete(':id')
  @HttpCode(204)
  @ApiNoContentResponse({
    description: 'El rol ha sido eliminado exitosamente',
  })
  @ApiNotFoundResponse({
    description: 'Rol no encontrado',
    type: GenericResponseDto,
  })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.rolesService.remove(id);
  }

  @Post('/permissions/:id')
  @ApiCreatedResponse({
    description: 'Permiso agregado al rol',
    type: RolesPermissions,
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
    description: 'Rol, Modulo o Permiso no encontrado',
    type: GenericResponseDto,
  })
  addPermissions(
    @Param('id', ParseIntPipe) id: number,
    @Body() addPermissionsRoleDto: AddPermissionsRoleDto,
  ) {
    return this.rolesService.addPermission(id, addPermissionsRoleDto);
  }

  @Delete('/permissions/:id')
  @HttpCode(204)
  @ApiNoContentResponse({
    description: 'El permiso del rol ha sido eliminado exitosamente',
  })
  @ApiNotFoundResponse({
    description: 'Rol, Modulo o Permiso no encontrado',
    type: GenericResponseDto,
  })
  removePermissions(
    @Param('id', ParseIntPipe) id: number,
    @Query() removePermissionsRoleDto: RemovePermissionsRoleDto,
  ) {
    return this.rolesService.removePermission(id, removePermissionsRoleDto);
  }
}
