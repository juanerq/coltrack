import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNumber,
  IsPositive,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    example: 'User test',
    description: 'Nombre del usuario',
    minLength: 4,
  })
  @IsString()
  @MinLength(4)
  fullName: string;

  @ApiProperty({
    example: 'test@gmail.com',
    description: 'Correo del usuario',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'Ju@n1004870915',
    description: 'Contraseña del usuario',
    minLength: 6,
    maxLength: 50,
  })
  @IsString()
  @MinLength(6)
  @MaxLength(50)
  @Matches(/(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message:
      'The password must have a Uppercase, lowercase letter and a number',
  })
  password: string;

  @ApiProperty({
    example: [1, 2],
    description: 'Ids de roles del usuario',
  })
  @IsNumber({}, { each: true })
  @IsPositive({ each: true })
  roles: number[];

  @ApiProperty({
    example: true,
    default: true,
    required: false,
  })
  isActive: boolean;
}
