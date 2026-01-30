import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module.js';

let cachedApp;

export default async function handler(req, res) {
    if (!cachedApp) {
        const app = await NestFactory.create(AppModule);
        app.enableCors();
        await app.init();
        cachedApp = app.getHttpAdapter().getInstance();
    }
    return cachedApp(req, res);
}
