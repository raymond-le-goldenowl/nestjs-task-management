import { AppModule } from './app.module';
import { NestFactory } from '@nestjs/core';
import { Logger, ValidationPipe } from '@nestjs/common';
import { TransformInterceptor } from './tasks/transform.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const logger = new Logger();
  const port = process.env.PORT || 3000;

  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalInterceptors(new TransformInterceptor());

  // listen app
  await app.listen(port);

  logger.log(`Application listening on port ${port}`);
}

bootstrap();
