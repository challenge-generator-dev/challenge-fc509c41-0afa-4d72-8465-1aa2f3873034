import {
  validate,
  validateOrReject,
  ValidationError as ClassValidatorError,
  ValidatorOptions
} from 'class-validator';
import { plainToInstance, ClassTransformOptions } from 'class-transformer';

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationErrorItem[];
}

export interface ValidationErrorItem {
  field: string;
  message: string;
  value?: unknown;
}

export interface ValidationOptions {
  transformOptions?: ClassTransformOptions;
  validatorOptions?: ValidatorOptions;
  stripUnknown?: boolean;
}

const defaultValidatorOptions: ValidatorOptions = {
  whitelist: true,
  forbidNonWhitelisted: true,
  stopAtFirstError: false
};

const defaultTransformOptions: ClassTransformOptions = {
  excludeExtraneousValues: true,
  enableImplicitConversion: true
};

export class ValidationService {
  public async validate<T extends object>(
    dtoClass: new (...args: any[]) => T,
    plainData: unknown,
    options: ValidationOptions = {}
  ): Promise<ValidationResult> {
    const { transformOptions, validatorOptions, stripUnknown } = options;
    
    const finalTransformOptions: ClassTransformOptions = {
      ...defaultTransformOptions,
      ...transformOptions
    };

    const finalValidatorOptions: ValidatorOptions = {
      ...defaultValidatorOptions,
      ...validatorOptions
    };

    let instance = plainToInstance(dtoClass, plainData, finalTransformOptions);

    if (stripUnknown && plainData && typeof plainData === 'object') {
      const dtoKeys = new Set(Object.keys(instance));
      const allowedData: Record<string, unknown> = {};
      for (const key of dtoKeys) {
        if (key in plainData) {
          allowedData[key] = (plainData as Record<string, unknown>)[key];
        }
      }
      instance = plainToInstance(dtoClass, allowedData, finalTransformOptions);
    }

    const errors: ClassValidatorError[] = await validate(instance, finalValidatorOptions);

    if (errors.length === 0) {
      return { isValid: true, errors: [] };
    }

    const validationErrors: ValidationErrorItem[] = errors.map((error) => ({
      field: error.property,
      message: Object.values(error.constraints || {}).join(', '),
      value: error.value
    }));

    return { isValid: false, errors: validationErrors };
  }

  public async validateOrRejectWithError<T extends object>(
    dtoClass: new (...args: any[]) => T,
    plainData: unknown,
    options: ValidationOptions = {}
  ): Promise<T> {
    const { transformOptions, validatorOptions } = options;
    
    const instance = plainToInstance(dtoClass, plainData, {
      ...defaultTransformOptions,
      ...transformOptions
    });

    try {
      await validateOrReject(instance, {
        ...defaultValidatorOptions,
        ...validatorOptions
      });
      return instance;
    } catch (errors) {
      if (Array.isArray(errors)) {
        const validationErrors: ValidationErrorItem[] = errors
          .filter((e): e is ClassValidatorError => e instanceof ClassValidatorError)
          .map((error) => ({
            field: error.property,
            message: Object.values(error.constraints || {}).join(', '),
            value: error.value
          }));
        throw new ValidationException('Validation failed', validationErrors);
      }
      throw errors;
    }
  }

  public isValidAmount(amount: unknown): boolean {
    if (typeof amount !== 'number') return false;
    return amount > 0 && Number.isFinite(amount);
  }

  public isValidId(id: unknown): boolean {
    if (typeof id !== 'string') return false;
    return id.trim().length > 0 && id.length <= 255;
  }

  public sanitizeString(input: string, maxLength: number = 255): string {
    if (typeof input !== 'string') return '';
    return input.trim().slice(0, maxLength);
  }
}

export class ValidationException {
  public readonly errors: ValidationErrorItem[];
  public readonly statusCode: number;
  public readonly name: string;
  public readonly message: string;
  public readonly stack?: string;
  public readonly cause?: unknown;

  constructor(message: string, errors: ValidationErrorItem[]) {
    this.errors = errors;
    this.statusCode = 400;
    this.name = 'ValidationException';
    this.message = message;
    Error.captureStackTrace(this, this.constructor);
  }

  toJSON(): Record<string, unknown> {
    return {
      name: this.name,
      message: this.message,
      errors: this.errors,
      statusCode: this.statusCode
    };
  }
}

export const validationService = new ValidationService();

export function validateAmount(amount: number): { valid: boolean; errorMessage?: string } {
  if (amount === undefined || amount === null) {
    return { valid: false, errorMessage: 'Amount is required' };
  }
  if (typeof amount !== 'number' || !Number.isFinite(amount)) {
    return { valid: false, errorMessage: 'Amount must be a valid number' };
  }
  if (amount <= 0) {
    return { valid: false, errorMessage: 'Amount must be positive' };
  }
  return { valid: true };
}

export function validateOrderId(id: string): { valid: boolean; errorMessage?: string } {
  if (!id || typeof id !== 'string') {
    return { valid: false, errorMessage: 'Order ID is required' };
  }
  const trimmedId = id.trim();
  if (trimmedId.length === 0) {
    return { valid: false, errorMessage: 'Order ID cannot be empty' };
  }
  if (trimmedId.length > 255) {
    return { valid: false, errorMessage: 'Order ID exceeds maximum length' };
  }
  return { valid: true };
}