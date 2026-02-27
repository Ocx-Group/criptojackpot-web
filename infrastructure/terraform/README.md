# CriptoJackpot App - Terraform

Terraform para preparar infraestructura del frontend en el cluster donde ya corre el backend/BFF.

## Que gestiona

- Conexion al cluster DOKS existente por nombre (`cluster_name`).
- Namespace destino (`cryptojackpot` por defecto).
- Secret `app-secrets` con `NEXT_PUBLIC_GOOGLE_CLIENT_ID`.
- `deploy-config.json` para trazabilidad del ambiente (incluye `api_base_url`).
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

## DNS en produccion

`environments/prod.tfvars` ya viene con:

- `enable_cloudflare_dns = true`
- `cloudflare_proxied = true`
- `create_www_record = true`

Terraform crea:

- Registro `A` de `criptojackpot.com` al IP del LB de `ingress-nginx`.
- Registro `CNAME` de `www` apuntando a `criptojackpot.com`.

## Alineacion con backend

El frontend se despliega en el **mismo cluster** que el backend. Los valores criticos que deben coincidir:

| Variable | QA | Prod |
|---|---|---|
| `cluster_name` | `criptojackpot-qa-cluster` | `criptojackpot-prod-cluster` |
| `namespace` | `cryptojackpot` | `cryptojackpot` |
| `domain` | `qa.criptojackpot.com` | `criptojackpot.com` |
| `api_base_url` | `https://api-qa.criptojackpot.com` | `https://api.criptojackpot.com` |
