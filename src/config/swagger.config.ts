import { DocumentBuilder } from '@nestjs/swagger';

export const swaggerConfig = new DocumentBuilder()
  .setTitle('CRUD App')
  .setDescription('The users/posts CRUD API description')
  .setVersion('1.0')
  .addBearerAuth(
    {
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
      name: 'JWT',
      description: 'Enter JWT token',
      in: 'header',
    },
    'jwt',
  )
  .addBearerAuth(
    {
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
      name: 'JWT-REFRESH',
      description: 'Enter JWT-REFRESH token',
      in: 'header',
    },
    'jwt-refresh',
  )
  .addTag('auth', 'Authentication endpoints')
  .addTag('users', 'User operations')
  .addTag('posts', 'Post operations')
  .build();
