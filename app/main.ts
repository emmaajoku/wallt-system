import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { PrismaDatabaseService } from './databases/prisma-database.service';
import { ValidationPipe } from '@nestjs/common';
import { TransformInterceptor } from './utils/transform.interceptor';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import * as requestIp from 'request-ip';
import * as bodyParser from 'body-parser';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    cors: true,
  });

  app.use(
    '/payments/endpoints/webhook/stripe',
    bodyParser.raw({ type: 'application/json' }),
  );

  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalInterceptors(new TransformInterceptor());
  app.enableCors();
  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  app.setViewEngine('hbs');
  app.use(requestIp.mw());

  // Allow maximum file size of 10 Megabytes
  // app.use(graphqlUploadExpress({ maxFileSize: 10 * 1000 * 1000 }));

  const prismaService: PrismaDatabaseService = app.get<PrismaDatabaseService>(
    PrismaDatabaseService,
  );
  await prismaService.enableShutdownHooks(app);

  const port = process.env.APP_PORT || 8080;

  await app.listen(port, () => {
    console.log({ server_started: `Listening on port ${port}` });
  });
}

bootstrap().then((f) => f);
