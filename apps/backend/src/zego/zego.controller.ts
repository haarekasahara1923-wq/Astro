import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ZegoService } from './zego.service';

@Controller('zego')
export class ZegoController {
    constructor(private zegoService: ZegoService) { }

    @UseGuards(JwtAuthGuard)
    @Post('token')
    generateToken(
        @Body() body: { roomId: string },
        @Request() req,
    ) {
        const userId = req.user.userId;
        return this.zegoService.generateToken(userId, body.roomId);
    }
}
