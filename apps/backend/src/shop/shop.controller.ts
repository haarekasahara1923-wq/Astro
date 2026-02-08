import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { ShopService } from './shop.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('shop')
export class ShopController {
    constructor(private shopService: ShopService) { }

    @Get('stats') // Admin only - need role guard
    @UseGuards(JwtAuthGuard)
    async getStats(@Request() req) {
        // if (req.user.role !== 'ADMIN') throw new UnauthorizedException('Admin only');
        return this.shopService.getShopStats();
    }

    @Get('products')
    async getProducts(@Query('category') category: string, @Query('search') search: string) {
        return this.shopService.findAllProducts({ category, search });
    }

    @Get('products/:id')
    async getProduct(@Param('id') id: string) {
        return this.shopService.findOneProduct(id);
    }

    @Post('products') // Admin only
    @UseGuards(JwtAuthGuard)
    async createProduct(@Request() req, @Body() data: any) {
        // if (req.user.role !== 'ADMIN') throw new UnauthorizedException('Admin only');
        return this.shopService.createProduct(data);
    }

    @Put('products/:id') // Admin only
    @UseGuards(JwtAuthGuard)
    async updateProduct(@Request() req, @Param('id') id: string, @Body() data: any) {
        return this.shopService.updateProduct(id, data);
    }

    @Delete('products/:id') // Admin only
    @UseGuards(JwtAuthGuard)
    async deleteProduct(@Request() req, @Param('id') id: string) {
        return this.shopService.deleteProduct(id);
    }

    @Post('orders')
    @UseGuards(JwtAuthGuard)
    async createOrder(@Request() req, @Body() data: any) {
        return this.shopService.createOrder(req.user.userId, data);
    }

    @Get('orders')
    @UseGuards(JwtAuthGuard)
    async getUserOrders(@Request() req) {
        return this.shopService.getUserOrders(req.user.userId);
    }
}
