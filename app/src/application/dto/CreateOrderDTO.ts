import { IsNumber, IsPositive, IsUUID, ValidateIf, IsOptional } from 'class-validator';
import { Order, OrderStatus } from '../../domain/models/Order';

export class CreateOrderDTO {
    @IsUUID()
    id: string;

    @IsNumber()
    @IsPositive({ message: 'Amount must be a positive number' })
    amount: number;

    @IsOptional()
    @ValidateIf(o => o.status !== undefined)
    status?: OrderStatus;

    constructor(data: unknown = {}) {
        const obj = data as { id?: string; amount?: number; status?: OrderStatus };
        this.id = obj.id ?? '';
        this.amount = obj.amount ?? 0;
        this.status = obj.status;
    }

    static fromPlainObject(data: { id: string; amount: number; status?: OrderStatus }): CreateOrderDTO {
        return new CreateOrderDTO(data);
    }
}

export class OrderResponseDTO {
    id: string;
    amount: number;
    status: OrderStatus;
    createdAt: Date;

    constructor(order: Order) {
        this.id = order.id;
        this.amount = order.amount;
        this.status = order.status;
        this.createdAt = order.createdAt;
    }
}

export class ValidationErrorDTO {
    message: string;
    errors: {
        [key: string]: string[];
    };

    constructor(message: string, errors: { [key: string]: string[] }) {
        this.message = message;
        this.errors = errors;
    }
}

export class NotFoundErrorDTO {
    message: string;

    constructor(message: string = 'Order not found') {
        this.message = message;
    }
}