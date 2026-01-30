// @ts-nocheck
import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import { AppModule } from '../src/app.module';
import express from 'express';

let cachedServer;

const bootstrap = async () => {
    if (!cachedServer) {
        const expressApp = express();
        const adapter = new ExpressAdapter(expressApp);
        const nestApp = await NestFactory.create(AppModule, adapter);
        nestApp.enableCors();
        await nestApp.init();
        cachedServer = expressApp;
    }
    return cachedServer;
};

export default async (req, res) => {
    try {
        const server = await bootstrap();
        return server(req, res);
    } catch (error) {
        console.error('BOOTSTRAP_ERROR:', error);
        res.status(500).json({
            error: 'Backend Bootstrap Failed',
            message: error.message,
            stack: error.stack
        });
    }
};
