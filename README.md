# ShopSmart - E-Commerce Inventory Management

ShopSmart is a modern, high-tier inventory management application built with React, Node.js, and Prisma. It is designed with a full CI/CD pipeline, automated testing (Unit, Integration, and E2E), and secure AWS EC2 deployment.

## 🚀 Quick Start

### 1. Automated Setup
To set up the project locally, run our idempotent setup script:
```bash
./setup-shopsmart.sh
```

### 2. Manual Installation
Alternatively, navigate to `client` and `server` folders and run:
```bash
npm install
```

## 🛠 Tech Stack
-   **Frontend**: React (Vite)
-   **Backend**: Node.js & Express
-   **ORM**: Prisma
-   **Database**: SQLite
-   **Testing**: Jest, Vitest, Playwright (E2E)
-   **CI/CD**: GitHub Actions
-   **Deployment**: AWS EC2, PM2, SSH

## 📖 In-Depth Explanation
For a detailed breakdown of the architecture, design decisions, and challenges we overcame, please see:
👉 **[EXPLORATION.md](./EXPLORATION.md)**

## 🧪 Running Tests
-   **Backend Unit/Integration**: `cd server && npm test`
-   **Frontend Component**: `cd client && npm test`
-   **End-to-End (E2E)**: `cd client && npm run test:e2e`

## 💎 Features
-   Full CRUD API for Product Management
-   Glassmorphic UI Design
-   Real-time Frontend Health Status
-   Automated Dependabot Security Updates
-   Automated Linting (ESLint + Prettier) on PRs 

this readme is little bit changed.
