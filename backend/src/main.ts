import { NestFactory } from '@nestjs/core';
import type { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Derrière Caddy/Traefik : req.ip doit refléter l'IP réelle du client (X-Forwarded-For)
  app.set('trust proxy', true);

  app.enableCors({
    origin: process.env.FRONTEND_URL
      ? [process.env.FRONTEND_URL, 'http://localhost:3000']
      : true, // Allow all origins (needed for mobile apps that don't send Origin header)
    credentials: true,
  });

  // console BD URL
  console.log('DATABASE_URL: ', process.env.DATABASE_URL);

  await app.listen(process.env.PORT ?? 3001);
}
void bootstrap();
