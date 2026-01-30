// @ts-nocheck
import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import { AppModule } from '../src/app.module';
import express from 'express';

const server = express();

const createNestServer = async (expressInstance: any) => {
    const app = await NestFactory.create(
        AppModule,
        new ExpressAdapter(expressInstance),
    );
    app.enableCors();
    return app.init();
};

export default async (req: any, res: any) => {
    await createNestServer(server);
    server(req, res);
};
