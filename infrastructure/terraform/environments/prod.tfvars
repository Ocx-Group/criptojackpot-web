environment = "prod"
region      = "nyc3"

# Debe ser el cluster donde vive el backend y el servicio bff-gateway
cluster_name = "criptojackpot-prod-cluster"
namespace    = "criptojackpot"
domain       = "criptojackpot.com"

# URL del BFF Gateway del backend para este ambiente
api_base_url = "https://api.criptojackpot.com"

# En produccion el frontend apunta a Cloudflare
enable_cloudflare_dns = true
cloudflare_proxied    = true
create_www_record     = true
