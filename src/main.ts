import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { join } from 'path';
import * as express from 'express';

async function bootstrap() {
   
   const app = await NestFactory.create(AppModule);    
   // Global validation pipe
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: true,
      }),
    );

  // Swagger setup
    const config = new DocumentBuilder()
      .setTitle('ChatApp API')
      .setDescription('ChatApp Backend API Documentation')
      .setVersion('1.0')
      .addTag('chat')
      .addBearerAuth()
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document, {
      swaggerOptions: {
        persistAuthorization: true,
      },
    });


    app.use('/chat', express.static(join(__dirname, '../../', 'public')));
    const port = process.env.PORT ? parseInt(process.env.PORT) : 3000;
    await app.listen(port);
   
   // console.log(`Starting server on port: ${port}`);
    console.log(`🚀 Server running at http://localhost:${port}/chat/index.html`);
}

bootstrap();
