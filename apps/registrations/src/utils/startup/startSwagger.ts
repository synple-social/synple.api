import { INestApplication } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

export function startSwagger(app: INestApplication) {
  const config = new DocumentBuilder()
    .setTitle('Synple Registration Service')
    .setDescription('The registration API used to create user accounts on the Synple application suite')
    .setVersion('0.1.0')
    .build();
  SwaggerModule.setup('api', app, () => SwaggerModule.createDocument(app, config));
}