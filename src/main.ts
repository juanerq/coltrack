import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { QueryExceptionFilter } from './common/filters/query-exception.filter';
import { swaggerConfig } from './config/swagger/swagger.config';
import fastifyCookie from '@fastify/cookie';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );

  const configService = app.get(ConfigService);

  await app.register(fastifyCookie as any, {
    secret: configService.get('COOKIE_SECRET'),
  });

  app.setGlobalPrefix('api');

  app.useGlobalFilters(new HttpExceptionFilter(), new QueryExceptionFilter());
  app.useGlobalInterceptors(new TransformInterceptor());

  const port = configService.get('PORT');

  swaggerConfig(app);

  await app.listen(port);
}
bootstrap();
