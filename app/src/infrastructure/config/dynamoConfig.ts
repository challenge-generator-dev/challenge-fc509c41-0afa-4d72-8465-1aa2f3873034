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