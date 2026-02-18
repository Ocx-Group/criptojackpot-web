provider "digitalocean" {
  token = var.do_token
}

data "digitalocean_kubernetes_cluster" "target" {
  name = var.cluster_name
}

provider "kubernetes" {
  host                   = data.digitalocean_kubernetes_cluster.target.endpoint
  token                  = data.digitalocean_kubernetes_cluster.target.kube_config[0].token
  cluster_ca_certificate = base64decode(data.digitalocean_kubernetes_cluster.target.kube_config[0].cluster_ca_certificate)
}

provider "cloudflare" {
  api_token = var.cloudflare_api_token
}
