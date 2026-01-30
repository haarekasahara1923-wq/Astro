import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class WalletService {
    constructor(private prisma: PrismaService) { }

    async getWallet(userId: string, role: string = 'USER') {
        let wallet;
        if (role === 'USER') {
            wallet = await this.prisma.wallet.findUnique({
                where: { userId },
                include: { transactions: { orderBy: { createdAt: 'desc' }, take: 10 } },
            });
        } else {
            wallet = await this.prisma.wallet.findUnique({
                where: { astrologerId: userId },
                include: { transactions: { orderBy: { createdAt: 'desc' }, take: 10 } },
            });
        }

        if (!wallet) {
            if (role === 'USER') {
                wallet = await this.prisma.wallet.create({
                    data: { userId, balance: 0 },
                });
            } else {
                wallet = await this.prisma.wallet.create({
                    data: { astrologerId: userId, balance: 0 },
                });
            }
        }
        return wallet;
    }

    async addFunds(walletId: string, amount: number, currency: string, provider: string, paymentId: string, orderId: string) {
        return await this.prisma.$transaction(async (tx) => {
            const wallet = await tx.wallet.update({
                where: { id: walletId },
                data: { balance: { increment: amount } },
            });

            await tx.walletTransaction.create({
                data: {
                    walletId,
                    amount,
                    currency,
                    type: 'CREDIT',
                    status: 'COMPLETED',
                    provider,
                    paymentId,
                    orderId,
                    description: `Added funds via ${provider}`,
                } as any,
            });

            return wallet;
        });
    }

    async deductFunds(walletId: string, amount: number, description: string) {
        const wallet = await this.prisma.wallet.findUnique({ where: { id: walletId } });
        if (!wallet || wallet.balance < amount) {
            throw new Error('Insufficient balance');
        }

        return await this.prisma.$transaction(async (tx) => {
            const updatedWallet = await tx.wallet.update({
                where: { id: walletId },
                data: { balance: { decrement: amount } },
            });

            await tx.walletTransaction.create({
                data: {
                    walletId,
                    amount,
                    type: 'DEBIT',
                    status: 'COMPLETED',
                    description,
                } as any,
            });

            return updatedWallet;
        });
    }
}
