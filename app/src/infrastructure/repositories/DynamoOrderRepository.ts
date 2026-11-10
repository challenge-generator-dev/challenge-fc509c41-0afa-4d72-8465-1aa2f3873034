import { PutCommand, GetCommand, UpdateCommand, DeleteCommand, DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
import { Order } from '../../domain/models/Order';
import { OrderRepository } from '../../domain/repositories/OrderRepository';
import { documentClient, getTableName } from '../config/dynamoConfig';
import { logger } from '../../utils/logger';

export class DynamoOrderRepository implements OrderRepository {
    private readonly docClient: DynamoDBDocumentClient;
    private readonly tableName: string;

    constructor(docClient: DynamoDBDocumentClient = documentClient, tableName: string = getTableName()) {
        this.docClient = docClient;
        this.tableName = tableName;
    }

    private toDynamoItem(order: Order): Record<string, unknown> {
        return {
            id: order.id,
            amount: order.amount,
            status: order.status,
            createdAt: order.createdAt.toISOString(),
        };
    }

    private fromDynamoItem(item: Record<string, unknown> | undefined): Order | null {
        if (!item) {
            return null;
        }

        const { OrderStatus } = require('../../domain/models/Order');
        
        const order = new Order(
            item.id as string,
            item.amount as number,
            (item.status as string) as typeof OrderStatus.PENDING
        );
        
        order.createdAt = new Date(item.createdAt as string);
        return order;
    }

    async create(order: Order): Promise<Order> {
        try {
            const command = new PutCommand({
                TableName: this.tableName,
                Item: this.toDynamoItem(order),
                ConditionExpression: 'attribute_not_exists(id)',
            });

            await this.docClient.send(command);
            logger.info(`Order created successfully: ${order.id}`);
            return order;
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            if (errorMessage.includes('ConditionalCheckFailedException')) {
                logger.warn(`Order already exists: ${order.id}`);
                throw new Error(`Order with id ${order.id} already exists`);
            }
            logger.error(`Failed to create order: ${errorMessage}`);
            throw error;
        }
    }

    async findById(id: string): Promise<Order | null> {
        try {
            const command = new GetCommand({
                TableName: this.tableName,
                Key: { id },
            });

            const result = await this.docClient.send(command);
            const order = this.fromDynamoItem(result.Item as Record<string, unknown> | undefined);
            
            if (order) {
                logger.info(`Order found: ${id}`);
            } else {
                logger.warn(`Order not found: ${id}`);
            }
            
            return order;
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            logger.error(`Failed to find order: ${errorMessage}`);
            throw error;
        }
    }

    async update(id: string, orderData: Partial<Order>): Promise<Order> {
        try {
            const existingOrder = await this.findById(id);
            if (!existingOrder) {
                throw new Error(`Order not found: ${id}`);
            }

            const updateExpressions: string[] = [];
            const expressionAttributeValues: Record<string, unknown> = {};

            if (orderData.amount !== undefined) {
                updateExpressions.push('amount = :amount');
                expressionAttributeValues[':amount'] = orderData.amount;
            }

            if (orderData.status !== undefined) {
                updateExpressions.push('#status = :status');
                expressionAttributeValues[':status'] = orderData.status;
            }

            if (updateExpressions.length === 0) {
                logger.warn(`No fields to update for order: ${id}`);
                return existingOrder;
            }

            const command = new UpdateCommand({
                TableName: this.tableName,
                Key: { id },
                UpdateExpression: `SET ${updateExpressions.join(', ')}`,
                ExpressionAttributeNames: orderData.status !== undefined ? { '#status': 'status' } : undefined,
                ExpressionAttributeValues: expressionAttributeValues,
                ConditionExpression: 'attribute_exists(id)',
                ReturnValues: 'ALL_NEW',
            });

            const result = await this.docClient.send(command);
            logger.info(`Order updated successfully: ${id}`);
            
            return this.fromDynamoItem(result.Attributes as Record<string, unknown>)!;
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            if (errorMessage.includes('ValidationException') || errorMessage.includes('Order not found')) {
                logger.warn(`Order not found for update: ${id}`);
                throw error;
            }
            logger.error(`Failed to update order: ${errorMessage}`);
            throw error;
        }
    }

    async delete(id: string): Promise<void> {
        try {
            const command = new DeleteCommand({
                TableName: this.tableName,
                Key: { id },
                ConditionExpression: 'attribute_exists(id)',
            });

            await this.docClient.send(command);
            logger.info(`Order deleted successfully: ${id}`);
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            if (errorMessage.includes('ConditionalCheckFailedException')) {
                logger.warn(`Order not found for deletion: ${id}`);
                throw new Error(`Order not found: ${id}`);
            }
            logger.error(`Failed to delete order: ${errorMessage}`);
            throw error;
        }
    }
}