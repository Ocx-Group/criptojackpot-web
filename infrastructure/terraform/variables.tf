variable "do_token" {
  description = "Token de API de DigitalOcean"
  type        = string
  sensitive   = true
}

variable "project_name" {
  description = "Nombre del proyecto frontend"
  type        = string
  default     = "cryptojackpot-app"
}

variable "environment" {
  description = "Ambiente de despliegue"
  type        = string

  validation {
    condition     = contains(["qa", "prod"], var.environment)
    error_message = "El ambiente debe ser qa o prod."
  }
}

variable "region" {
  description = "Región del cluster de DigitalOcean"
  type        = string
  default     = "nyc3"
}

variable "cluster_name" {
  description = "Nombre del cluster DOKS existente donde corre el backend/BFF"
  type        = string
}

variable "namespace" {
  description = "Namespace donde se desplegará el frontend"
  type        = string
  default     = "cryptojackpot"
}

variable "domain" {
  description = "Dominio del frontend para el ambiente"
  type        = string
}

variable "enable_cloudflare_dns" {
  description = "Habilita creación automática del registro DNS en Cloudflare"
  type        = bool
  default     = false
}

variable "cloudflare_api_token" {
  description = "Token API de Cloudflare para gestionar DNS"
  type        = string
  sensitive   = true
  default     = ""
}

variable "cloudflare_zone_id" {
  description = "Zone ID del dominio en Cloudflare"
  type        = string
  sensitive   = true
  default     = ""
}

variable "cloudflare_proxied" {
  description = "Habilita proxy (nube naranja) en Cloudflare"
  type        = bool
  default     = true
}

variable "create_www_record" {
  description = "Crea un CNAME www hacia el dominio principal en Cloudflare"
  type        = bool
  default     = false
}

variable "google_client_id" {
  description = "Google OAuth Client ID para frontend"
  type        = string
  default     = ""
}

variable "tags" {
  description = "Etiquetas para trazabilidad"
  type        = list(string)
  default     = ["cryptojackpot", "frontend", "terraform-managed"]
}
