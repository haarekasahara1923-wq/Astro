import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
    constructor() {
        super({
            datasources: {
                db: {
                    url: process.env.DATABASE_URL,
                },
            },
        });
    }

    async onModuleInit() {
        if (!process.env.DATABASE_URL) {
            console.error('DATABASE_URL is missing!');
        }
        await this.$connect();
    }

    async onModuleDestroy() {
        await this.$disconnect();
    }
}
