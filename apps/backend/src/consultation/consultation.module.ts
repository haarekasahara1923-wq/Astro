import { Module } from '@nestjs/common';
import { ConsultationService } from './consultation.service';
import { ConsultationController } from './consultation.controller';
import { WalletModule } from '../wallet/wallet.module';

@Module({
    imports: [WalletModule],
    providers: [ConsultationService],
    controllers: [ConsultationController],
})
export class ConsultationModule { }
