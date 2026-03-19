import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const swagger = new DocumentBuilder()
    .setTitle('Synple Administration Service')
    .setDescription(
      'The Administration API used to manage resources that are not tools or synthesizers',
    )
    .setVersion('0.0.0')
    .addBearerAuth({
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
      in: 'header',
      name: 'Authorization',
      description: 'enter your JWT bearer token',
    })
    .addSecurityRequirements('bearer')
    .build();
  SwaggerModule.setup('api', app, () =>
    SwaggerModule.createDocument(app, swagger),
  );
  await app.listen(process.env.port ?? 3000);
}
bootstrap();
