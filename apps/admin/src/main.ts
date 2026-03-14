import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { initializeSwagger } from '@synple/utils';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  initializeSwagger(
    app,
    'Synple Administration Service',
    'The Administration API used to manage resources that are not tools or synthesizers',
  );
  await app.listen(process.env.port ?? 3000);
}
bootstrap();
