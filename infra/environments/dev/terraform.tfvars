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