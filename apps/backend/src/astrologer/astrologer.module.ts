import { Module } from '@nestjs/common';
import { AstrologerService } from './astrologer.service';
import { AstrologerController } from './astrologer.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
    imports: [PrismaModule],
    controllers: [AstrologerController],
    providers: [AstrologerService],
})
export class AstrologerModule { }
