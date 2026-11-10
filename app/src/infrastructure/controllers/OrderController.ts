import { Request, Response, NextFunction } from 'express';
import { OrderService } from '../../application/services/OrderService';
import { CreateOrderDTO } from '../../application/dto/CreateOrderDTO';
import { UpdateOrderDTO } from '../../application/dto/UpdateOrderDTO';
import { OrderResponseDTO } from '../../application/dto/CreateOrderDTO';
import { NotFoundErrorDTO } from '../../application/dto/CreateOrderDTO';
import { ValidationErrorDTO } from '../../application/dto/CreateOrderDTO';
import { logger } from '../../utils/logger';

export class OrderController {
    private readonly orderService: OrderService;

    constructor(orderService: OrderService) {
        this.orderService = orderService;
    }

    async createOrder(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            logger.info('Creating new order', { body: req.body });
            
            const createOrderDTO = new CreateOrderDTO({
                id: req.body.id,
                amount: req.body.amount,
                status: req.body.status
            });

            const order = await this.orderService.createOrder(createOrderDTO);
            
            if (order instanceof ValidationErrorDTO) {
                res.status(400).json(order);
                return;
            }

            const response = new OrderResponseDTO(order as any);
            res.status(201).json(response);
        } catch (error: unknown) {
            logger.error('Error creating order', { error });
            
            if (error instanceof ValidationErrorDTO) {
                res.status(400).json(error);
                return;
            }
            
            if (error instanceof Error) {
                if (error.message.includes('already exists')) {
                    res.status(409).json(new ValidationErrorDTO(error.message, {}));
                    return;
                }
            }
            
            next(error);
        }
    }

    async getOrder(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { id } = req.params;
            logger.info('Getting order', { id });

            if (!id || id.trim() === '') {
                res.status(400).json(new ValidationErrorDTO('Order ID is required', {}));
                return;
            }

            const order = await this.orderService.getOrder(id);

            if (!order) {
                res.status(404).json(new NotFoundErrorDTO(`Order with id ${id} not found`));
                return;
            }

            if (order instanceof NotFoundErrorDTO) {
                res.status(404).json(order);
                return;
            }

            const response = new OrderResponseDTO(order as any);
            res.status(200).json(response);
        } catch (error: unknown) {
            logger.error('Error getting order', { error });
            next(error);
        }
    }

    async updateOrder(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { id } = req.params;
            logger.info('Updating order', { id, body: req.body });

            if (!id || id.trim() === '') {
                res.status(400).json(new ValidationErrorDTO('Order ID is required', {}));
                return;
            }

            const updateOrderDTO = new UpdateOrderDTO({
                amount: req.body.amount,
                status: req.body.status
            });

            if (!updateOrderDTO.hasChanges()) {
                res.status(400).json(new ValidationErrorDTO('No valid fields to update', {}));
                return;
            }

            const order = await this.orderService.updateOrder(id, updateOrderDTO);
            
            if (order instanceof ValidationErrorDTO) {
                res.status(400).json(order);
                return;
            }
            
            if (order instanceof NotFoundErrorDTO) {
                res.status(404).json(order);
                return;
            }

            const response = new OrderResponseDTO(order as any);
            res.status(200).json(response);
        } catch (error: unknown) {
            logger.error('Error updating order', { error });
            
            if (error instanceof ValidationErrorDTO) {
                res.status(400).json(error);
                return;
            }
            
            if (error instanceof NotFoundErrorDTO) {
                res.status(404).json(error);
                return;
            }
            
            next(error);
        }
    }

    async deleteOrder(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { id } = req.params;
            logger.info('Deleting order', { id });

            if (!id || id.trim() === '') {
                res.status(400).json(new ValidationErrorDTO('Order ID is required', {}));
                return;
            }

            await this.orderService.deleteOrder(id);
            res.status(204).send();
        } catch (error: unknown) {
            logger.error('Error deleting order', { error });
            
            if (error instanceof NotFoundErrorDTO) {
                res.status(404).json(error);
                return;
            }
            
            next(error);
        }
    }
}