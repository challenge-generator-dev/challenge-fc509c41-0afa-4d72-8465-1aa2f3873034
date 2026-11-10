import { IsNumber, IsOptional, IsEnum, Min, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { OrderStatus } from '../../domain/models/Order';

export class UpdateOrderDTO {
    @IsOptional()
    @IsNumber({}, { message: 'El monto debe ser un número' })
    @Min(0.01, { message: 'El monto debe ser mayor a 0' })
    amount?: number;

    @IsOptional()
    @IsEnum(OrderStatus, { message: 'El estado debe ser PENDING, COMPLETED o CANCELLED' })
    status?: OrderStatus;

    constructor(data: Partial<UpdateOrderDTO>) {
        if (data !== undefined) {
            if ('amount' in data && data.amount !== undefined) {
                this.amount = data.amount;
            }
            if ('status' in data && data.status !== undefined) {
                this.status = data.status;
            }
        }
    }

    static fromPlainObject(data: unknown): UpdateOrderDTO {
        const dto = new UpdateOrderDTO({});
        if (data && typeof data === 'object') {
            const obj = data as Record<string, unknown>;
            if ('amount' in obj) {
                dto.amount = typeof obj.amount === 'number' ? obj.amount : Number(obj.amount);
            }
            if ('status' in obj && typeof obj.status === 'string') {
                dto.status = obj.status as OrderStatus;
            }
        }
        return dto;
    }

    hasChanges(): boolean {
        return this.amount !== undefined || this.status !== undefined;
    }

    getValidatedFields(): { amount?: number; status?: OrderStatus } {
        const fields: { amount?: number; status?: OrderStatus } = {};
        if (this.amount !== undefined) {
            fields.amount = this.amount;
        }
        if (this.status !== undefined) {
            fields.status = this.status;
        }
        return fields;
    }
}