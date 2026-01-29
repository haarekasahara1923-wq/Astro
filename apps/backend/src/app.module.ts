import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { AstrologerModule } from './astrologer/astrologer.module';

@Module({
  imports: [PrismaModule, AuthModule, AstrologerModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
