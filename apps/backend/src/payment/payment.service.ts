import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Razorpay from 'razorpay';
import * as paypal from '@paypal/checkout-server-sdk';
import { WalletService } from '../wallet/wallet.service';
import { PrismaService } from '../prisma/prisma.service';
import * as crypto from 'crypto';

@Injectable()
export class PaymentService {
    private razorpay: any;
    private paypalClient: any;

    constructor(
        private configService: ConfigService,
        private walletService: WalletService,
        private prisma: PrismaService,
    ) {
        this.razorpay = new Razorpay({
            key_id: this.configService.get('RAZORPAY_KEY_ID'),
            key_secret: this.configService.get('RAZORPAY_SECRET_KEY'),
        });

        const clientId = this.configService.get('PAYPAL_CLIENT_ID');
        const clientSecret = this.configService.get('PAYPAL_CLIENT_SECRET');
        const environment = new paypal.core.LiveEnvironment(clientId, clientSecret);
        this.paypalClient = new paypal.core.PayPalHttpClient(environment);
    }

    async createRazorpayOrder(amount: number, currency: string = 'INR') {
        const options = {
            amount: Math.round(amount * 100), // Amount in paise
            currency,
            receipt: `receipt_${Date.now()}`,
        };

        try {
            const order = await this.razorpay.orders.create(options);
            return order;
        } catch (error) {
            throw new InternalServerErrorException('Razorpay order creation failed');
        }
    }

    async verifyRazorpayPayment(paymentId: string, orderId: string, signature: string, userId: string, amount: number) {
        const crypto = require('crypto');
        const secret = this.configService.get('RAZORPAY_SECRET_KEY');
        const generated_signature = crypto
            .createHmac('sha256', secret)
            .update(orderId + '|' + paymentId)
            .digest('hex');

        if (generated_signature === signature) {
            const wallet = await this.walletService.getWallet(userId);
            await this.walletService.addFunds(wallet.id, amount, 'INR', 'RAZORPAY', paymentId, orderId);
            return { success: true };
        } else {
            return { success: false, message: 'Invalid signature' };
        }
    }

    async createPaypalOrder(amount: number, currency: string = 'USD') {
        const request = new paypal.orders.OrdersCreateRequest();
        request.prefer("return=representation");
        request.requestBody({
            intent: 'CAPTURE',
            purchase_units: [{
                amount: {
                    currency_code: currency,
                    value: amount.toString(),
                },
            }],
        });

        try {
            const order = await this.paypalClient.execute(request);
            return order.result;
        } catch (error) {
            throw new InternalServerErrorException('PayPal order creation failed');
        }
    }

    async capturePaypalOrder(orderId: string, userId: string, amount: number) {
        const request = new paypal.orders.OrdersCaptureRequest(orderId);
        request.requestBody({} as any);

        try {
            const capture = await this.paypalClient.execute(request);
            if (capture.result.status === 'COMPLETED') {
                const wallet = await this.walletService.getWallet(userId);
                await this.walletService.addFunds(wallet.id, amount, 'USD', 'PAYPAL', capture.result.id, orderId);
                return { success: true };
            }
            return { success: false };
        } catch (error) {
            throw new InternalServerErrorException('PayPal payment capture failed');
        }
    }

    // Pricing Logic
    getPlanPricing(plan: string, isInternational: boolean) {
        const pricing = {
            BASIC: {
                minRate: isInternational ? 2 : 10,
                currency: isInternational ? 'USD' : 'INR',
            },
            PREMIUM: {
                minRate: isInternational ? 5 : 70,
                currency: isInternational ? 'USD' : 'INR',
                reports: {
                    personal: isInternational ? 11 : 551,
                    milan: isInternational ? 21 : 2100,
                }
            },
            FREE: {
                minRate: 0,
                chatLimit: 5,
                callLimit: 3,
            }
        };
        return pricing[plan] || pricing.BASIC;
    }

    async checkoutReport(userId: string, reportType: 'personal' | 'milan', plan: 'PREMIUM', isInternational: boolean) {
        const pricing = this.getPlanPricing(plan, isInternational);
        const amount = reportType === 'personal' ? pricing.PREMIUM.reports.personal : pricing.PREMIUM.reports.milan;
        const currency = pricing.PREMIUM.currency;

        if (isInternational) {
            // Return PayPal checkout data
            return { method: 'PAYPAL', amount, currency };
        } else {
            // Return Razorpay checkout data
            const order = await this.createRazorpayOrder(amount, currency);
            return { method: 'RAZORPAY', order, amount, currency };
        }
    }
}
