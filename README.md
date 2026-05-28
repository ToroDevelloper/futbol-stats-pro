# FutbolStats Pro API

API REST en Node.js/Express para consultar tabla de posiciones de futbol con PostgreSQL. El proyecto esta preparado para desarrollo local con Docker, pruebas con Jest, CI en GitHub Actions y despliegue completo en Render con Web Service + Render PostgreSQL.

## Arquitectura

El flujo esta documentado en [`arquitectura.png`](./arquitectura.png):

```txt
Maquina local -> GitHub Actions (CI) -> Render Web Service + Render PostgreSQL
```

## Tecnologias

- Node.js 24
- Express 5
- PostgreSQL 15
- Jest + Supertest
- Docker / Docker Compose
- GitHub Actions
- Render Blueprint (`render.yaml`)

## Endpoints

- `GET /api/health`: liveness check de la API para Render.
- `GET /api/health/db`: readiness check de conexion a PostgreSQL.
- `GET /api/posiciones`: tabla de posiciones ordenada por puntos y diferencia de goles.

## Ejecucion local

```bash
docker compose up -d --build
```

```bash
curl http://localhost:3000/api/health
curl http://localhost:3000/api/health/db
```

```bash
pnpm test
```

## CI

El workflow `.github/workflows/ci.yml` levanta un PostgreSQL temporal, instala dependencias con pnpm y ejecuta la suite Jest con `NODE_ENV=test`.

## Despliegue en Render

El archivo `render.yaml` define:

- Web Service Node.js en plan free.
- Render PostgreSQL en plan free.
- `DATABASE_URL` inyectada desde la base de datos Render con `fromDatabase`.
- `healthCheckPath: /api/health`.
- `autoDeployTrigger: checksPass`.

No se requiere configurar una base externa ni variables manuales para la base de datos.

## Estructura

```txt
.
|-- .github/workflows/ci.yml
|-- Dockerfile
|-- docker-compose.yml
|-- render.yaml
|-- arquitectura.png
|-- src/
|   |-- app.js
|   `-- config/db.js
`-- tests/app.test.js
```
