import { Controller, Get, Post, Body } from '@nestjs/common';
import { HoroscopeService, RashiData } from './horoscope.service';

@Controller('api/horoscope')
export class HoroscopeController {
    constructor(private readonly horoscopeService: HoroscopeService) { }

    @Get('daily')
    async getDailyHoroscope(): Promise<RashiData[]> {
        return this.horoscopeService.getDailyHoroscope();
    }

    @Post('regenerate')
    async regenerateHoroscope() {
        return this.horoscopeService.regenerateHoroscope();
    }
}
