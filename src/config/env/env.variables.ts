import {
  IsEmail,
  IsEnum,
  IsNumber,
  IsNumberString,
  IsString,
  IsUrl,
} from 'class-validator';

enum Environment {
  Development = 'development',
  Production = 'production',
}

export class EnvironmentVariables {
  @IsEnum(Environment)
  NODE_ENV: Environment;

  @IsNumber()
  PORT: number;

  @IsString()
  DB_HOST: string;

  @IsNumberString()
  DB_PORT: number;

  @IsString()
  DB_USERNAME: string;

  @IsString()
  DB_PASSWORD: string;

  @IsString()
  DB_NAME: string;

  @IsString()
  JWT_SECRET: string;

  @IsEnum(['gmail'])
  MAILER_SERVICE: string;

  @IsEmail()
  MAILER_EMAIL: string;

  @IsString()
  MAILER_SECRET_KEY: string;

  @IsUrl()
  WEBSERVICE_URL: string;
}
