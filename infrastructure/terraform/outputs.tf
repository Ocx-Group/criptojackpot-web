output "cluster_name" {
  description = "Nombre del cluster donde se despliega el frontend"
  value       = data.digitalocean_kubernetes_cluster.target.name
}

output "cluster_id" {
  description = "ID del cluster DOKS"
  value       = data.digitalocean_kubernetes_cluster.target.id
}

output "namespace" {
  description = "Namespace objetivo"
  value       = kubernetes_namespace_v1.app.metadata[0].name
}

output "deploy_overlay" {
  description = "Overlay kustomize a aplicar para este ambiente"
  value       = "infrastructure/k8s/overlays/${var.environment}"
}

output "api_base_url" {
  description = "URL base del BFF Gateway del backend consumida por el frontend"
  value       = var.api_base_url
}

output "frontend_url" {
  description = "URL publica del frontend"
  value       = "https://${var.domain}"
}

output "kubectl_connect_command" {
  description = "Comando para conectar kubectl al cluster"
  value       = "doctl kubernetes cluster kubeconfig save ${data.digitalocean_kubernetes_cluster.target.id}"
}

output "cloudflare_dns_hostname" {
  description = "Hostname del registro DNS creado en Cloudflare"
  value       = length(cloudflare_record.frontend_endpoint) > 0 ? cloudflare_record.frontend_endpoint[0].hostname : "Not configured or pending"
  sensitive   = true
}

output "cloudflare_www_hostname" {
  description = "Hostname del registro www en Cloudflare"
  value       = length(cloudflare_record.frontend_www) > 0 ? cloudflare_record.frontend_www[0].hostname : "Not configured"
  sensitive   = true
}

output "ingress_load_balancer_ip" {
  description = "IP del Load Balancer de ingress-nginx"
  value       = local.ingress_lb_ip
}

output "cmd_kustomize_apply" {
  description = "Comando para desplegar los manifiestos Kubernetes del frontend"
  value       = "kubectl apply -k infrastructure/k8s/overlays/${var.environment}"
}
