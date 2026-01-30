// @ts-nocheck
import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';

let cachedApp;

async function bootstrap() {
    if (!cachedApp) {
        const app = await NestFactory.create(AppModule);
        app.enableCors();
        await app.init();
        cachedApp = app.getHttpAdapter().getInstance();
    }
    return cachedApp;
}

export default async (req, res) => {
    const app = await bootstrap();
    return app(req, res);
};
