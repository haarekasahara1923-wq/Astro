import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
    constructor(private config: ConfigService) {
        super({
            datasources: {
                db: {
                    url: config.get<string>('DATABASE_URL'),
                },
            },
        });
    }

    async onModuleInit() {
        const url = this.config.get('DATABASE_URL');
        if (!url) {
            throw new Error('DATABASE_URL is not defined in environment variables');
        }
        await this.$connect();
    }

    async onModuleDestroy() {
        await this.$disconnect();
    }
}
