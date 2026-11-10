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