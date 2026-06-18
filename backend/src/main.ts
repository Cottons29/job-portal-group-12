// IMPORTANT: load .env BEFORE importing AppModule, otherwise process.env.DB_*
// will be undefined when TypeOrmModule.forRoot({...}) is evaluated inside the
// @Module() decorator, and TypeORM will fall back to 'postgres'/'postgres'.
import 'dotenv/config';

import {NestFactory} from '@nestjs/core';
import {AppModule} from './app.module';
import session from 'express-session';
import {NestExpressApplication} from '@nestjs/platform-express';
import {TypeormStore} from 'connect-typeorm';
import {DataSource} from 'typeorm';
import {SessionEntity} from './auth/session.entity';
import {seedCompanies} from './modules/company/company.seeder';
import {seedPostsAndJobs} from './modules/posts/posts.seeder';
import {configDotenv} from "dotenv";

declare module 'express-session' {
    interface SessionData {
        userId?: string;
    }
}

async function bootstrap() {
    configDotenv();
    const app = await NestFactory.create<NestExpressApplication>(AppModule);
    app.setGlobalPrefix('api');
    const corsOrigins = [
        process.env.FRONTEND_URL || 'http://127.0.0.1:3081',
        'http://localhost:5173',
        'http://127.0.0.1:5173',
        'http://localhost:3081',
        'http://127.0.0.1:3081',
    ];
    if (process.env.FRONTEND_URL) {
        corsOrigins.push(process.env.FRONTEND_URL);
    }
    app.enableCors({
        origin: process.env.FRONTEND_URL ?? corsOrigins,
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        allowedHeaders: [
            'Content-Type',
            'Authorization',
        ],
    });

    console.log(`FRONTEND_URL : ${process.env.FRONTEND_URL}`);

    const dataSource = app.get(DataSource);

    // Seed companies if table is empty
    await seedCompanies(dataSource);
    await seedPostsAndJobs(dataSource);

    const sessionRepository = dataSource.getRepository(SessionEntity);

    app.use(
        session({
            store: new TypeormStore({
                cleanupLimit: 2,
                limitSubquery: false, // For postgres
                ttl: 86400,
            }).connect(sessionRepository),
            secret: process.env.SESSION_SECRET || 'my-secret-key',
            resave: false,
            saveUninitialized: false,
            cookie: {
                httpOnly: true,
                maxAge: 1000 * 60 * 60 * 24,
            },
        }),
    );

    await app.listen(process.env.PORT ?? 3000);
}

bootstrap().catch((err) => console.error(err));
