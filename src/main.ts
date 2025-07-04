import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
const cors = require("cors");

var express = require('express');
var httpContext = require('express-http-context');

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe())
  app.setGlobalPrefix("/university-student")
  app.use(httpContext.middleware);
  app.use(cors());
  const port = process.env.PORT || 3000
  console.log(`Using port ${port}`)
  await app.listen(port);
}
bootstrap();


// app startup using pm2
// pm2 start dist/main.js --name nest-app

