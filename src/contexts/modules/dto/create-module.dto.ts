import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, MinLength } from 'class-validator';

export class CreateModuleDto {
  @ApiProperty({
    description: 'Nombre del modulo',
    example: 'Modulo Ejemplo',
    minLength: 3,
    required: true,
  })
  @IsString()
  @MinLength(3)
  name: string;

  @ApiProperty({
    description: 'Detalle del modulo',
    example: null,
    required: false,
  })
  @IsString()
  @IsOptional()
  detail: string;
}
