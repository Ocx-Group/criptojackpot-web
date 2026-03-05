environment = "qa"
region      = "nyc3"

# Debe ser el cluster donde vive el backend y el servicio bff-gateway
cluster_name = "criptojackpot-qa-cluster"
namespace    = "criptojackpot"
domain       = "qa.criptojackpot.com"

# URL del BFF Gateway del backend para este ambiente
api_base_url = "https://api-qa.criptojackpot.com"

# Para QA normalmente no se automatiza DNS por Terraform
enable_cloudflare_dns = false
