import { Router, Request, Response, NextFunction } from 'express';
import { OrderService } from '../application/services/OrderService';
import { CreateOrderDTO, OrderResponseDTO, ValidationErrorDTO, NotFoundErrorDTO } from '../application/dto/CreateOrderDTO';
import { UpdateOrderDTO } from '../application/dto/UpdateOrderDTO';
import { validationService } from '../utils/validation';
import { createLogger } from '../utils/logger';

const router = Router();
const logger = createLogger('OrderRoutes');

export class OrderRoutes {
  private orderService: OrderService;

  constructor(orderService: OrderService) {
    this.orderService = orderService;
    this.registerRoutes();
  }

  private registerRoutes(): void {
    router.post('/', this.createOrder.bind(this));
    router.get('/:id', this.getOrder.bind(this));
    router.put('/:id', this.updateOrder.bind(this));
    router.delete('/:id', this.deleteOrder.bind(this));
  }

  public getRouter(): Router {
    return router;
  }

  private async createOrder(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      logger.info('Creating new order', { body: req.body });
      
      const validationResult = await validationService.validate(
        CreateOrderDTO,
        req.body,
        { validatorOptions: { whitelist: true, forbidNonWhitelisted: false } }
      );

      if (!validationResult.isValid) {
        logger.warn('Order validation failed', { errors: validationResult.errors });
        const errorResponse = new ValidationErrorDTO(
          'Validation failed',
          validationResult.errors.reduce((acc, e) => {
            acc[e.field] = [e.message];
            return acc;
          }, {} as Record<string, string[]>)
        );
        res.status(400).json(errorResponse);
        return;
      }

      const createDto = plainToInstance(CreateOrderDTO, req.body);
      const order = await this.orderService.createOrder(createDto);
      const response = new OrderResponseDTO(order as any);
      
      logger.info('Order created successfully', { orderId: (order as any).id });
      res.status(201).json(response);
    } catch (error) {
      logger.error('Failed to create order', error as Error);
      next(error as Error | Record<string, unknown>);
    }
  }

  private async getOrder(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      logger.info('Fetching order', { orderId: id });

      const validation = validateOrderId(id);
      if (!validation.valid) {
        const errorResponse = new ValidationErrorDTO(validation.message!, { id: [validation.message!] });
        res.status(400).json(errorResponse);
        return;
      }

      const order = await this.orderService.getOrder(id);

      if (!order) {
        logger.warn('Order not found', { orderId: id });
        const errorResponse = new NotFoundErrorDTO(`Order with id ${id} not found`);
        res.status(404).json(errorResponse);
        return;
      }

      const response = new OrderResponseDTO(order as any);
      logger.info('Order fetched successfully', { orderId: id });
      res.status(200).json(response);
    } catch (error) {
      logger.error('Failed to fetch order', error as Error);
      next(error as Error | Record<string, unknown>);
    }
  }

  private async updateOrder(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      logger.info('Updating order', { orderId: id, body: req.body });

      const validationId = validateOrderId(id);
      if (!validationId.valid) {
        const errorResponse = new ValidationErrorDTO(validationId.message!, { id: [validationId.message!] });
        res.status(400).json(errorResponse);
        return;
      }

      const validationResult = await validationService.validate(
        UpdateOrderDTO,
        req.body,
        { validatorOptions: { whitelist: true, forbidNonWhitelisted: false } }
      );

      if (!validationResult.isValid) {
        logger.warn('Order update validation failed', { errors: validationResult.errors });
        const errorResponse = new ValidationErrorDTO(
          'Validation failed',
          validationResult.errors.reduce((acc, e) => {
            acc[e.field] = [e.message];
            return acc;
          }, {} as Record<string, string[]>)
        );
        res.status(400).json(errorResponse);
        return;
      }

      const updateDto = plainToInstance(UpdateOrderDTO, req.body);
      const order = await this.orderService.updateOrder(id, updateDto);

      if (!order) {
        logger.warn('Order not found for update', { orderId: id });
        const errorResponse = new NotFoundErrorDTO(`Order with id ${id} not found`);
        res.status(404).json(errorResponse);
        return;
      }

      const response = new OrderResponseDTO(order as any);
      logger.info('Order updated successfully', { orderId: id });
      res.status(200).json(response);
    } catch (error) {
      logger.error('Failed to update order', error as Error);
      next(error as Error | Record<string, unknown>);
    }
  }

  private async deleteOrder(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      logger.info('Deleting order', { orderId: id });

      const validation = validateOrderId(id);
      if (!validation.valid) {
        const errorResponse = new ValidationErrorDTO(validation.message!, { id: [validation.message!] });
        res.status(400).json(errorResponse);
        return;
      }

      const deleted = await this.orderService.deleteOrder(id);

      if (!deleted) {
        logger.warn('Order not found for deletion', { orderId: id });
        const errorResponse = new NotFoundErrorDTO(`Order with id ${id} not found`);
        res.status(404).json(errorResponse);
        return;
      }

      logger.info('Order deleted successfully', { orderId: id });
      res.status(204).send();
    } catch (error) {
      logger.error('Failed to delete order', error as Error);
      next(error as Error | Record<string, unknown>);
    }
  }
}

function plainToInstance<T>(cls: new (...args: unknown[]) => T, plain: unknown): T {
  return plain as T;
}

function validateOrderId(id: string): { valid: boolean; message?: string } {
  if (!id || typeof id !== 'string') {
    return { valid: false, message: 'Order ID is required' };
  }
  const trimmedId = id.trim();
  if (trimmedId.length === 0) {
    return { valid: false, message: 'Order ID cannot be empty' };
  }
  if (trimmedId.length > 255) {
    return { valid: false, message: 'Order ID exceeds maximum length' };
  }
  return { valid: true };
}