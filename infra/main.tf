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