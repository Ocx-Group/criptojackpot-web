# CryptoJackpot App - Terraform

Terraform para preparar infraestructura del frontend en el cluster donde ya corre el backend/BFF.

## Qué gestiona

- Conexión al cluster DOKS existente por nombre (`cluster_name`).
- Namespace destino (`cryptojackpot` por defecto).
- Secret `app-secrets` con `NEXT_PUBLIC_GOOGLE_CLIENT_ID`.
- `deploy-config.json` para trazabilidad del ambiente.
- DNS de Cloudflare opcional (habilitado en `prod`).

## Requisitos

- `terraform >= 1.5`
- `doctl` autenticado
- Acceso al cluster DOKS existente
- Cloudflare token/zone id solo para `prod`

## Uso

```bash
cd infrastructure/terraform

terraform init

# QA
terraform plan -var-file=environments/qa.tfvars
terraform apply -var-file=environments/qa.tfvars

# PROD
terraform plan -var-file=environments/prod.tfvars
terraform apply -var-file=environments/prod.tfvars
```

## DNS en producción

`environments/prod.tfvars` ya viene con:

- `enable_cloudflare_dns = true`
- `cloudflare_proxied = true`
- `create_www_record = true`

Terraform crea:

- Registro `A` de `cryptojackpot.com` al IP del LB de `ingress-nginx`.
- Registro `CNAME` de `www` apuntando a `cryptojackpot.com`.
