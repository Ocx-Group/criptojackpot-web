terraform {
  required_version = ">= 1.7.0"

  required_providers {
    digitalocean = {
      source  = "digitalocean/digitalocean"
      version = "~> 2.40"
    }
    kubernetes = {
      source  = "hashicorp/kubernetes"
      version = "~> 2.31"
    }
    local = {
      source  = "hashicorp/local"
      version = "~> 2.5"
    }
    cloudflare = {
      source  = "cloudflare/cloudflare"
      version = "~> 4.0"
    }
  }

  # ===========================================================================
  # BACKEND REMOTO - DigitalOcean Spaces (S3-compatible)
  # Mismo bucket que el backend (criptojackpot-tf-state) pero con keys separadas:
  #   - frontend-qa/terraform.tfstate
  #   - frontend-prod/terraform.tfstate
  #
  # Setup inicial:
  #   1. Configurar credenciales como variables de entorno:
  #      $env:AWS_ACCESS_KEY_ID     = "<spaces_access_key>"
  #      $env:AWS_SECRET_ACCESS_KEY = "<spaces_secret_key>"
  #
  #   2. Inicializar pasando la key del ambiente:
  #      terraform init -backend-config="key=frontend-qa/terraform.tfstate"
  #      terraform init -backend-config="key=frontend-prod/terraform.tfstate"
  #
  # En CI/CD (GitHub Actions), la key se pasa como variable:
  #   -backend-config="key=frontend-qa/terraform.tfstate"
  # ===========================================================================
  backend "s3" {
    endpoints = {
      s3 = "https://nyc3.digitaloceanspaces.com"
    }
    bucket = "criptojackpot-tf-state"
    # key se pasa en tiempo de init: -backend-config="key=frontend-<env>/terraform.tfstate"
    key    = "terraform.tfstate"
    region = "us-east-1" # Requerido por protocolo S3, ignorado por DO

    skip_credentials_validation = true
    skip_metadata_api_check     = true
    skip_region_validation      = true
    skip_requesting_account_id  = true
    skip_s3_checksum            = true
  }
}
