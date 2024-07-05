import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import prisma from 'prisma/prisma';
import { hashPassword } from 'util/bcrypt';
// somewhere in your initialization file


async function bootstrap() {
  const usersLength = await prisma.user.count()
  if(usersLength == 0) {
    await prisma.user.create({
      data : {
        username : "Admin",
        password : hashPassword("adminFrasydi"),
        role : 99
      }
    })
  }
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());

  await app.listen(3000);
}
bootstrap();
