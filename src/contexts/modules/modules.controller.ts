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
import { ModulesService } from './modules.service';
import { CreateModuleDto } from './dto/create-module.dto';
import { UpdateModuleDto } from './dto/update-module.dto';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Module } from './entities/module.entity';

import { Auth } from '../auth/decorators';

@ApiTags('3 Modulos')
@ApiBearerAuth()
@Auth({ moduleName: 'modulos' })
@Controller('modules')
export class ModulesController {
  constructor(private readonly modulesService: ModulesService) {}

  @Post()
  @ApiCreatedResponse({
    description: 'El modulo ha sido creado exitosamente',
    type: Module,
  })
  @ApiNoContentResponse({
    description: 'El modulo ya existe',
  })
  @ApiBadRequestResponse({
    description: 'Propiedades invalidas',
  })
  create(@Body() createModuleDto: CreateModuleDto) {
    return this.modulesService.create(createModuleDto);
  }

  @Get()
  @ApiResponse({ status: 200, description: 'Lista de modulos', type: [Module] })
  findAll() {
    return this.modulesService.findAll();
  }

  @Patch(':id')
  @ApiOkResponse({
    description: 'El modulo ha sido creado exitosamente',
    type: Module,
  })
  @ApiBadRequestResponse({
    description: 'Propiedades invalidas',
  })
  @ApiNotFoundResponse({
    description: 'Modulo no encontrado',
  })
  @ApiNoContentResponse({
    description: 'El modulo ya existe',
  })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateModuleDto: UpdateModuleDto,
  ) {
    return this.modulesService.update(id, updateModuleDto);
  }

  @Delete(':id')
  @HttpCode(204)
  @ApiNoContentResponse({
    description: 'El modulo ha sido eliminado exitosamente',
  })
  @ApiNotFoundResponse({
    description: 'Modulo no encontrado',
  })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.modulesService.remove(id);
  }
}
