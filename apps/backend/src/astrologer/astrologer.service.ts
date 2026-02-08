import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AstrologerService {
    constructor(private prisma: PrismaService) { }

    // Public method for users (only approved astrologers)
    findAll() {
        return this.prisma.astrologer.findMany({
            where: {
                isApproved: true,
            },
            select: {
                id: true,
                name: true,
                profileImage: true,
                bio: true,
                expertise: true,
                languages: true,
                experience: true,
                experienceDesc: true,
                pricePerMin: true,
                rating: true,
                isOnline: true,
                reviews: true,
            }
        });
    }

    // Public method for single astrologer profile (limited data)
    findOne(id: string) {
        return this.prisma.astrologer.findUnique({
            where: { id },
            select: {
                id: true,
                name: true,
                profileImage: true,
                bio: true,
                expertise: true,
                languages: true,
                experience: true,
                experienceDesc: true,
                pricePerMin: true,
                rating: true,
                isOnline: true,
                reviews: true,
                consultations: {
                    select: {
                        id: true,
                        createdAt: true,
                        amountCharged: true, // Maybe useful for stats but filtered for public
                        type: true
                    }
                }
            }
        });
    }

    // Private method for Astrologer Dashboard
    async getProfile(id: string) {
        return this.prisma.astrologer.findUnique({
            where: { id },
        });
    }

    // Update Astrologer Profile
    async updateProfile(id: string, data: any) {
        const updateData: any = {
            ...data
        };

        // If displayName is provided, update `name`
        if (data.displayName) {
            updateData.name = data.displayName;
            delete updateData.displayName;
        }

        return this.prisma.astrologer.update({
            where: { id },
            data: updateData
        });
    }

    // Admin: Get all astrologers with full details
    async findAllForAdmin() {
        return this.prisma.astrologer.findMany({
            orderBy: {
                createdAt: 'desc'
            },
            include: {
                _count: {
                    select: { consultations: true, reviews: true }
                }
            }
        });
    }

    // Admin: Approve Astrologer and set rate
    async approveAstrologer(id: string, approvedRate: number) {
        return this.prisma.astrologer.update({
            where: { id },
            data: {
                isApproved: true,
                pricePerMin: approvedRate,
                quotedRate: approvedRate, // Update quoted if changed
            }
        });
    }
}
