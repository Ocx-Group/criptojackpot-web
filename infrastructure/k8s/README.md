# CryptoJackpot App - Kubernetes

Esta carpeta contiene los manifests de Kubernetes del frontend `cryptojackpot-app`.

## Arquitectura

- El frontend se despliega como `Deployment` + `Service`.
- El `Ingress` enruta:
  - `/` hacia `cryptojackpot-app` (frontend Next.js).
  - `/api`, `/lottery-hub`, `/health` hacia `bff-gateway` (API gateway del backend).
- Ambos servicios se asumen en el namespace `cryptojackpot`.

## Ambientes

- `overlays/qa`: host `qa.cryptojackpot.com`, imagen tag `qa`.
- `overlays/prod`: hosts `cryptojackpot.com` y `www.cryptojackpot.com`, imagen tag `v1.0.0`.

## Despliegue

```bash
# QA
kubectl apply -k infrastructure/k8s/overlays/qa

# PROD
kubectl apply -k infrastructure/k8s/overlays/prod
```

## Variables de entorno relevantes

- `NEXT_PUBLIC_API_BASE_URL` se deja vacío para usar mismo dominio y que el Ingress enrute al BFF.
- `NEXT_PUBLIC_GOOGLE_CLIENT_ID` se define en `app-secrets.yaml`.
