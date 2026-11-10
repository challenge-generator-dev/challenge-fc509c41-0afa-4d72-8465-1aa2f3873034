import 'reflect-metadata';
import { app } from './app';
import { documentClient, getTableName } from './infrastructure/config/dynamoConfig';
import { DynamoOrderRepository } from './infrastructure/repositories/DynamoOrderRepository';
import { OrderService } from './application/services/OrderService';
import { OrderController } from './infrastructure/controllers/OrderController';
import { OrderRoutes } from './routes/orderRoutes';
import { errorHandler } from './infrastructure/middleware/errorHandler';
import { Logger } from './utils/logger';

const logger = new Logger('Bootstrap');

function initializeDependencies() {
    const tableName = getTableName();
    logger.info('Initializing dependencies', { tableName });
    
    const orderRepository = new DynamoOrderRepository(documentClient, tableName);
    const orderService = new OrderService(orderRepository);
    const orderController = new OrderController(orderService);
    const orderRoutes = new OrderRoutes(orderService);
    
    return { orderRoutes, orderController };
}

function setupApplication() {
    const { orderRoutes } = initializeDependencies();
    
    app.use('/orders', orderRoutes.getRouter());
    
    app.use(errorHandler);
    
    logger.info('Application routes configured successfully');
}

function startServer() {
    const portEnv = process.env.PORT;
    const port = portEnv ? Number(portEnv) : 3000;
    const host = process.env.HOST || '0.0.0.0';
    
    app.listen(port, host, () => {
        logger.info(`Server is running on http://${host}:${port}`, {
            environment: process.env.NODE_ENV || 'development',
            nodeVersion: process.version
        });
    });
}

process.on('uncaughtException', (error) => {
    logger.error('Uncaught Exception occurred', error);
    process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
    logger.error('Unhandled Rejection at:', { promise, reason });
    process.exit(1);
});

if (require.main === module) {
    setupApplication();
    startServer();
}

export { initializeDependencies, setupApplication, startServer };