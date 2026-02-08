import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CloudinaryService } from './cloudinary.service';

@Controller('upload')
export class UploadController {
    constructor(private cloudinaryService: CloudinaryService) { }

    @Post('image')
    @UseGuards(JwtAuthGuard)
    async uploadImage(@Body() body: { image: string }) {
        const url = await this.cloudinaryService.uploadImage(body.image);
        return { url };
    }

    @Post('images')
    @UseGuards(JwtAuthGuard)
    async uploadMultipleImages(@Body() body: { images: string[] }) {
        const urls = await this.cloudinaryService.uploadMultipleImages(body.images);
        return { urls };
    }
}
