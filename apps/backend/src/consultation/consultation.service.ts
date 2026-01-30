import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { WalletService } from '../wallet/wallet.service';

@Injectable()
export class ConsultationService {
    constructor(
        private prisma: PrismaService,
        private walletService: WalletService,
    ) { }

    async startConsultation(userId: string, astrologerId: string, type: 'CHAT' | 'CALL') {
        const user = await this.prisma.user.findUnique({ where: { id: userId }, include: { wallet: true } }) as any;
        if (!user) throw new BadRequestException('User not found');

        const astrologer = await this.prisma.astrologer.findUnique({ where: { id: astrologerId } });
        if (!astrologer) throw new BadRequestException('Astrologer not found');

        // Freemium Logic
        if (user.isNewUser && !user.freeConsultationUsed) {
            const freeMinutes = type === 'CHAT' ? 5 : 3;
            return {
                isFree: true,
                minutesRemaining: freeMinutes,
                message: `Your first ${type.toLowerCase()} is free for ${freeMinutes} minutes!`,
            };
        }

        // Paid Logic
        const isInternational = user.country !== 'India';
        let ratePerMin = 0;

        if (user.plan === 'BASIC') {
            ratePerMin = isInternational ? 2 * 80 : 10;
        } else if (user.plan === 'PREMIUM') {
            ratePerMin = isInternational ? 5 * 80 : 70;
        } else {
            ratePerMin = isInternational ? 2 * 80 : 10;
        }

        const balance = user.wallet?.balance || 0;
        if (balance <= 0) {
            throw new BadRequestException('Insufficient balance. Please recharge your wallet.');
        }

        const minutesRemaining = Math.floor(balance / ratePerMin);
        if (minutesRemaining < 1) {
            throw new BadRequestException('Low balance. Please recharge.');
        }

        return {
            isFree: false,
            ratePerMin,
            minutesRemaining,
            balance,
        };
    }

    async endConsultation(userId: string, astrologerId: string, durationMin: number, amountCharged: number) {
        return await this.prisma.$transaction(async (tx) => {
            // Update User
            const user = await tx.user.findUnique({ where: { id: userId } }) as any;
            if (user?.isNewUser && !user?.freeConsultationUsed) {
                await tx.user.update({
                    where: { id: userId },
                    data: { freeConsultationUsed: true, isNewUser: false } as any,
                });
            } else {
                // Record Transaction
                const wallet = await tx.wallet.findUnique({ where: { userId } });
                if (wallet) {
                    await tx.wallet.update({
                        where: { id: wallet.id },
                        data: { balance: { decrement: amountCharged } },
                    });
                    await tx.walletTransaction.create({
                        data: {
                            walletId: wallet.id,
                            amount: amountCharged,
                            type: 'DEBIT',
                            description: `Consultation with ${astrologerId}`,
                        } as any,
                    });
                }
            }

            // Record Consultation
            return await tx.consultation.create({
                data: {
                    userId,
                    astrologerId,
                    type: 'CONSULTATION',
                    durationMin,
                    amountCharged,
                },
            });
        });
    }
}
