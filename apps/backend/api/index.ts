import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';

let cachedApp;

export default async function handler(req, res) {
    try {
        if (!cachedApp) {
            const app = await NestFactory.create(AppModule);
            app.enableCors();
            await app.init();
            cachedApp = app.getHttpAdapter().getInstance();
        }
        return cachedApp(req, res);
    } catch (err) {
        console.error('Vercel Handler Error:', err);
        res.status(500).json({
            statusCode: 500,
            message: 'Internal Server Error'
        });
    }
}
