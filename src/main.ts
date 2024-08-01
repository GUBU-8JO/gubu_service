import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const port = configService.get<number>('SERVER_PORT');

  app.setGlobalPrefix('api', { exclude: ['/health-check'] });
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  //액시오스 연결쪽인듯
  // app.enableCors({
  //   origin: 'http://localhost:5500', // 프론트엔드의 URL을 설정합니다
  //   methods: ['GET', 'POST'],
  //   allowedHeaders: ['Content-Type,Authorization'],
  // });

  //////
  app.enableCors({
    origin: 'http://localhost:5500', // 프론트엔드 URL
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  //////모라고 해야해.... js 관련

  const config = new DocumentBuilder()
    .setTitle('GuBu Service')
    .setDescription('내 구독을 부탁해~')
    .setVersion('1.0')
    .addBearerAuth({ type: 'http', scheme: 'bearer', bearerFormat: 'JWT' }) // JWT 사용을 위한 설정
    .build();

  //이거 왜 중복인가요?
  // app.useGlobalPipes(
  //   new ValidationPipe({
  //     transform: true,
  //   }),
  // );

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document, {
    swaggerOptions: {
      persistAuthorization: true, // 새로고침 시에도 JWT 유지하기
      tagsSorter: 'alpha', // API 그룹 정렬을 알파벳 순으로.
      operationsSorter: 'alpha', // API 그룹 내 정렬을 알파벳 순으로
    },
  });
  await app.listen(port);
}
bootstrap();
