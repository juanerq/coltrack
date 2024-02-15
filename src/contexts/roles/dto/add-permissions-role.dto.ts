import { ApiProperty } from "@nestjs/swagger"
import { IsNumber, IsPositive } from "class-validator"

export class AddPermissionsRoleDto {
  @ApiProperty({
    description: 'Id del modulo',
    example: 1,
    required: true,
  })
  @IsNumber()
  @IsPositive()
  moduleId: number

  @ApiProperty({
    description: 'Id del permiso',
    example: 1,
    required: true,
  })
  @IsNumber()
  @IsPositive()
  permissionId: number
}