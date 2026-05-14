import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: process.env.FRONTEND_URL
      ? [process.env.FRONTEND_URL, 'http://localhost:3000']
      : true, // Allow all origins (needed for mobile apps that don't send Origin header)
    credentials: true,
  });

  // console BD URL
  console.log("DATABASE_URL: ",process.env.DATABASE_URL);

  await app.listen(process.env.PORT ?? 3001);
}
void bootstrap();
