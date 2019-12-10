import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const application = await NestFactory.create(AppModule,
    { logger: console });

  const options = new DocumentBuilder()
    .setTitle('Cars backend')
    .setDescription('The Cars backend documentation')
    .setVersion('1.0')
    .addTag('cars')
    .build();

  const document = SwaggerModule.createDocument(application, options);
  SwaggerModule.setup('api', application, document);

  await application.listen(3000);
}

bootstrap();
