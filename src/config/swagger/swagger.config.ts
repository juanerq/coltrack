import { NestFastifyApplication } from '@nestjs/platform-fastify';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { SwaggerTheme } from 'swagger-themes';
import { SwaggerThemeNameEnum } from 'swagger-themes/build/enums/swagger-theme-name';

export function swaggerConfig(app: NestFastifyApplication) {
  const config = new DocumentBuilder()
    .addBearerAuth()
    .setTitle('Coltrack REST Api')
    .setVersion('2024.01.01')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  const theme = new SwaggerTheme();
  const options = {
    explorer: true,
    customCss: theme.getBuffer(SwaggerThemeNameEnum.ONE_DARK),
    swaggerOptions: {
      tagsSorter: 'alpha',
      operationsSorter: 'alpha',
    },
  };
  SwaggerModule.setup('api', app, document, options);
}
