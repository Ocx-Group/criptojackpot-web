# GitHub Actions — Configuracion de Secrets y Environments (Frontend)

## Repository Secrets requeridos

Ve a **Settings > Secrets and variables > Actions > New repository secret**

### Compartidos (QA y Prod)

| Secret | Descripcion |
|--------|-------------|
| `DO_TOKEN` | Token de API de DigitalOcean (`dop_v1_...`) |
| `DO_SPACES_ACCESS_KEY` | Access Key de DO Spaces (para Terraform backend remoto) |
| `DO_SPACES_SECRET_KEY` | Secret Key de DO Spaces |
| `CLOUDFLARE_API_TOKEN` | Token de Cloudflare con permiso `Zone:DNS:Edit` |
| `CLOUDFLARE_ZONE_ID` | Zone ID de `criptojackpot.com` en Cloudflare |

### QA (prefijo `QA_`)

| Secret | Descripcion |
|--------|-------------|
| `QA_GOOGLE_CLIENT_ID` | Google OAuth Client ID para QA |

### Production (prefijo `PROD_`)

| Secret | Descripcion |
|--------|-------------|
| `PROD_GOOGLE_CLIENT_ID` | Google OAuth Client ID para Prod |

> **Nota:** El frontend requiere muchos menos secrets que el backend. Las variables
> de infraestructura (Kafka, Redis, MongoDB, JWT, Brevo) solo las necesita el backend.
> El frontend solo necesita acceso a DO/Cloudflare para infra y Google OAuth para auth.

---

## Environments

Ve a **Settings > Environments**

### Environment: `qa`
- **No requiere aprobacion** (deploy automatico al hacer push a `qa`)
- Opcional: agregar reviewers si quieres un gate manual

### Environment: `production`
- **Required reviewers**: agregar 1-2 personas del equipo
- **Wait timer**: 0 minutos (la aprobacion manual ya es el gate)
- **Deployment branches**: solo rama `main`

Cuando se hace push a `main`, el job `terraform-deploy` queda en **pending** hasta que un reviewer apruebe en la UI de GitHub Actions.

---

## Terraform State

El estado de Terraform se almacena en DigitalOcean Spaces (S3-compatible):
- **Bucket:** `criptojackpot-tf-state` (compartido con el backend)
- **QA key:** `frontend-qa/terraform.tfstate`
- **Prod key:** `frontend-prod/terraform.tfstate`

Esto evita colisiones con el estado del backend que usa `qa/terraform.tfstate` y `prod/terraform.tfstate`.

---

## Flujo completo

```
developer > PR: feature/* > develop    [CI: lint + build]
                                |
           PR: develop > qa            [CI: lint + build]
                                |
           push merge > qa             [Deploy QA automatico]
                                |
           PR: qa > main               [CI: lint + build]
                                |
           push merge > main           [Deploy Prod — requiere aprobacion]
                                |
           reviewer aprueba            [Terraform apply + kustomize + smoke test]
                                |
           GitHub Release creado       [Tag automatico en GitHub]
```

---

## Creacion manual de un tag semver (release)

```bash
git checkout main
git pull
git tag v1.0.0
git push origin v1.0.0
```

El workflow de prod detecta el tag y lo usa como nombre de imagen y release.

---

## Diferencias con el backend

| Aspecto | Backend | Frontend |
|---------|---------|----------|
| Imagenes Docker | 8 microservicios | 1 imagen (Next.js) |
| Terraform state key | `qa/terraform.tfstate` | `frontend-qa/terraform.tfstate` |
| Secrets | ~12 por ambiente | ~7 compartidos + 1 por ambiente |
| Build args | N/A | `NEXT_PUBLIC_API_BASE_URL` (requerido) |
| Rollout wait | 8 deployments | 1 deployment |
| Smoke test | `/health` en BFF | `/` en frontend |
