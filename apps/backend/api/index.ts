const { NestFactory } = require('@nestjs/core');
const { ExpressAdapter } = require('@nestjs/platform-express');
const { AppModule } = require('../dist/src/app.module');
const express = require('express');

let cachedServer;

async function bootstrap() {
    if (!cachedServer) {
        const expressApp = express();
        const nestApp = await NestFactory.create(AppModule, new ExpressAdapter(expressApp));
        nestApp.enableCors();
        await nestApp.init();
        cachedServer = expressApp;
    }
    return cachedServer;
}

module.exports = async (req, res) => {
    const server = await bootstrap();
    return server(req, res);
};
