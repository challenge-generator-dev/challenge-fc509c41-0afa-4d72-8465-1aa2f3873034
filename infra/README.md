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