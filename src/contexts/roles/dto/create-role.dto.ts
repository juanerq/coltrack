import { ApiProperty } from "@nestjs/swagger";
import { IsString, MinLength } from "class-validator";

export class CreateRoleDto {
  @ApiProperty({
    example: 'ADMIN',
    description: 'Nombre del rol',
    required: true,
    minLength: 3,
  })
  @IsString()
  @MinLength(3)
  name: string;
}
