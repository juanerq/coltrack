import { HttpStatus } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';

export class GenericResponseDto<T> {
  @ApiProperty({
    examples: [400, 401, 500],
  })
  statusCode: HttpStatus;

  @ApiProperty({
    description: 'Tipo de error',
    examples: ['Bad Request', 'Internal Server Error', 'Unauthorized'],
  })
  error: string | null;

  @ApiProperty({
    examples: ['Record with 1 not found', 'Record already exists'],
  })
  message?: string | string[];

  data: T;
}
