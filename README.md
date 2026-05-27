# FutbolStats Pro API

API REST en Node.js/Express para consultar tabla de posiciones de fútbol con PostgreSQL, lista para ejecución local con Docker, integración continua con GitHub Actions y despliegue en Render (solo API) con base de datos externa en Aiven.

## Arquitectura

El flujo completo está documentado en [`arquitectura.png`](./arquitectura.png):

`Máquina local -> GitHub Actions (CI) -> Render Web Service -> Aiven PostgreSQL`

## Tecnologías

- Node.js 24
- Express 5
- PostgreSQL 15
- Jest + Supertest
- Docker / Docker Compose
- GitHub Actions
- Render Blueprint (`render.yaml`)

## Endpoints

- `GET /api/health`  
  Verifica estado de la API y conectividad a PostgreSQL.

- `GET /api/posiciones`  
  Retorna la tabla de posiciones ordenada por puntos y diferencia de goles.

## Ejecución local

1. Levantar infraestructura:

```bash
docker compose up -d --build
```

2. Probar salud:

```bash
curl http://localhost:3000/api/health
```

3. Ejecutar tests:

```bash
pnpm test
```

## CI (GitHub Actions)

Workflow: `.github/workflows/ci.yml`

Incluye:
- Servicio temporal de PostgreSQL.
- Variables `NODE_ENV=test` y `DATABASE_URL`.
- Instalación con `pnpm install --frozen-lockfile`.
- Ejecución de `pnpm test`.

## Despliegue en Render + Aiven

Archivo: `render.yaml`

Incluye:
- Web Service Node.js en Render.
- `healthCheckPath: /api/health`
- `autoDeployTrigger: checksPass` (despliegue automático después de CI en verde).
- Variables manuales en Render:
  - `DATABASE_URL` (URI de Aiven con `sslmode=require`)
  - `PG_CA_CERT` (opcional, recomendado: certificado CA de Aiven)

Ejemplo de `DATABASE_URL`:

```txt
postgres://USER:PASSWORD@HOST:PORT/defaultdb?sslmode=require
```

## Estructura principal

```txt
.
├── .github/workflows/ci.yml
├── Dockerfile
├── docker-compose.yml
├── render.yaml
├── arquitectura.png
├── src/
│   ├── app.js
│   └── config/db.js
└── tests/app.test.js
```
