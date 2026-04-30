// IMPORTANT: load .env BEFORE importing AppModule, otherwise process.env.DB_*
// will be undefined when TypeOrmModule.forRoot({...}) is evaluated inside the
// @Module() decorator, and TypeORM will fall back to 'postgres'/'postgres'.
import 'dotenv/config';

import {NestFactory} from '@nestjs/core';
import {AppModule} from './app.module';
import session from 'express-session';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.setGlobalPrefix('api');
    app.enableCors({
        origin: 'http://localhost:5173',
        credentials: true,
    });

    console.log(`Process : ${process.env.SESSION_SECRET}`)

    app.use(
        session({
            secret: process.env.SESSION_SECRET || 'my-secret-key',
            resave: false,
            saveUninitialized: false,
            cookie: {
                httpOnly: true,
                maxAge: 1000 * 60 * 60 * 24, // 1 day
            },
        }),
    );

    await app.listen(process.env.PORT ?? 3000);
}

bootstrap().then(_ => {
});
