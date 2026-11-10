import express, { Express, Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import { validationMiddleware } from './infrastructure/middleware/validationMiddleware';
import { Logger } from './utils/logger';

dotenv.config();

const logger = new Logger('ExpressApp');

export const app: Express = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req: Request, res: Response, next: NextFunction) => {
    const start = Date.now();
    
    res.on('finish', () => {
        const duration = Date.now() - start;
        logger.info('Request processed', {
            method: req.method,
            path: req.path,
            statusCode: res.statusCode,
            duration: `${duration}ms`
        });
    });
    
    next();
});

app.get('/health', (_req: Request, res: Response) => {
    res.status(200).json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
});

app.get('/ready', (_req: Request, res: Response) => {
    res.status(200).json({
        status: 'ready',
        timestamp: new Date().toISOString()
    });
});

export function configureApp(expressApp: Express): Express {
    expressApp.use(express.json());
    expressApp.use(express.urlencoded({ extended: true }));
    
    expressApp.use((req: Request, _res: Response, next: NextFunction) => {
        logger.debug('Incoming request', {
            method: req.method,
            path: req.path,
            query: req.query,
            body: req.body
        });
        next();
    });
    
    return expressApp;
}

export function getApp(): Express {
    return app;
}