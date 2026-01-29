import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import { AppModule } from '../src/app.module';
import * as express from 'express';

const server = express();

const createNestServer = async (expressInstance) => {
    const app = await NestFactory.create(
        AppModule,
        new ExpressAdapter(expressInstance),
    );
    app.enableCors({
        origin: '*',
        credentials: true,
    });
    await app.init();
};

export default async function (req, res) {
    if (!server.listeners('request').length) {
        await createNestServer(server);
    }
    server(req, res);
}
