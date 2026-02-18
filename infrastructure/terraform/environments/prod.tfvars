environment = "prod"
region      = "nyc3"

# Debe ser el cluster donde vive el backend y el servicio bff-gateway
cluster_name = "cryptojackpot-prod-cluster"
namespace    = "cryptojackpot"
domain       = "cryptojackpot.com"

# En producción el frontend apunta a Cloudflare
enable_cloudflare_dns = true
cloudflare_proxied    = true
create_www_record     = true

# OAuth
google_client_id = "replace-with-prod-google-client-id"
