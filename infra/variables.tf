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