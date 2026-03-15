import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { initializeSwagger } from '@synple/utils';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  initializeSwagger(
    app,
    'Synple API',
    'The API used to created, read, update or delete elements mainly linked to synthesizers and module templates',
    '0.0.0'
  )
  await app.listen(process.env.port ?? 3000);
}
bootstrap();
