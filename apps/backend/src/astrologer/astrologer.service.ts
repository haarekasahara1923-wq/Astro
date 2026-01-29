import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AstrologerService {
    constructor(private prisma: PrismaService) { }

    findAll() {
        return this.prisma.astrologer.findMany({
            include: {
                reviews: true,
            }
        });
    }

    findOne(id: string) {
        return this.prisma.astrologer.findUnique({
            where: { id },
            include: {
                reviews: true,
                consultations: true,
            }
        });
    }
}
