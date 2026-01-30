import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('payment')
export class PaymentController {
    constructor(private paymentService: PaymentService) { }

    @UseGuards(JwtAuthGuard)
    @Post('razorpay/order')
    async createRazorpayOrder(@Body() body: { amount: number; currency?: string }) {
        return this.paymentService.createRazorpayOrder(body.amount, body.currency);
    }

    @UseGuards(JwtAuthGuard)
    @Post('razorpay/verify')
    async verifyRazorpayPayment(@Body() body: { paymentId: string; orderId: string; signature: string; amount: number }, @Request() req) {
        return this.paymentService.verifyRazorpayPayment(body.paymentId, body.orderId, body.signature, req.user.userId, body.amount);
    }

    @UseGuards(JwtAuthGuard)
    @Post('paypal/order')
    async createPaypalOrder(@Body() body: { amount: number; currency?: string }) {
        return this.paymentService.createPaypalOrder(body.amount, body.currency);
    }

    @UseGuards(JwtAuthGuard)
    @Post('paypal/capture')
    async capturePaypalOrder(@Body() body: { orderId: string; amount: number }, @Request() req) {
        return this.paymentService.capturePaypalOrder(body.orderId, req.user.userId, body.amount);
    }
}
