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