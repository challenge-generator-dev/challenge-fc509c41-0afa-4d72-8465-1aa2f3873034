import { IsDate, IsEnum, IsNumber, IsPositive, IsString, IsUUID } from 'class-validator';

export enum OrderStatus {
    PENDING = 'PENDING',
    COMPLETED = 'COMPLETED',
    CANCELLED = 'CANCELLED'
}

export class Order {
    @IsUUID()
    id: string;

    @IsNumber()
    @IsPositive()
    amount: number;

    @IsEnum(OrderStatus)
    status: OrderStatus;

    @IsDate()
    createdAt: Date;

    constructor(id: string, amount: number, status: OrderStatus = OrderStatus.PENDING) {
        this.id = id;
        this.amount = amount;
        this.status = status;
        this.createdAt = new Date();
    }
}