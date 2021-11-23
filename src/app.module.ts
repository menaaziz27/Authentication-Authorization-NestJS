import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { RolesGuard } from './auth/guards/roles.guard';

@Module({
  imports: [MongooseModule.forRoot('mongodb://localhost/auth-task'), UserModule, AuthModule],
  controllers: [AppController],
  providers: [AppService, RolesGuard],
})
export class AppModule {}
