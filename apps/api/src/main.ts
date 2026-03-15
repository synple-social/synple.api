import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const swagger = new DocumentBuilder()
    .setTitle('Synple API')
    .setDescription('The API used to created, read, update or delete elements mainly linked to synthesizers and module templates')
    .setVersion('0.0.0')
    .addBearerAuth({
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
      in: 'header',
      name: 'Authorization',
      description: 'enter your JWT bearer token'
    })
    .addSecurityRequirements('bearer')
    .build()
  SwaggerModule.setup('api', app, () =>
    SwaggerModule.createDocument(app, swagger),
  );
  await app.listen(process.env.port ?? 3000);
}
bootstrap();
