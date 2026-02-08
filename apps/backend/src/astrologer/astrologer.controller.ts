import { Controller, Get, Put, Param, Body, UseGuards, Request, ForbiddenException } from '@nestjs/common';
import { AstrologerService } from './astrologer.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('astrologers')
export class AstrologerController {
    constructor(private readonly astrologerService: AstrologerService) { }

    @UseGuards(JwtAuthGuard)
    @Get('profile')
    async getProfile(@Request() req) {
        if (req.user.role !== 'ASTROLOGER') {
            throw new ForbiddenException('Only astrologers can access their profile');
        }
        return this.astrologerService.getProfile(req.user.id);
    }

    @UseGuards(JwtAuthGuard)
    @Put('profile')
    async updateProfile(@Request() req, @Body() data: any) {
        if (req.user.role !== 'ASTROLOGER') {
            throw new ForbiddenException('Only astrologers can update their profile');
        }
        return this.astrologerService.updateProfile(req.user.id, data);
    }

    @UseGuards(JwtAuthGuard)
    @Get('admin/all')
    async findAllForAdmin(@Request() req) {
        if (req.user.role !== 'ADMIN') {
            throw new ForbiddenException('Only admins can view all astrologers');
        }
        return this.astrologerService.findAllForAdmin();
    }

    @UseGuards(JwtAuthGuard)
    @Put('admin/approve/:id')
    async approveAstrologer(@Request() req, @Param('id') id: string, @Body() body: { rate: number }) {
        if (req.user.role !== 'ADMIN') {
            throw new ForbiddenException('Only admins can approve astrologers');
        }
        return this.astrologerService.approveAstrologer(id, body.rate);
    }

    @UseGuards(JwtAuthGuard)
    @Put('admin/block/:id')
    async toggleBlockStatus(@Request() req, @Param('id') id: string, @Body() body: { isBlocked: boolean }) {
        if (req.user.role !== 'ADMIN') {
            throw new ForbiddenException('Only admins can block astrologers');
        }
        return this.astrologerService.toggleBlockStatus(id, body.isBlocked);
    }

    @Get()
    findAll() {
        return this.astrologerService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.astrologerService.findOne(id);
    }
}
