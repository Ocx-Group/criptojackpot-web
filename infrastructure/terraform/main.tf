locals {
  common_tags = concat(var.tags, ["env:${var.environment}"])

  domain_parts      = split(".", var.domain)
  record_name_parts = slice(local.domain_parts, 0, length(local.domain_parts) - 2)
  dns_record_name   = length(local.record_name_parts) > 0 ? join(".", local.record_name_parts) : "@"

  cloudflare_enabled = var.enable_cloudflare_dns && var.cloudflare_api_token != "" && var.cloudflare_zone_id != ""
}

resource "kubernetes_namespace_v1" "app" {
  metadata {
    name = var.namespace
    labels = {
      "app.kubernetes.io/name"        = "criptojackpot"
      "app.kubernetes.io/managed-by"  = "terraform"
      "app.kubernetes.io/component"   = "frontend"
      "app.kubernetes.io/environment" = var.environment
    }
  }
}

resource "kubernetes_secret_v1" "app_secrets" {
  metadata {
    name      = "app-secrets"
    namespace = kubernetes_namespace_v1.app.metadata[0].name
    labels = {
      "app.kubernetes.io/part-of"     = "criptojackpot"
      "app.kubernetes.io/component"   = "frontend"
      "app.kubernetes.io/environment" = var.environment
    }
  }

  type = "Opaque"

  data = {
    NEXT_PUBLIC_GOOGLE_CLIENT_ID = var.google_client_id
  }
}

resource "local_file" "deploy_config" {
  content = jsonencode({
    project_name   = var.project_name
    environment    = var.environment
    cluster_name   = var.cluster_name
    namespace      = var.namespace
    domain         = var.domain
    api_base_url   = var.api_base_url
    deploy_overlay = "infrastructure/k8s/overlays/${var.environment}"
    tags           = local.common_tags
  })

  filename = "${path.root}/../deploy-config.json"
}

# -----------------------------------------------------------------------------
# Cloudflare DNS — apunta al Load Balancer IP del NGINX Ingress
# Reutiliza el mismo LB del backend (mismo cluster, mismo ingress-nginx)
# -----------------------------------------------------------------------------
data "kubernetes_service_v1" "ingress_nginx_controller" {
  metadata {
    name      = "ingress-nginx-controller"
    namespace = "ingress-nginx"
  }
}

locals {
  ingress_lb_ip = try(data.kubernetes_service_v1.ingress_nginx_controller.status[0].load_balancer[0].ingress[0].ip, "")
}

resource "cloudflare_record" "frontend_endpoint" {
  count = local.cloudflare_enabled && local.ingress_lb_ip != "" ? 1 : 0

  zone_id = var.cloudflare_zone_id
  name    = local.dns_record_name
  content = local.ingress_lb_ip
  type    = "A"
  proxied = var.cloudflare_proxied
  ttl     = var.cloudflare_proxied ? 1 : 300
  comment = "Managed by Terraform - ${var.project_name} ${var.environment}"
}

resource "cloudflare_record" "frontend_www" {
  count = local.cloudflare_enabled && var.create_www_record ? 1 : 0

  zone_id = var.cloudflare_zone_id
  name    = "www"
  content = var.domain
  type    = "CNAME"
  proxied = var.cloudflare_proxied
  ttl     = var.cloudflare_proxied ? 1 : 300
  comment = "Managed by Terraform - ${var.project_name} ${var.environment}"
}
