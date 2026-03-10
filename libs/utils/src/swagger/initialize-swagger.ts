import { INestApplication } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

export function initializeSwagger(
  app: INestApplication,
  title,
  description,
  version = '1.0.0',
) {
  const config = new DocumentBuilder()
    .setTitle(title)
    .setDescription(description)
    .setVersion(version)
    .build();
  SwaggerModule.setup('api', app, () =>
    SwaggerModule.createDocument(app, config),
  );
}
