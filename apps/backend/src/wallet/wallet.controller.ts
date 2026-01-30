import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('wallet')
export class WalletController {
    constructor(private walletService: WalletService) { }

    @UseGuards(JwtAuthGuard)
    @Get()
    async getWallet(@Request() req) {
        return this.walletService.getWallet(req.user.userId, req.user.role);
    }
}
