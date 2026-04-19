import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { initializeSwagger } from '@synple/utils';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  initializeSwagger(
    app,
    'Synple Public API',
    'This API regroups endpoints accessible by anonymous user, without any need for signing in with an account',
  );
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
