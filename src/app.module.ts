import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule.forRoot()],
})
@Module({
  controllers: [AppController],
  providers: [AppService],
  imports: [UsersModule],
})
export class AppModule {}
