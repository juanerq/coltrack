import { ApiProperty } from "@nestjs/swagger"
import { Transform } from "class-transformer"
import { IsNumber, IsOptional, IsPositive } from "class-validator"

export class RemovePermissionsRoleDto {
  @ApiProperty({
    example: 1,
    description: 'Id del modulo',
    required: true
  })
  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  @IsPositive()
  moduleId: number

  @ApiProperty({
    example: 2,
    description: 'Id del permiso',
    required: false
  })
  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  @IsPositive()
  @IsOptional()
  permissionId?: number
}