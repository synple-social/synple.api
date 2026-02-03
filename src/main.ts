import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { startSwagger } from './utils/startup/startSwagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  startSwagger(app)
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
