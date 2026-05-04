# ShopSmart DevOps Project

ShopSmart is a full-stack e-commerce demo application with:
- `client`: React + Vite frontend
- `server`: Express + PostgreSQL backend API
- `terraform`: AWS infrastructure (ECS Fargate, ALB, ECR, RDS, S3)

The project also includes CI/CD with GitHub Actions for testing, Terraform validation/planning, Docker image push, and infrastructure deployment.

## Architecture Overview

- Frontend runs as a React SPA.
- Backend exposes REST APIs under `/api`.
- In production, Express serves both API and built frontend from a single container image.
- PostgreSQL stores users and product catalog.
- Terraform provisions AWS resources for hosting and data.

## Repository Structure

```text
Shopsmart_Devops/
├── client/       # React + Vite frontend
├── server/       # Express API + DB migrations/tests
├── terraform/    # AWS infrastructure as code
├── Dockerfile    # Multi-stage build: frontend + backend
└── .github/workflows/workflow.yml  # CI/CD pipeline
```

## Tech Stack

- Frontend: React 18, Vite, Tailwind CSS, Vitest, Playwright
- Backend: Node.js, Express, PostgreSQL (`pg`), JWT auth (HTTP-only cookies)
- Infra: Terraform, AWS ECS Fargate, ALB, RDS, ECR, S3
- CI/CD: GitHub Actions

## Prerequisites

- Node.js 20+
- npm 9+
- PostgreSQL (for local backend with DB features)
- Docker (optional, for containerized run)
- Terraform 1.2+ and AWS credentials (for infra/deploy)

## Local Development

### 1) Install dependencies

```bash
cd server && npm ci
cd ../client && npm ci
```

### 2) Configure backend environment

Create `server/.env`:

```env
PORT=5001
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/shopsmart
JWT_SECRET=replace-with-a-long-random-secret
# Optional for HTTPS/reverse-proxy deployments
COOKIE_SECURE=false
# Optional SSL mode override (for managed Postgres)
# PGSSLMODE=require
```

Notes:
- If `DATABASE_URL` is not set, database migrations are skipped and product/auth routes return `503`.
- `JWT_SECRET` is required when DB-backed auth is used.

### 3) Run backend

```bash
cd server
npm run dev
```

Backend starts on `http://localhost:5001` by default and runs migrations at startup.

### 4) Run frontend

In a second terminal:

```bash
cd client
npm run dev
```

Frontend runs on Vite dev server (typically `http://localhost:5173`) and proxies `/api` to `http://localhost:5001`.

## Available Scripts

### Frontend (`client`)

```bash
npm run dev
npm run build
npm run preview
npm run test
npm run test:unit
npm run test:integration
npm run test:e2e
npm run test:all
npm run lint
```

### Backend (`server`)

```bash
npm run dev
npm run start
npm run migrate
npm run test
npm run lint
```

## API Endpoints

Base path: `/api`

- `GET /api/health` - health check
- `GET /api/products` - list products
- `GET /api/products?search=<term>` - search products
- `GET /api/products/:idOrSlug` - get single product
- `POST /api/auth/register` - register user
- `POST /api/auth/login` - login user
- `POST /api/auth/logout` - logout user
- `GET /api/auth/me` - current user from auth cookie

## Docker

This repo uses a single multi-stage Docker image:
- Stage 1 builds frontend assets.
- Stage 2 runs Express and serves both API + SPA.

Build image:

```bash
docker build -t shopsmart:local .
```

Run container:

```bash
docker run --rm -p 3000:3000 \
  -e PORT=3000 \
  -e DATABASE_URL="postgresql://postgres:postgres@host.docker.internal:5432/shopsmart" \
  -e JWT_SECRET="replace-with-a-long-random-secret" \
  shopsmart:local
```

Open: `http://localhost:3000`

## CI/CD Pipeline

GitHub Actions workflow: `.github/workflows/workflow.yml`

On pull requests and pushes to `main`:
- Runs backend tests (Jest)
- Runs frontend tests (Vitest)
- Runs Terraform format/validate/plan

On pushes to `main`:
- Ensures Terraform state bucket exists (`shopsmart-tf-<repository_id>`)
- Applies Terraform for foundational resources
- Builds and pushes Docker image to ECR
- Applies full Terraform stack with image tag (`github.sha`)

Required GitHub secrets:
- `AWS_ACCESS_KEY_ID`
- `AWS_SECRET_ACCESS_KEY`
- `AWS_SESSION_TOKEN`
- `AWS_REGION`

## Terraform Infrastructure

Terraform module in `terraform/` provisions:
- S3 bucket (project assets)
- ECR repository
- ECS cluster/service/task definition (Fargate)
- Application Load Balancer
- RDS PostgreSQL instance
- Security groups and networking based on default VPC

Important behavior:
- Uses IAM role named `LabRole` for ECS task execution.
- Uses default VPC/subnets and requires at least 2 AZs for ALB.
- Injects `DATABASE_URL`, `PGSSLMODE=require`, and generated `JWT_SECRET` into ECS task env.

### Manual Terraform Usage (optional)

From `terraform/`:

```bash
terraform init
terraform fmt -recursive
terraform validate
terraform plan
terraform apply
```

Typical useful outputs after apply:
- `app_url`
- `alb_dns_name`
- `ecr_repository_url`
- `rds_endpoint`

## Testing

- Backend tests: `server/tests/*.test.js` (Jest + Supertest)
- Frontend unit/integration: `client/src/__tests__` (Vitest + Testing Library)
- Frontend E2E: `client/tests/e2e` (Playwright)

## Notes

- In production, API and frontend share one origin, so default frontend API base (`/api`) works without extra config.
- For frontend-only deployment scenarios, set `VITE_API_BASE_URL` to your API origin.
