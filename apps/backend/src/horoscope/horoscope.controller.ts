import { Controller, Get, Post, Body } from '@nestjs/common';
import { HoroscopeService } from './horoscope.service';

@Controller('api/horoscope')
export class HoroscopeController {
    constructor(private readonly horoscopeService: HoroscopeService) { }

    @Get('daily')
    async getDailyHoroscope() {
        return this.horoscopeService.getDailyHoroscope();
    }

    @Post('regenerate')
    async regenerateHoroscope() {
        return this.horoscopeService.regenerateHoroscope();
    }
}
