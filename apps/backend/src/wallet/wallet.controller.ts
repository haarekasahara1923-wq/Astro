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
    @UseGuards(JwtAuthGuard)
    @Get('admin/all')
    async getAllWalletsForAdmin(@Request() req) {
        if (req.user.role !== 'ADMIN') {
            throw new Error('Unauthorized');
        }
        return this.walletService.getAllWalletsForAdmin();
    }
}
