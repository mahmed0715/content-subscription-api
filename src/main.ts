import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { main as seedDatabase } from '../prisma/seed';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable Global Validation Pipes
  app.useGlobalPipes(
    new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }),
  );

  // Setup Swagger
  const config = new DocumentBuilder()
    .setTitle('Content Subscription API')
    .setDescription(
      'API for managing user subscriptions and content recommendations',
    )
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);
  await seedDatabase(); // Run the seeder
  await app.listen(3000);
}

bootstrap();
