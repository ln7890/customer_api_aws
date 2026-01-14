import { NestFactory } from '@nestjs/core';
import ServerlessHttp from 'serverless-http';
import { AppModule } from 'src/app.module';

let cachedServer;

async function bootstrap() {
  if (!cachedServer) {
    const app = await NestFactory.create(AppModule);
    app.enableCors();

    await app.init();

    cachedServer = ServerlessHttp(app.getHttpAdapter().getInstance());
  }

  return cachedServer;
}

export const handler = async (event, context) => {
  const server = await bootstrap();
  return server(event, context);
};
