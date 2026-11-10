import { Order } from '../../domain/models/Order';
import { OrderStatus } from '../../domain/models/Order';
import { OrderRepository } from '../../domain/repositories/OrderRepository';
import { CreateOrderDTO } from '../dto/CreateOrderDTO';
import { UpdateOrderDTO } from '../dto/UpdateOrderDTO';
import { OrderResponseDTO } from '../dto/CreateOrderDTO';
import { ValidationErrorDTO } from '../dto/CreateOrderDTO';
import { NotFoundErrorDTO } from '../dto/CreateOrderDTO';
import { logger } from '../../utils/logger';

export class OrderService {
    private readonly repository: OrderRepository;
    private readonly validationErrors: Map<string, string>;

    constructor(repository: OrderRepository) {
        if (!repository) {
            throw new Error('OrderRepository es requerido para inicializar el servicio');
        }
        this.repository = repository;
        this.validationErrors = new Map();
    }

    async createOrder(dto: CreateOrderDTO): Promise<OrderResponseDTO | ValidationErrorDTO> {
        this.clearValidationErrors();
        
        if (!dto.id || dto.id.trim().length === 0) {
            this.validationErrors.set('id', 'El identificador de la orden es requerido');
            logger.warn('Intento de crear orden sin identificador');
        }

        if (dto.amount === undefined || dto.amount <= 0) {
            this.validationErrors.set('amount', 'El monto debe ser mayor a 0');
            logger.warn(`Intento de crear orden con monto inválido: ${dto.amount}`);
        }

        if (this.validationErrors.size > 0) {
            const errorsObject: { [key: string]: string[] } = {};
            this.validationErrors.forEach((value, key) => {
                errorsObject[key] = [value];
            });
            logger.error('Errores de validación en creación de orden', { 
                errors: errorsObject 
            });
            return new ValidationErrorDTO(
                'Error de validación en la creación de la orden',
                errorsObject
            );
        }

        try {
            const existingOrder = await this.repository.findById(dto.id);
            if (existingOrder) {
                this.validationErrors.set('id', 'Ya existe una orden con este identificador');
                logger.warn(`Intento de crear orden duplicada: ${dto.id}`);
                const errorsObject: { [key: string]: string[] } = {};
                this.validationErrors.forEach((value, key) => {
                    errorsObject[key] = [value];
                });
                return new ValidationErrorDTO(
                    'Error de validación en la creación de la orden',
                    errorsObject
                );
            }

            const order = new Order(
                dto.id,
                dto.amount,
                dto.status || OrderStatus.PENDING
            );

            const createdOrder = await this.repository.create(order);
            logger.info(`Orden creada exitosamente: ${createdOrder.id}`, {
                amount: createdOrder.amount,
                status: createdOrder.status
            });
            
            return new OrderResponseDTO(createdOrder);
        } catch (error) {
            logger.error('Error al crear orden en el servicio', { 
                error: error instanceof Error ? error.message : String(error) 
            });
            throw error;
        }
    }

    async getOrder(id: string): Promise<OrderResponseDTO | NotFoundErrorDTO> {
        if (!id || id.trim().length === 0) {
            logger.warn('Intento de consultar orden sin identificador');
            return new NotFoundErrorDTO('El identificador de la orden es requerido');
        }

        try {
            const order = await this.repository.findById(id);
            
            if (!order) {
                logger.info(`Orden no encontrada: ${id}`);
                return new NotFoundErrorDTO(`Orden con identificador ${id} no encontrada`);
            }

            logger.info(`Orden recuperada: ${order.id}`);
            return new OrderResponseDTO(order);
        } catch (error) {
            logger.error('Error al obtener orden del servicio', { 
                error: error instanceof Error ? error.message : String(error),
                orderId: id
            });
            throw error;
        }
    }

    async updateOrder(id: string, dto: UpdateOrderDTO): Promise<OrderResponseDTO | NotFoundErrorDTO | ValidationErrorDTO> {
        this.clearValidationErrors();
        
        if (!id || id.trim().length === 0) {
            logger.warn('Intento de actualizar orden sin identificador');
            return new NotFoundErrorDTO('El identificador de la orden es requerido');
        }

        if (!dto.hasChanges()) {
            this.validationErrors.set('update', 'No hay campos para actualizar');
            logger.warn(`Intento de actualizar orden sin cambios: ${id}`);
            const errorsObject: { [key: string]: string[] } = {};
            this.validationErrors.forEach((value, key) => {
                errorsObject[key] = [value];
            });
            return new ValidationErrorDTO(
                'Error de validación en la actualización de la orden',
                errorsObject
            );
        }

        const existingOrder = await this.repository.findById(id);
        if (!existingOrder) {
            logger.info(`Orden no encontrada para actualización: ${id}`);
            return new NotFoundErrorDTO(`Orden con identificador ${id} no encontrada`);
        }

        try {
            const validatedFields = dto.getValidatedFields();
            const updatedOrder = await this.repository.update(id, validatedFields);
            
            logger.info(`Orden actualizada exitosamente: ${updatedOrder.id}`, {
                previousStatus: existingOrder.status,
                newStatus: updatedOrder.status,
                previousAmount: existingOrder.amount,
                newAmount: updatedOrder.amount
            });
            
            return new OrderResponseDTO(updatedOrder);
        } catch (error) {
            logger.error('Error al actualizar orden en el servicio', { 
                error: error instanceof Error ? error.message : String(error),
                orderId: id
            });
            throw error;
        }
    }

    async deleteOrder(id: string): Promise<void | NotFoundErrorDTO> {
        if (!id || id.trim().length === 0) {
            logger.warn('Intento de eliminar orden sin identificador');
            return new NotFoundErrorDTO('El identificador de la orden es requerido');
        }

        const existingOrder = await this.repository.findById(id);
        if (!existingOrder) {
            logger.info(`Orden no encontrada para eliminación: ${id}`);
            return new NotFoundErrorDTO(`Orden con identificador ${id} no encontrada`);
        }

        try {
            await this.repository.delete(id);
            logger.info(`Orden eliminada exitosamente: ${id}`);
        } catch (error) {
            logger.error('Error al eliminar orden en el servicio', { 
                error: error instanceof Error ? error.message : String(error),
                orderId: id
            });
            throw error;
        }
    }

    private clearValidationErrors(): void {
        this.validationErrors.clear();
    }

    getValidationErrors(): Record<string, string[]> {
        const errorsObject: { [key: string]: string[] } = {};
        this.validationErrors.forEach((value, key) => {
            errorsObject[key] = [value];
        });
        return errorsObject;
    }
}