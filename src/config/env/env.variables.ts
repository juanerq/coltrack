import { IsEmail, IsEnum, IsNumber, IsString } from 'class-validator';

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

  @IsNumber()
  DB_PORT: number;

  @IsString()
  DB_USERNAME: string;

  @IsString()
  DB_PASSWORD: string;

  @IsString()
  DB_NAME: string;

  @IsString()
  JWT_SECRET: string;

  @IsEnum(['smtp.gmail.com'])
  MAIL_HOST: string;

  @IsEmail()
  SMTP_EMAIL: string;

  @IsString()
  SMTP_SECRET_KEY: string;

  @IsString()
  WEBSERVICE_URL: string;

  @IsString()
  COOKIE_SECRET: string;
}
