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