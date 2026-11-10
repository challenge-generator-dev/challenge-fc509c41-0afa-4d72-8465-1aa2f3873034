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