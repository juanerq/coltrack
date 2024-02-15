import { IsEnum, IsString, MinLength } from 'class-validator';
import { PermissionType } from '../entities/permission.entity';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePermissionDto {
  @ApiProperty({
    example: 'Crear',
    description: 'Nombre del permiso',
    minLength: 3,
  })
  @IsString()
  @MinLength(3)
  name: string;

  @ApiProperty({
    example: 'POST',
    description: 'Tipo de permiso',
    enum: PermissionType,
    uniqueItems: true,
  })
  @IsEnum(PermissionType)
  type: PermissionType;
}
