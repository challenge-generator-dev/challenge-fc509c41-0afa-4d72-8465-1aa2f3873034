# Prompt para Mejorar el Codigo Base

Copia y pega el contenido del bloque de abajo en un asistente de IA (Claude, ChatGPT)
para obtener el proyecto completo y arrancable. Guarda los archivos que te devuelva en la
carpeta del repo, respetando exactamente las rutas.

Si preferis trabajar en tu editor con un agente local (Claude Code, Cursor, Copilot), usa `AGENTS.md` en vez de este archivo: dice lo mismo pero para que escriba los archivos en disco.

## Las dos reglas que no se negocian

1. **Completa el boilerplate.** Todo lo que el proyecto necesita para compilar y arrancar: manifiesto de dependencias, punto de entrada, configuracion, capa de interfaz, y las capas del patron arquitectonico declarado. Eso es andamiaje y es tu trabajo.
2. **NO resuelvas el reto.** Los entregables de las fases son el trabajo de la persona. El hueco pedagogico se deja como esta: el proyecto arranca, pero lo que el reto pide implementar NO esta implementado.

Dicho de otra forma: si algo impide compilar, arreglalo. Si algo es logica de negocio incompleta, validaciones ausentes, un secreto hardcodeado o un patron mejorable, dejalo exactamente como esta — es lo que la persona tiene que encontrar.

## Mapa de componentes

El repo tiene una carpeta por componente. Cada uno se instala y verifica dentro de la suya.

| Componente | Carpeta | Rol | Capa | Track | Tecnologias |
|---|---|---|---|---|---|
| `app` | `app/` | practice, chapter | server | Node | Express, DynamoDB |
| `infra` | `infra/` | support | infra | Terraform (AWS) | Terraform |
| `infra-local` | (raiz) | support | infra | Compose local | DynamoDB |

## Orden de arranque

1. `docker compose up -d` (en la raiz) — levanta la infraestructura local.
2. `cd infra && terraform fmt -check -recursive && terraform init -backend=false && terraform validate` — componente `infra` (support).
3. `cd app && npm install && npm run build` — componente `app` (practice, chapter).

### Contratos entre componentes

- `app` expone http (api: http://localhost:3000):
  - `POST /orders`
  - `GET /orders/:id`
  - `PUT /orders/:id`
  - `DELETE /orders/:id`

## Herramientas

- **Terraform**: Herramienta de trabajo del candidato: usala en la fase donde se depura o se prueba la solucion (no es una dependencia del proyecto).

## Lo que le falta a este proyecto

Esto NO lo tenes que adivinar: salio de comparar el proyecto contra la arquitectura declarada del reto y de un analisis estatico del codigo. Completalo TODO.

### Boilerplate del stack que falta

Sin esto no compila ni arranca. Es andamiaje, no toca nada de lo pedagogico:

- **app/src/app.module.ts** — Sin el modulo raiz, Nest no tiene arbol de dependencias que resolver y el bootstrap falla.

### Referencias colgando en el codigo que si esta

Cada una rompe la compilacion:

- `app/src/utils/validation.ts` — `ValidationErrorItem.map`: Se invoca `map` sobre `ValidationErrorItem`, pero esa clase no declara ese metodo. Agregalo con su implementacion real, o usa uno de los que si declara.

## Como saber que terminaste

```bash
(cd app && npm install && npm run build) && (cd infra && terraform fmt -check -recursive && terraform init -backend=false && terraform validate) && docker compose config -q
```

Ese comando corriendo sin errores es la definicion de "listo".

---

```
## Briefing del reto (autoridad)
Este bloque manda sobre los archivos adjuntos. El stack y el rol salen de AQUÍ, no de un topic genérico ni de markdown placeholder.

### Perfil
Chapter Backend, Especialidad Desarrollador, Tecnología Node, Advanced L2

### Brecha de conocimiento
CRUD de ordenes en DynamoDB expuesto por una API REST (corrida e2e 20261110115758191), Implementa operaciones CRUD de ordenes sobre una tabla DynamoDB expuestas por una API REST

### Misión / candidato
Persistir y consultar ordenes

### Reto
- Tema: CRUD de ordenes sobre DynamoDB
- Seniority: advanced-l2
- Tipo: practical
- Título: Implementación de CRUD de órdenes en DynamoDB
- Tiempo estimado: 6 horas

### Fases (trabajo del HUMANO — PROHIBIDO completarlas)
No implementes estos entregables. Dejalos como hueco pedagógico. El asistente solo materializa el proyecto arrancable para que el participante pueda trabajar.
- Fase 1: Creación de órdenes — objetivo: Permitir la creación de nuevas órdenes con validación de campos. — entregable (NO resolver): Una API REST que permite la creación de nuevas órdenes con validación de campos.
- Fase 2: Lectura de órdenes — objetivo: Permitir la consulta de órdenes por identificador. — entregable (NO resolver): Una API REST que permite la consulta de órdenes por identificador.
- Fase 3: Actualización de órdenes — objetivo: Permitir la actualización de órdenes con validación de campos. — entregable (NO resolver): Una API REST que permite la actualización de órdenes con validación de campos.

Eres un asistente experto en análisis, corrección y generación de archivos de cualquier tipo:
código fuente, documentación, hojas de cálculo, documentos Word, configuraciones, entre otros.
Voy a enviarte una cadena de texto que contiene uno o más archivos. Cada archivo está delimitado por un marcador con el siguiente formato:
// === ARCHIVO: ruta/del/archivo.extension ===
o también puede aparecer como:
## === ARCHIVO: ruta/del/archivo.extension ===
Lo que sigue al marcador puede ser:

El contenido real del archivo (código, texto, YAML, etc.)
Una descripción en lenguaje natural de lo que debe contener el archivo


TU TAREA
PASO 0 — ¿Esto es un proyecto o una carcasa?
Antes de extraer archivos, leé el Briefing (si está) y diagnosticá el adjunto.

Es CARCASA si ocurre CUALQUIERA de estas:
- No hay manifiesto de dependencias del stack del briefing (manifest.json de VTEX IO / package.json / pom.xml / build.gradle / requirements.txt / go.mod / *.tf / *.csproj, según corresponda)
- Hay un "binario" que en realidad es un comentario ("no puede ser mostrado como texto plano", placeholder .fig/.docx vacío)
- Los markdowns ya completan entregables de fases posteriores ("se implementó fade-in", lista de áreas ya resuelta)

Si es CARCASA:
- MATERIALIZÁ un proyecto que arranca en el stack del briefing (VTEX IO Store Framework, Angular, Terraform, pytest, Nest, etc.). Incluí manifiesto, punto de entrada y capa de interfaz reales.
- NO copies los markdowns de "solución" como si fueran el producto. Son ruido de generación.
- NO resuelvas las fases del briefing (están marcadas PROHIBIDO). Dejá el hueco pedagógico: el flujo existe, las microinteracciones/calidad/infra que el reto pide NO están hechas.
- Después seguí al PASO 5 (entrega de archivos).

Si es un proyecto REAL (manifiesto + código que compila o arranca):
- Seguí PASO 1 en adelante. 🔴 compilación sí. 🟡 pedagógico no.

PASO 1 — Detección y extracción
Identifica todos los archivos presentes en la cadena. Para cada archivo extrae:

Su ruta completa (ej: src/main/java/com/pragma/Service.java)
Su contenido o descripción

PASO 2 — Clasificación por tipo
Clasifica cada archivo en una de estas categorías:
A) Código fuente (Java, Python, TypeScript, JavaScript, Kotlin, etc.)
B) Configuración / documentación (YAML, properties, Markdown, JSON, txt, etc.)
C) Excel (.xlsx, .xls, .csv)
D) Word (.docx, .doc)
E) Otro tipo de archivo binario o especial
PASO 3 — Clasificación de errores en código fuente

Objetivo prioritario: que el proyecto compile. No corrijas flujo de negocio ni lógica funcional.

Antes de modificar cualquier archivo de código fuente, clasifica cada problema encontrado en una de estas dos categorías:
🔴 ERROR DE COMPILACIÓN — corregir siempre
Son errores que impiden que el proyecto arranque, sin valor pedagógico:

Import faltante o incorrecto
Clase, método o variable referenciada que no existe en ningún archivo del proyecto
Error de sintaxis
Anotación con atributos inválidos
Dependencia ausente en pom.xml, package.json, etc.
Archivo referenciado que no existe y debe ser creado con implementación mínima

→ CORREGIR estos errores.
🟡 PROBLEMA FUNCIONAL O DE CALIDAD — preservar siempre
Son problemas que no impiden compilar. Pueden ser intencionales para el aprendizaje:

Clave secreta hardcodeada ("secret", "password123")
API deprecada que funciona pero tiene reemplazo moderno
Lógica de negocio incorrecta o incompleta
Código redundante o de baja legibilidad
Falta de validaciones en flujo de negocio
Patrones de diseño incorrectos pero funcionales
Concurrencia no segura
Configuración funcional pero no óptima

→ PRESERVAR tal cual. No corregir, no mejorar, no comentar.
PASO 4 — Procesamiento según tipo de archivo
Tipo A — Código fuente
Aplica únicamente las correcciones clasificadas como 🔴 ERROR DE COMPILACIÓN.
No alteres ningún elemento clasificado como 🟡 PROBLEMA FUNCIONAL O DE CALIDAD.
Si falta un archivo referenciado, créalo con la implementación mínima necesaria para compilar.
Tipo B — Configuración / documentación
Extrae el contenido tal cual, sin modificaciones salvo errores evidentes de sintaxis
(ej: YAML mal indentado).
Tipo C — Excel (.xlsx)
Si viene con contenido real, genera el archivo respetando ese contenido.
Si viene con descripción en lenguaje natural, genera un archivo Excel funcional con:

Fila de encabezados en negrita con color de fondo distintivo
Columnas con ancho ajustado al contenido
Tipos de dato correctos por columna
Validaciones si la descripción lo indica
Hojas nombradas descriptivamente si hay más de una
Filas de ejemplo si no hay datos reales

Tipo D — Word (.docx)
Si viene con contenido real, genera el archivo respetando ese contenido.
Si viene con descripción en lenguaje natural, genera un documento Word funcional con:

Estilos de título (Título 1, Título 2) para jerarquía de secciones
Fuente legible (Calibri o equivalente), tamaño 11-12pt para cuerpo
Márgenes estándar
Tabla de contenido si tiene múltiples secciones
Tablas con encabezados en negrita si aplica

Tipo E — Otro
Genera el archivo con el contenido o estructura más apropiada según la descripción.
PASO 5 — Entrega de archivos
Entregá cada archivo con su ruta completa, respetando exactamente la estructura de rutas
indicada por los marcadores: un bloque por archivo, precedido por su ruta. No generes ZIPs
ni archivos adjuntos.
La entrega debe incluir:

Archivos de código con únicamente los errores de compilación corregidos
Archivos de configuración y documentación sin cambios
Archivos nuevos creados para resolver dependencias de compilación faltantes
Archivos Excel y Word generados desde descripción

IMPORTANTE: Entregá los archivos completos al finalizar. No preguntes si el usuario
quiere recibirlos. Simplemente entregalos; No debes desplegar en el chat el resumen de lo que arreglaste, solo entregá los archivos.

REGLAS IMPORTANTES

No omitas ningún archivo aunque no tenga errores ni modificaciones
Respeta los nombres y rutas exactas indicadas por los marcadores
Si un archivo no tiene marcador claro, infiere el nombre desde su contenido
Si la cadena contiene solo documentación, placeholders o binarios fake, NO la reproduzcas:
aplicá PASO 0 (materializar el proyecto del briefing). Reproducir la carcasa es un fallo.
No agregues texto después del último archivo entregado
No preguntes si el usuario quiere los archivos: simplemente entregalos siempre
Si detectas que falta un archivo de configuración necesario para compilar
(pom.xml, package.json, requirements.txt, build.gradle, etc.), créalo e inclúyelo
inferiendo su contenido desde los imports y frameworks detectados en el código
Nunca corrijas problemas 🟡 aunque parezcan obvios o fáciles de mejorar.
El participante que recibirá este proyecto los debe encontrar y resolver él mismo.


INPUT
Aquí está la cadena con los archivos:

// === ARCHIVO: app/package.json ===
{
  "name": "order-service",
  "version": "1.0.0",
  "description": "Servicio CRUD de órdenes sobre DynamoDB",
  "main": "dist/main.js",
  "scripts": {
    "build": "tsc",
    "start": "node dist/main.js",
    "dev": "ts-node src/main.ts",
    "test": "jest",
    "lint": "eslint 'src/**/*.ts'"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "dependencies": {
    "express": "4.21.0",
    "aws-sdk": "2.1691.0",
    "@aws-sdk/client-dynamodb": "3.658.0",
    "@aws-sdk/lib-dynamodb": "3.658.0",
    "class-validator": "0.14.1",
    "class-transformer": "0.5.1",
    "winston": "3.15.0",
    "dotenv": "16.4.5",
    "reflect-metadata": "0.2.2",
    "logform": "^2.6.1"
  },
  "devDependencies": {
    "@types/express": "4.17.21",
    "@types/node": "22.7.4",
    "@types/supertest": "6.0.2",
    "typescript": "^5.7.3",
    "ts-node": "10.9.2",
    "eslint": "8.57.0",
    "@typescript-eslint/parser": "7.18.0",
    "@typescript-eslint/eslint-plugin": "7.18.0",
    "jest": "29.7.0",
    "@types/jest": "29.5.12",
    "supertest": "6.3.4"
  }
}

// === ARCHIVO: app/tsconfig.json ===
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "commonjs",
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true,
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "**/*.spec.ts"]
}

// === ARCHIVO: app/src/domain/models/Order.ts ===
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

// === ARCHIVO: app/src/domain/repositories/OrderRepository.ts ===
import { Order } from '../models/Order';

export interface OrderRepository {
    create(order: Order): Promise<Order>;
    findById(id: string): Promise<Order | null>;
    update(id: string, order: Partial<Order>): Promise<Order>;
    delete(id: string): Promise<void>;
}

// === ARCHIVO: app/src/application/dto/CreateOrderDTO.ts ===
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

// === ARCHIVO: app/src/application/dto/UpdateOrderDTO.ts ===
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

// === ARCHIVO: app/src/application/services/OrderService.ts ===
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

// === ARCHIVO: app/src/infrastructure/config/dynamoConfig.ts ===
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';

const getEnvVariable = (key: string, defaultValue?: string): string => {
    const value = process.env[key];
    if (!value && !defaultValue) {
        throw new Error(`Missing required environment variable: ${key}`);
    }
    return value || defaultValue!;
};

export interface DynamoDBConfig {
    region: string;
    endpoint?: string;
    credentials: {
        accessKeyId: string;
        secretAccessKey: string;
    };
    tableName: string;
}

export const dynamoDBConfig: DynamoDBConfig = {
    region: getEnvVariable('AWS_REGION', 'us-east-1'),
    endpoint: getEnvVariable('DYNAMODB_ENDPOINT'),
    credentials: {
        accessKeyId: getEnvVariable('AWS_ACCESS_KEY_ID'),
        secretAccessKey: getEnvVariable('AWS_SECRET_ACCESS_KEY'),
    },
    tableName: getEnvVariable('DYNAMODB_TABLE_NAME', 'orders'),
};

const createDynamoDBClient = (): DynamoDBClient => {
    const clientConfig: ConstructorParameters<typeof DynamoDBClient>[0] = {
        region: dynamoDBConfig.region,
        credentials: dynamoDBConfig.credentials,
    };

    if (dynamoDBConfig.endpoint) {
        clientConfig.endpoint = dynamoDBConfig.endpoint;
    }

    return new DynamoDBClient(clientConfig);
};

export const documentClient: DynamoDBDocumentClient = DynamoDBDocumentClient.from(createDynamoDBClient(), {
    marshallOptions: {
        removeUndefinedValues: true,
        convertClassInstanceToMap: true,
    },
    unmarshallOptions: {
        wrapNumbers: false,
    },
});

export const getTableName = (): string => dynamoDBConfig.tableName;

// === ARCHIVO: app/src/infrastructure/repositories/DynamoOrderRepository.ts ===
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

// === ARCHIVO: app/src/infrastructure/controllers/OrderController.ts ===
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

// === ARCHIVO: app/src/infrastructure/middleware/errorHandler.ts ===
import { Request, Response, NextFunction } from 'express';
import { logger } from '../../utils/logger';
import { ValidationErrorDTO } from '../../application/dto/CreateOrderDTO';
import { NotFoundErrorDTO } from '../../application/dto/CreateOrderDTO';

export interface AppError extends Error {
  statusCode?: number;
  isOperational?: boolean;
}

export const errorHandler = (
  err: AppError,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  const statusCode = err.statusCode || 500;
  const errorMessage = err.message || 'Internal Server Error';

  logger.error(`Error occurred: ${errorMessage}`, {
    statusCode,
    stack: err.stack,
    name: err.name,
  });

  if (err instanceof ValidationErrorDTO) {
    res.status(400).json({
      message: err.message,
      errors: err.errors,
    });
    return;
  }

  if (err instanceof NotFoundErrorDTO) {
    res.status(404).json({
      message: err.message,
    });
    return;
  }

  if (err.name === 'ValidationError' || statusCode === 400) {
    res.status(400).json({
      message: 'Validation failed',
      errors: [{ field: 'request', message: errorMessage }],
    });
    return;
  }

  if (err.name === 'UnauthorizedError' || statusCode === 401) {
    res.status(401).json({
      message: 'Unauthorized access',
    });
    return;
  }

  if (err.name === 'ForbiddenError' || statusCode === 403) {
    res.status(403).json({
      message: 'Forbidden',
    });
    return;
  }

  if (statusCode === 500) {
    res.status(500).json({
      message: 'Internal Server Error',
    });
    return;
  }

  res.status(statusCode).json({
    message: errorMessage,
  });
};

// === ARCHIVO: app/src/infrastructure/middleware/validationMiddleware.ts ===
import { Request, Response, NextFunction } from 'express';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { ValidationErrorDTO } from '../../application/dto/CreateOrderDTO';
import { logger } from '../../utils/logger';

export const validationMiddleware = <T extends object>(
  dtoClass: new (...args: unknown[]) => T
) => {
  return async (
    req: Request,
    _res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const dtoInstance = plainToInstance(dtoClass, req.body);
      const errors = await validate(dtoInstance as Record<string, unknown>);

      if (errors.length > 0) {
        const validationErrors: { [key: string]: string[] } = {};
        
        for (const error of errors) {
            const fieldMessages: string[] = [];
            if (error.constraints) {
                for (const msg of Object.values(error.constraints)) {
                    fieldMessages.push(msg);
                }
            }
            validationErrors[error.property] = fieldMessages;
        }

        logger.warn('Validation failed', {
          path: req.path,
          method: req.method,
          errors: validationErrors,
        });

        const validationError = new ValidationErrorDTO(
          'Validation failed',
          validationErrors
        );
        next(validationError);
        return;
      }

      (req as Request & { validatedBody: T }).validatedBody = dtoInstance;
      next();
    } catch (error) {
      logger.error('Error in validation middleware', {
        error: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
      });
      next(error);
    }
  };
};

// === ARCHIVO: app/src/utils/logger.ts ===
import winston from 'winston';
import { TransformableInfo } from 'logform';

const logFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.printf((info: TransformableInfo) => {
    const { timestamp, level, message, stack, ...meta } = info as TransformableInfo & { [key: string]: unknown };
    let logEntry = `${timestamp} [${(level || 'info').toUpperCase()}]: ${message || ''}`;
    if (Object.keys(meta).length > 0 && meta.stack === undefined) {
      logEntry += ` ${JSON.stringify(meta)}`;
    }
    if (stack) {
      logEntry += `\n${stack}`;
    }
    return logEntry;
  })
);

const consoleTransport = new winston.transports.Console({
  format: winston.format.combine(
    winston.format.colorize(),
    logFormat
  )
});

const fileTransport = new winston.transports.File({
  filename: 'logs/error.log',
  level: 'error',
  format: logFormat
});

const combinedTransport = new winston.transports.File({
  filename: 'logs/combined.log',
  format: logFormat
});

export const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: logFormat,
  transports: [consoleTransport, fileTransport, combinedTransport],
  exitOnError: false
});

export class Logger {
  private context: string;

  constructor(context: string) {
    this.context = context;
  }

  private formatMessage(message: string, meta?: Record<string, unknown>): string {
    const metaStr = meta ? ` ${JSON.stringify(meta)}` : '';
    return `[${this.context}] ${message}${metaStr}`;
  }

  public info(message: string, meta?: Record<string, unknown>): void {
    logger.info(this.formatMessage(message, meta));
  }

  public warn(message: string, meta?: Record<string, unknown>): void {
    logger.warn(this.formatMessage(message, meta));
  }

  public error(message: string, error?: Error | Record<string, unknown>, meta?: Record<string, unknown>): void {
    if (error instanceof Error) {
      logger.error(this.formatMessage(message, meta), { stack: error.stack, ...error });
    } else if (error) {
      logger.error(this.formatMessage(message, meta), { ...error });
    } else {
      logger.error(this.formatMessage(message, meta));
    }
  }

  public debug(message: string, meta?: Record<string, unknown>): void {
    logger.debug(this.formatMessage(message, meta));
  }
}

export function createLogger(context: string): Logger {
  return new Logger(context);
}

// === ARCHIVO: app/src/utils/validation.ts ===
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

// === ARCHIVO: app/src/routes/orderRoutes.ts ===
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

// === ARCHIVO: app/src/main.ts ===
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

// === ARCHIVO: app/src/app.ts ===
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

// === ARCHIVO: infra/providers.tf ===
# Configuración de providers para Terraform
# Este archivo declara los providers necesarios para desplegar la infraestructura en AWS
# y establece las versiones requeridas para garantizar compatibilidad.

terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "5.65.0"
    }
  }
  required_version = ">= 1.9"
}

# Provider principal para AWS
# Configura la región por defecto y permite la personalización a través de variables.
provider "aws" {
  region = var.aws_region

  # Etiquetado consistente para todos los recursos creados
  default_tags {
    tags = {
      Environment = var.environment
      Project     = var.project_name
      ManagedBy   = "Terraform"
    }
  }
}

# Variables esperadas por este provider
# Estas variables se definen en variables.tf y se asignan en terraform.tfvars.



// === ARCHIVO: infra/variables.tf ===
# Variables globales para la configuración de la infraestructura
# Estas variables se utilizan en múltiples módulos y recursos para parametrizar
# el despliegue y garantizar consistencia en los nombres y configuraciones.

variable "aws_region" {
  description = "Región de AWS donde se desplegarán los recursos"
  type        = string
  default     = "us-east-1"
}

variable "environment" {
  description = "Entorno de despliegue (dev, staging, prod)"
  type        = string
  default     = "dev"
}

variable "project_name" {
  description = "Nombre del proyecto para etiquetado de recursos"
  type        = string
  default     = "orders-service"
}

variable "dynamodb_table_name" {
  description = "Nombre de la tabla DynamoDB para órdenes"
  type        = string
  default     = "orders-table"
}

variable "dynamodb_billing_mode" {
  description = "Modo de facturación para la tabla DynamoDB (PROVISIONED o PAY_PER_REQUEST)"
  type        = string
  default     = "PAY_PER_REQUEST"
}

variable "dynamodb_read_capacity" {
  description = "Capacidad de lectura provisionada (solo aplica si billing_mode es PROVISIONED)"
  type        = number
  default     = 5
}

variable "dynamodb_write_capacity" {
  description = "Capacidad de escritura provisionada (solo aplica si billing_mode es PROVISIONED)"
  type        = number
  default     = 5
}

variable "dynamodb_hash_key" {
  description = "Nombre del atributo utilizado como clave hash (partition key) en DynamoDB"
  type        = string
  default     = "order_id"
}

variable "dynamodb_range_key" {
  description = "Nombre del atributo utilizado como clave de rango (sort key) en DynamoDB"
  type        = string
  default     = ""
}

variable "dynamodb_attributes" {
  description = "Lista de atributos para la tabla DynamoDB"
  type = list(object({
    name = string
    type = string
  }))
  default = [
    {
      name = "order_id"
      type = "S"
    },
    {
      name = "order_state"
      type = "S"
    },
    {
      name = "amount"
      type = "N"
    },
    {
      name = "created_at"
      type = "S"
    }
  ]
}

variable "dynamodb_global_secondary_indexes" {
  description = "Lista de índices secundarios globales para la tabla DynamoDB"
  type = list(object({
    name            = string
    hash_key        = string
    range_key       = string
    projection_type = string
    read_capacity   = number
    write_capacity  = number
  }))
  default = []
}

variable "enable_dynamodb_point_in_time_recovery" {
  description = "Habilitar recuperación punto en el tiempo para la tabla DynamoDB"
  type        = bool
  default     = false
}

variable "dynamodb_ttl_attribute" {
  description = "Nombre del atributo utilizado para TTL en DynamoDB"
  type        = string
  default     = ""
}

// === ARCHIVO: infra/modules/dynamodb/variables.tf ===
# Variables específicas para el módulo DynamoDB
# Este archivo define las variables necesarias para configurar la tabla DynamoDB
# y sus índices, permitiendo personalización por entorno.

variable "table_name" {
  description = "Nombre de la tabla DynamoDB"
  type        = string
}

variable "billing_mode" {
  description = "Modo de facturación para la tabla DynamoDB (PROVISIONED o PAY_PER_REQUEST)"
  type        = string
  default     = "PAY_PER_REQUEST"
}

variable "read_capacity" {
  description = "Capacidad de lectura provisionada (solo aplica si billing_mode es PROVISIONED)"
  type        = number
  default     = 5
}

variable "write_capacity" {
  description = "Capacidad de escritura provisionada (solo aplica si billing_mode es PROVISIONED)"
  type        = number
  default     = 5
}

variable "hash_key" {
  description = "Nombre del atributo utilizado como clave hash (partition key) en DynamoDB"
  type        = string
  default     = "order_id"
}

variable "range_key" {
  description = "Nombre del atributo utilizado como clave de rango (sort key) en DynamoDB"
  type        = string
  default     = ""
}

variable "attributes" {
  description = "Lista de atributos para la tabla DynamoDB"
  type = list(object({
    name = string
    type = string
  }))
}

variable "global_secondary_indexes" {
  description = "Lista de índices secundarios globales para la tabla DynamoDB"
  type = list(object({
    name            = string
    hash_key        = string
    range_key       = string
    projection_type = string
    read_capacity   = number
    write_capacity  = number
  }))
  default = []
}

variable "enable_point_in_time_recovery" {
  description = "Habilitar recuperación punto en el tiempo para la tabla DynamoDB"
  type        = bool
  default     = false
}

variable "ttl_attribute" {
  description = "Nombre del atributo utilizado para TTL en DynamoDB"
  type        = string
  default     = ""
}

variable "environment" {
  description = "Entorno de despliegue (dev, staging, prod)"
  type        = string
  default     = "dev"
}

variable "project_name" {
  description = "Nombre del proyecto para etiquetado de recursos"
  type        = string
  default     = "orders-service"
}

// === ARCHIVO: infra/environments/dev/terraform.tfvars ===
# Configuración específica del entorno de desarrollo
# Este archivo define los valores de las variables de Terraform para el ambiente dev
# Los valores aquí especificados sobrescriben los defaults definidos en variables.tf

# Configuración de AWS
aws_region   = "us-east-1"
environment  = "dev"
project_name = "orders-service"

# Configuración de DynamoDB
dynamodb_table_name                    = "orders-service-dev-orders"
dynamodb_billing_mode                  = "PAY_PER_REQUEST"
dynamodb_read_capacity                 = 5
dynamodb_write_capacity                = 5
dynamodb_hash_key                      = "order_id"
dynamodb_range_key                     = ""
enable_dynamodb_point_in_time_recovery = false
dynamodb_ttl_attribute                 = ""

# Atributos del schema de DynamoDB
# Definidos como lista de objetos con nombre y tipo
dynamodb_attributes = [
  {
    name = "order_id"
    type = "S"
  }
]

# Índices secundarios globales (GSI)
# Vacío paradev por defecto - se pueden agregar según necesidades de consulta
dynamodb_global_secondary_indexes = []

# Tags comunes para todos los recursos
common_tags = {
  Environment = "dev"
  Project     = "orders-service"
  ManagedBy   = "terraform"
  CostCenter  = "engineering"
  Owner       = "platform-team"
}

# Habilitar outputs detallados para debugging
enable_detailed_outputs = true

# Configuración de logs y monitoreo
enable_cloudwatch_logs     = true
log_retention_days         = 7
enable_deletion_protection = false

// === ARCHIVO: infra/README.md ===
# Módulo de Infraestructura - Orders Service

Este directorio contiene la definición de infraestructura como código utilizando Terraform para el servicio de órdenes.

## Estructura del Módulo

```
infra/
├── environments/
│   └── dev/
│       └── terraform.tfvars    # Valores específicos del entorno dev
├── modules/
│   └── dynamodb/
│       ├── main.tf             # Definición del recurso DynamoDB
│       ├── variables.tf        # Variables del módulo
│       └── outputs.tf          # Salidas exportadas
├── providers.tf                # Configuración de providers AWS
├── variables.tf                # Variables globales del proyecto
├── versions.tf                 # Versiones de Terraform y providers
├── main.tf                     # Orchestración de módulos
└── outputs.tf                  # Outputs del root module
```

## Requisitos Previos

- Terraform >= 1.9 instalado localmente
- Credenciales AWS configuradas (AWS CLI o variables de entorno)
- Permisos IAM para crear recursos de DynamoDB

## Validación Local

Para validar la configuración de Terraform en tu máquina:

```bash
# Navegar al directorio infra
cd infra

# Inicializar Terraform
terraform init

# Validar sintaxis y configuración
terraform validate

# Planificar cambios (ver qué se creará)
terraform plan -var-file=environments/dev/terraform.tfvars

# Aplicar cambios (crear recursos en AWS)
terraform apply -var-file=environments/dev/terraform.tfvars
```

## Recursos Definidos

Este módulo provisioning los siguientes recursos AWS:

- **DynamoDB Table**: Tabla de órdenes con clave primaria order_id
- **billing_mode**: PAY_PER_REQUEST para optimización de costos en dev
- **Point-in-time recovery**: Opcional, deshabilitado por defecto en dev

## Variables Principales

| Variable | Descripción | Default |
|----------|-------------|---------|
| aws_region | Región AWS | us-east-1 |
| environment | Nombre del ambiente | dev |
| project_name | Nombre del proyecto | orders-service |
| dynamodb_table_name | Nombre de la tabla | orders-service-dev-orders |
| dynamodb_billing_mode | Modo de facturación | PAY_PER_REQUEST |

## Outputs Exportados

- `dynamodb_table_name`: Nombre de la tabla creada
- `dynamodb_table_arn`: ARN de la tabla para permisos IAM
- `dynamodb_table_id`: ID único de la tabla

## Limpieza de Recursos

Para destruir los recursos creados (solo en entornos no productivos):

```bash
terraform destroy -var-file=environments/dev/terraform.tfvars
```

## Notas de Seguridad

- No commitear archivos `.tfvars` con secretos a repositorios públicos
- Usar AWS Secrets Manager o Parameter Store para credenciales sensibles
- Habilitar deletion protection en producción
- Revisar permisos IAM antes de aplicar cambios

// === ARCHIVO: infra/modules/dynamodb/main.tf ===
terraform {
  required_version = ">= 1.9"
}

resource "aws_dynamodb_table" "this" {
  name           = var.table_name
  billing_mode   = var.billing_mode
  hash_key       = var.hash_key
  range_key      = var.range_key != "" ? var.range_key : null
  read_capacity  = var.billing_mode == "PROVISIONED" ? var.read_capacity : null
  write_capacity = var.billing_mode == "PROVISIONED" ? var.write_capacity : null

  dynamic "attribute" {
    for_each = var.attributes
    content {
      name = attribute.value.name
      type = attribute.value.type
    }
  }

  dynamic "global_secondary_index" {
    for_each = var.global_secondary_indexes
    content {
      name            = global_secondary_index.value.name
      hash_key        = global_secondary_index.value.hash_key
      range_key       = lookup(global_secondary_index.value, "range_key", null)
      projection_type = global_secondary_index.value.projection_type
      read_capacity   = var.billing_mode == "PROVISIONED" ? global_secondary_index.value.read_capacity : null
      write_capacity  = var.billing_mode == "PROVISIONED" ? global_secondary_index.value.write_capacity : null
    }
  }

  dynamic "stream_specification" {
    for_each = var.enable_stream ? [1] : []
    content {
      stream_view_type = var.stream_view_type
    }
  }

  point_in_time_recovery {
    enabled = var.enable_point_in_time_recovery
  }

  dynamic "ttl" {
    for_each = var.ttl_attribute != "" ? [var.ttl_attribute] : []
    content {
      attribute_name = ttl.value
      enabled        = true
    }
  }

  tags = merge(
    var.environment != "" ? { Environment = var.environment } : {},
    var.project_name != "" ? { Project = var.project_name } : {},
    var.table_name != "" ? { Name = var.table_name } : {},
    var.additional_tags
  )
}

resource "aws_dynamodb_contributor_insights" "this" {
  count      = var.enable_contributor_insights ? 1 : 0
  table_name = aws_dynamodb_table.this.name
}

variable "additional_tags" {
  type        = map(string)
  default     = {}
  description = "Etiquetas adicionales para recursos AWS"
}

variable "enable_stream" {
  type        = bool
  default     = false
  description = "Habilita DynamoDB Streams para la tabla"
}

variable "stream_view_type" {
  type        = string
  default     = "NEW_AND_OLD_IMAGES"
  description = "Tipo de vista de stream: KEYS_ONLY, NEW_IMAGE, OLD_IMAGE, NEW_AND_OLD_IMAGES"
}

variable "enable_contributor_insights" {
  type        = bool
  default     = false
  description = "Habilita Contributor Insights para análisis de acceso"
}

// === ARCHIVO: infra/modules/dynamodb/outputs.tf ===
output "table_name" {
  description = "Nombre de la tabla DynamoDB"
  value       = aws_dynamodb_table.this.name
}

output "table_arn" {
  description = "ARN completo de la tabla DynamoDB"
  value       = aws_dynamodb_table.this.arn
}

output "table_id" {
  description = "ID único de la tabla DynamoDB"
  value       = aws_dynamodb_table.this.id
}

output "table_stream_arn" {
  description = "ARN del stream de DynamoDB si está habilitado"
  value       = var.enable_stream ? aws_dynamodb_table.this.stream_arn : null
  sensitive   = false
}

output "table_stream_label" {
  description = "Etiqueta del stream más reciente"
  value       = var.enable_stream ? aws_dynamodb_table.this.stream_label : null
  sensitive   = false
}

output "contributor_insights_status" {
  description = "Estado de Contributor Insights si está habilitado"
  value       = var.enable_contributor_insights ? aws_dynamodb_contributor_insights.this[0].status : "NOT_ENABLED"
}

output "hash_key_attribute_name" {
  description = "Nombre del atributo de clave de partición"
  value       = var.hash_key
}

output "range_key_attribute_name" {
  description = "Nombre del atributo de clave de ordenación"
  value       = var.range_key
}

output "billing_mode" {
  description = "Modo de facturación de la tabla"
  value       = aws_dynamodb_table.this.billing_mode
}

// === ARCHIVO: infra/versions.tf ===
terraform {
  required_version = ">= 1.9"

  backend "local" {
    path = "terraform.tfstate"
  }
}

// === ARCHIVO: infra/main.tf ===
# Configuración principal de Terraform para el servicio de órdenes
# Este archivo orquesta la creación de recursos AWS necesarios

// Módulo de DynamoDB para la tabla de órdenes
// Configurado con parámetros flexibles vía variables
module "dynamodb" {
  source = "./modules/dynamodb"

  // Nombre de la tabla derivado del proyecto y entorno
  table_name = "${var.project_name}-${var.environment}"

  // Modo de facturación: PAY_PER_REQUEST para desarrollo, PROVISIONED para producción
  billing_mode = var.dynamodb_billing_mode

  // Capacidades de lectura/escritura solo aplicables en modo PROVISIONED
  read_capacity  = var.dynamodb_read_capacity
  write_capacity = var.dynamodb_write_capacity

  // Clave de partición primaria para la tabla de órdenes
  hash_key = var.dynamodb_hash_key

  // Clave de ordenación opcional para consultas por rango
  range_key = var.dynamodb_range_key != "" ? var.dynamodb_range_key : null

  // Atributos del esquema de DynamoDB
  attributes = var.dynamodb_attributes

  // Índices secundarios globales para consultas alternativas
  global_secondary_indexes = var.dynamodb_global_secondary_indexes

  // Habilitar recuperación a punto en el tiempo para compliance
  enable_point_in_time_recovery = var.enable_dynamodb_point_in_time_recovery

  // Configuración de TTL para limpieza automática de órdenes antiguas
  ttl_attribute = var.dynamodb_ttl_attribute != "" ? var.dynamodb_ttl_attribute : null

  // Metadatos para etiquetado y trazabilidad
  environment  = var.environment
  project_name = var.project_name

  // Tags adicionales para recursos AWS
  additional_tags = {
    ManagedBy   = "Terraform"
    Project     = var.project_name
    Environment = var.environment
    CostCenter  = "Platform"
  }
}

// Resource para configurar CloudWatch Contributor Insights
// Provee visibilidad de patrones de acceso a la tabla
resource "aws_dynamodb_contributor_insights" "orders_table" {
  count = var.environment == "prod" ? 1 : 0

  table_name = module.dynamodb.table_name
  enabled    = true

  depends_on = [module.dynamodb]
}

// Resource para Exportación de tablas a S3 (backup)
// Habilitado solo en producción para estrategia de recuperación
resource "aws_dynamodb_table_export" "orders_backup" {
  count = var.environment == "prod" ? 1 : 0

  table_arn     = module.dynamodb.table_arn
  export_format = "DYNAMODB_JSON"
  s3_bucket     = "${var.project_name}-backups-${var.environment}"
  s3_prefix     = "dynamodb-exports/"
  export_time   = timestamp()

  depends_on = [
    module.dynamodb,
    aws_s3_bucket_policy.backup_bucket_policy[0]
  ]
}

// Resource de política de S3 para permitir exportación de DynamoDB
resource "aws_s3_bucket_policy" "backup_bucket_policy" {
  count = var.environment == "prod" ? 1 : 0

  bucket = "${var.project_name}-backups-${var.environment}"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Sid    = "AllowDynamoDBExport"
      Effect = "Allow"
      Principal = {
        Service = "dynamodb.amazonaws.com"
      }
      Action = [
        "s3:PutObject",
        "s3:GetObject",
        "s3:AbortMultipartUpload",
        "s3:ListMultipartUploadParts",
        "s3:ListBucketMultipartUploads"
      ]
      Resource = [
        "arn:aws:s3:::${var.project_name}-backups-${var.environment}",
        "arn:aws:s3:::${var.project_name}-backups-${var.environment}/*"
      ]
      Condition = {
        StringEquals = {
          "aws:SourceAccount" = data.aws_caller_identity.current.account_id
        }
      }
    }]
  })
}

// Data source para obtener información de la cuenta AWS actual
data "aws_caller_identity" "current" {}

// Data source para obtener la región actual de AWS
data "aws_region" "current" {}

// Resource de SNS para notificaciones de errores en operaciones de órdenes
resource "aws_sns_topic" "orders_errors" {
  count = var.environment == "prod" ? 1 : 0

  name              = "${var.project_name}-${var.environment}-errors"
  display_name      = "Orders Service Error Notifications"
  kms_master_key_id = "alias/aws/sns"

  tags = {
    Environment = var.environment
    Project     = var.project_name
  }
}

// Resource de SNS para notificaciones de cambios en órdenes
resource "aws_sns_topic" "orders_changes" {
  count = var.environment != "local" ? 1 : 0

  name              = "${var.project_name}-${var.environment}-changes"
  display_name      = "Orders Service Change Notifications"
  kms_master_key_id = "alias/aws/sns"

  tags = {
    Environment = var.environment
    Project     = var.project_name
  }
}

// === ARCHIVO: infra/outputs.tf ===
# Outputs del módulo de infraestructura
# Exporta los valores críticos de los recursos creados para consumo externo

# Output principal: nombre de la tabla DynamoDB
output "dynamodb_table_name" {
  description = "Nombre de la tabla DynamoDB de órdenes"
  value       = module.dynamodb.table_name
}

# Output principal: ARN de la tabla DynamoDB
output "dynamodb_table_arn" {
  description = "ARN completo de la tabla DynamoDB"
  value       = module.dynamodb.table_arn
}

# Output principal: ID de la tabla DynamoDB
output "dynamodb_table_id" {
  description = "ID único de la tabla DynamoDB"
  value       = module.dynamodb.table_id
}

# Output: ARN del stream de DynamoDB para captura de cambios
output "dynamodb_stream_arn" {
  description = "ARN del stream de DynamoDB para captura de cambios"
  value       = module.dynamodb.table_stream_arn
}

# Output: Etiqueta del stream de DynamoDB
output "dynamodb_stream_label" {
  description = "Etiqueta del stream de DynamoDB"
  value       = module.dynamodb.table_stream_label
}

# Output: Estado de Contributor Insights
output "contributor_insights_status" {
  description = "Estado de Contributor Insights (ACTIVE/DISABLED)"
  value       = module.dynamodb.contributor_insights_status
  depends_on  = [aws_dynamodb_contributor_insights.orders_table]
}

# Output: Nombre del atributo de clave de partición
output "hash_key_attribute_name" {
  description = "Nombre del atributo de clave de partición"
  value       = module.dynamodb.hash_key_attribute_name
}

# Output: Nombre del atributo de clave de ordenación
output "range_key_attribute_name" {
  description = "Nombre del atributo de clave de ordenación (vacío si no existe)"
  value       = module.dynamodb.range_key_attribute_name
}

# Output: Modo de facturación de la tabla
output "billing_mode" {
  description = "Modo de facturación (PAY_PER_REQUEST o PROVISIONED)"
  value       = module.dynamodb.billing_mode
}

# Output: Topic SNS para errores (solo producción)
output "sns_orders_errors_topic_arn" {
  description = "ARN del topic SNS para notificaciones de errores"
  value       = var.environment == "prod" ? aws_sns_topic.orders_errors[0].arn : ""
}

# Output: Topic SNS para cambios en órdenes
output "sns_orders_changes_topic_arn" {
  description = "ARN del topic SNS para notificaciones de cambios"
  value       = var.environment != "local" ? aws_sns_topic.orders_changes[0].arn : ""
}

# Output: Información de la cuenta AWS
output "aws_account_id" {
  description = "ID de la cuenta AWS"
  value       = data.aws_caller_identity.current.account_id
}

# Output: Región de AWS
output "aws_region" {
  description = "Región de AWS"
  value       = data.aws_region.current.name
}

# Output: Endpoint de DynamoDB para la aplicación
output "dynamodb_endpoint" {
  description = "Endpoint de DynamoDB para configuración de la aplicación"
  value       = "https://dynamodb.${data.aws_region.current.name}.amazonaws.com"
}

# Output: Export ARN para backups (solo producción)
output "dynamodb_export_bucket" {
  description = "Bucket S3 para exportación de backups"
  value       = var.environment == "prod" ? "${var.project_name}-backups-${var.environment}" : ""
}

# Output: Nombre del bucket de backups (para referencia en otras configuraciones)
output "backup_bucket_name" {
  description = "Nombre del bucket S3 para backups"
  value       = var.environment == "prod" ? "${var.project_name}-backups-${var.environment}" : ""
}

# Output: Estado de point-in-time recovery
output "dynamodb_pitr_enabled" {
  description = "Indica si point-in-time recovery está habilitado"
  value       = var.enable_dynamodb_point_in_time_recovery
}

# Output: Nombre del attribute TTL configurado
output "dynamodb_ttl_attribute" {
  description = "Nombre del atributo TTL configurado en la tabla"
  value       = var.dynamodb_ttl_attribute
}

# Output: Tags aplicados a los recursos
output "resource_tags" {
  description = "Tags aplicados a los recursos de infraestructura"
  value = {
    project     = var.project_name
    environment = var.environment
    managed_by  = "terraform"
  }
}

// === ARCHIVO: docker-compose.yml ===
# Infraestructura local del reto. SOLO desarrollo: credenciales de ejemplo (local-dev-only), puertos en loopback.
# Levantar: docker compose up -d --wait
name: infra-local
services:
  dynamodb-local:
    image: "amazon/dynamodb-local:2.5.2"
    command: ["-jar","DynamoDBLocal.jar","-sharedDb","-inMemory"]
    ports:
      - "127.0.0.1:8000:8000"
    healthcheck:
      test: ["CMD-SHELL","bash -c ':> /dev/tcp/127.0.0.1/8000' || exit 1"]
      interval: 10s
      timeout: 5s
      retries: 10
      start_period: 5s


// === ARCHIVO: infra-local/README.md ===
# Infraestructura local

Servicios de soporte para el reto, definidos en `docker-compose.yml` (raiz del repo).

```bash
docker compose up -d --wait
```

| Servicio | Imagen | Puertos (host) |
|---|---|---|
| DynamoDB Local | `amazon/dynamodb-local:2.5.2` | 8000 |

Credenciales: solo de desarrollo local (`local-dev-only`, `local`). No son secretos ni deben reutilizarse.
Los scripts de `infra-local/` (tablas, topics) se ejecutan con el compose en estado healthy.


// === ARCHIVO: infra-local/dynamodb/create-tables.sh ===
#!/usr/bin/env bash
# Crea las tablas en DynamoDB Local (idempotente). Credenciales dummy: DynamoDB Local no valida firmas.
set -euo pipefail

export AWS_ACCESS_KEY_ID=local
export AWS_SECRET_ACCESS_KEY=local
export AWS_REGION=us-east-1
ENDPOINT="${DYNAMODB_ENDPOINT:-http://localhost:8000}"

create_table() {
  local name="$1" pk="$2" sk="${3:-}"
  if aws dynamodb describe-table --table-name "$name" --endpoint-url "$ENDPOINT" >/dev/null 2>&1; then
    echo "Tabla $name ya existe"
    return
  fi
  local attrs="AttributeName=$pk,AttributeType=S"
  local keys="AttributeName=$pk,KeyType=HASH"
  if [ -n "$sk" ]; then
    attrs="$attrs AttributeName=$sk,AttributeType=S"
    keys="$keys AttributeName=$sk,KeyType=RANGE"
  fi
  # shellcheck disable=SC2086
  aws dynamodb create-table --table-name "$name" --attribute-definitions $attrs --key-schema $keys \
    --billing-mode PAY_PER_REQUEST --endpoint-url "$ENDPOINT" >/dev/null
  echo "Tabla $name creada"
}

create_table "app-items" "id"

```
