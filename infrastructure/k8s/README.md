# CriptoJackpot App - Kubernetes

Esta carpeta contiene los manifests de Kubernetes del frontend `criptojackpot-app`.

## Arquitectura

- El frontend se despliega como `Deployment` + `Service`.
- El `Ingress` enruta:
  - `/` hacia `cryptojackpot-app` (frontend Next.js).
  - `/api`, `/lottery-hub`, `/health` hacia `bff-gateway` (API gateway del backend).
- Ambos servicios se asumen en el namespace `cryptojackpot`.
- TLS es gestionado por Cloudflare (sin cert-manager). El Ingress opera en HTTP plano internamente.

## Ambientes

- `overlays/qa`: host `qa.criptojackpot.com`, API `https://api-qa.criptojackpot.com`, imagen tag `qa`.
- `overlays/prod`: hosts `criptojackpot.com` y `www.criptojackpot.com`, API `https://api.criptojackpot.com`, imagen tag `v1.0.0`.

## Despliegue

```bash
# QA
kubectl apply -k infrastructure/k8s/overlays/qa

# PROD
kubectl apply -k infrastructure/k8s/overlays/prod
```

## Variables de entorno relevantes

- `NEXT_PUBLIC_API_BASE_URL` apunta al BFF Gateway del backend (`api-qa.criptojackpot.com` o `api.criptojackpot.com`).
- `NEXT_PUBLIC_GOOGLE_CLIENT_ID` se define en `app-secrets.yaml`.
- `NEXT_PUBLIC_APP_ENV` indica el ambiente (`qa` o `prod`).
