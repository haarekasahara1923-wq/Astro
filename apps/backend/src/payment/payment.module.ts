import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { WalletModule } from '../wallet/wallet.module';
import { ConfigModule } from '@nestjs/config';

@Module({
    imports: [WalletModule, ConfigModule],
    providers: [PaymentService],
    controllers: [PaymentController],
})
export class PaymentModule { }
