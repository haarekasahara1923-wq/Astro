import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import { AppModule } from '../src/app.module';
import express from 'express';

let cachedServer;

export default async function handler(req, res) {
    try {
        if (!cachedServer) {
            const expressApp = express();
            const adapter = new ExpressAdapter(expressApp);
            const app = await NestFactory.create(AppModule, adapter);
            app.enableCors();
            await app.init();
            cachedServer = expressApp;
        }
        return cachedServer(req, res);
    } catch (err) {
        console.error('Vercel Handler Error:', err);
        res.status(500).json({
            statusCode: 500,
            message: 'Internal Server Error',
            error: err.message,
            stack: err.stack
        });
    }
}
