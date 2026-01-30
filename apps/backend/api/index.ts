// @ts-nocheck
import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';

let cachedServer;

const bootstrap = async () => {
    if (!cachedServer) {
        const app = await NestFactory.create(AppModule);
        app.enableCors();
        await app.init();
        cachedServer = app.getHttpAdapter().getInstance();
    }
    return cachedServer;
};

export default async (req, res) => {
    const server = await bootstrap();
    return server(req, res);
};
