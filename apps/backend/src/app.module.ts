import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { AstrologerModule } from './astrologer/astrologer.module';
import { WalletModule } from './wallet/wallet.module';
import { PaymentModule } from './payment/payment.module';
import { ConsultationModule } from './consultation/consultation.module';
import { HoroscopeModule } from './horoscope/horoscope.module';
import { KundaliModule } from './kundali/kundali.module';
import { ShopModule } from './shop/shop.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    AstrologerModule,
    WalletModule,
    PaymentModule,
    ConsultationModule,
    HoroscopeModule,
    KundaliModule,
    ShopModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
