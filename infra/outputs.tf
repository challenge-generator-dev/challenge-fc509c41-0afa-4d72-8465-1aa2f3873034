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