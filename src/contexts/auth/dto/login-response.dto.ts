import { ApiProperty } from '@nestjs/swagger';
import { Role } from '../../roles/entities';

export class LoginResponse {
  @ApiProperty({
    example: 1,
    description: 'Id del usuario',
    uniqueItems: true,
  })
  id: number;

  @ApiProperty({
    example: 'user@test.com',
    description: 'Correo del usuario',
  })
  email: string;

  @ApiProperty({
    type: () => [Role],
  })
  roles: Role[];

  @ApiProperty({
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6OCwicm9sZXMiOlt7ImlkIjoyLCJuYW1lIjoiVVNFUiIsIm1...',
  })
  token: string;
}
