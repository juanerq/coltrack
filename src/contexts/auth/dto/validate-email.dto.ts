import { IsJWT } from 'class-validator';

export class ValidateEmail {
  @IsJWT()
  token: string;
}
