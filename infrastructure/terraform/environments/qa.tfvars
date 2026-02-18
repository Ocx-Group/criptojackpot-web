environment = "qa"
region      = "nyc3"

# Debe ser el cluster donde vive el backend y el servicio bff-gateway
cluster_name = "cryptojackpot-qa-cluster"
namespace    = "cryptojackpot"
domain       = "qa.cryptojackpot.com"

# Para QA normalmente no se automatiza DNS por Terraform
enable_cloudflare_dns = false

# OAuth
google_client_id = "replace-with-qa-google-client-id"
