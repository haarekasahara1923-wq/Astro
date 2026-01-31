import { Controller, Post, Body } from '@nestjs/common';
import { KundaliService } from './kundali.service';

@Controller('api/kundali')
export class KundaliController {
    constructor(private readonly kundaliService: KundaliService) { }

    @Post('generate')
    async generateKundali(@Body() data: {
        name: string;
        dateOfBirth: string;
        timeOfBirth: string;
        placeOfBirth: string;
    }) {
        return this.kundaliService.generateKundali(data);
    }

    @Post('detailed')
    async generateDetailedKundali(@Body() data: {
        name: string;
        dateOfBirth: string;
        timeOfBirth: string;
        placeOfBirth: string;
        userId?: string;
    }) {
        return this.kundaliService.generateDetailedKundali(data);
    }

    @Post('milan')
    async generateKundaliMilan(@Body() data: {
        boy: {
            name: string;
            dateOfBirth: string;
            timeOfBirth: string;
            placeOfBirth: string;
        };
        girl: {
            name: string;
            dateOfBirth: string;
            timeOfBirth: string;
            placeOfBirth: string;
        };
        userId?: string;
    }) {
        return this.kundaliService.generateKundaliMilan(data);
    }
}
