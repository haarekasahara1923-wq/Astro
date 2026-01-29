import { Controller, Get, Param } from '@nestjs/common';
import { AstrologerService } from './astrologer.service';

@Controller('astrologers')
export class AstrologerController {
    constructor(private readonly astrologerService: AstrologerService) { }

    @Get()
    findAll() {
        return this.astrologerService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.astrologerService.findOne(id);
    }
}
