import { Module } from '@nestjs/common';
import { KundaliController } from './kundali.controller';
import { KundaliService } from './kundali.service';

@Module({
    controllers: [KundaliController],
    providers: [KundaliService],
    exports: [KundaliService],
})
export class KundaliModule { }
