// @ts-nocheck
import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import { AppModule } from '../src/app.module';
import express from 'express';

let cachedServer;

const bootstrap = async () => {
    if (!cachedServer) {
        const instance = express();
        const app = await NestFactory.create(AppModule, new ExpressAdapter(instance));
        app.enableCors();
        await app.init();
        cachedServer = instance;
    }
    return cachedServer;
};

export default async (req: any, res: any) => {
    const server = await bootstrap();
    return server(req, res);
};
