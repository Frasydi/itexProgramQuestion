import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './users/user.module';
import { AdminModule } from './admin/admin.module';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './constant';
import { AuthMiddleWare } from './app.middleware';

@Module({
  imports: [UserModule, AdminModule, JwtModule.register({
    global: true,
    secret: jwtConstants.secret,
    signOptions: { expiresIn: '60h' },
  }),],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  

}
