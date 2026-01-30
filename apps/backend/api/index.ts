import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import { AppModule } from '../src/app.module';
import express from 'express';

let cachedServer;

const bootstrap = async () => {
    if (!cachedServer) {
        const expressApp = express();
        const adapter = new ExpressAdapter(expressApp);
        const app = await NestFactory.create(AppModule, adapter);
        app.enableCors();
        await app.init();
        cachedServer = expressApp;
    }
    return cachedServer;
};

export default async (req, res) => {
    const server = await bootstrap();
    return server(req, res);
};
