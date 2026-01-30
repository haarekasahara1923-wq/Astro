import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { ConsultationService } from './consultation.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('consultation')
export class ConsultationController {
    constructor(private consultationService: ConsultationService) { }

    @UseGuards(JwtAuthGuard)
    @Post('start')
    async start(@Body() body: { astrologerId: string; type: 'CHAT' | 'CALL' }, @Request() req) {
        return this.consultationService.startConsultation(req.user.userId, body.astrologerId, body.type);
    }

    @UseGuards(JwtAuthGuard)
    @Post('end')
    async end(@Body() body: { astrologerId: string; durationMin: number; amountCharged: number }, @Request() req) {
        return this.consultationService.endConsultation(req.user.userId, body.astrologerId, body.durationMin, body.amountCharged);
    }
}
