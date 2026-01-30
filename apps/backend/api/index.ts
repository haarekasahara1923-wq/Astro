// @ts-nocheck
import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import { AppModule } from '../src/app.module';

import express from 'express';

// @ts-ignore
const server = express();

const createNestServer = async (expressInstance: any) => {
    const app = await NestFactory.create(
        AppModule,
        new ExpressAdapter(expressInstance),
    );
    app.enableCors({
        origin: '*',
        credentials: true,
    });
    await app.init();
};

export default async function handler(req: any, res: any) {
    if (!server.listeners('request').length) {
        await createNestServer(server);
    }
    (server as any)(req, res);
}


