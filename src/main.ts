import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  app.setGlobalPrefix('api');

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Mapeia Focos API')
    .setDescription(
      'API do backend do sistema Mapeia Focos para monitoramento, registro e controle de focos de vetores.',
    )
    .setVersion('0.1.0')
    .addTag('Occurrences', 'Registro e acompanhamento de ocorrências e focos')
    .addTag('Media', 'Upload e recuperação de arquivos de mídia vinculados a ocorrências')
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  const port = process.env.PORT ?? 8000;

  await app.listen(port);
}
void bootstrap();
