// @ts-nocheck
import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import { AppModule } from '../src/app.module';

let cachedApp;

async function bootstrap() {
    if (!cachedApp) {
        const app = await NestFactory.create(AppModule, new ExpressAdapter());
        app.enableCors();
        await app.init();
        cachedApp = app.getHttpAdapter().getInstance();
    }
    return cachedApp;
}

export default async (req, res) => {
    const app = await bootstrap();
    // Ensure the app instance is called correctly as a function
    return app(req, res);
};
