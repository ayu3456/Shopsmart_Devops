# ShopSmart Technical Implementation Document

This document fulfills the "Explanation" criteria of the project requirements, detailing the architecture, workflow, specific design decisions, and the challenges faced and resolved during implementation.

## 1. System Architecture
ShopSmart is designed as a decoupled, multi-tier web application, split cleanly into frontend and backend components:

*   **Frontend (Client)**: A React application built with Vite. It employs functional components and React Hooks (`useState`, `useEffect`) for state and lifecycle management. The frontend communicates with the backend via RESTful endpoints. It is designed to be hosted on Vercel or Render's static hosting.
*   **Backend (Server)**: A Node.js application built using the Express.js framework. It provides a full CRUD (Create, Read, Update, Delete) RESTful API that handles product inventory logic.
*   **Database**: SQLite is utilized as the relational database, managed through the Prisma ORM. Prisma handles schema migrations, data abstraction, and type-safe database access, resulting in robust and manageable backend operations.

## 2. CI/CD Workflow
The project implements an automated CI/CD pipeline leveraging **GitHub Actions** (`.github/workflows/pipeline.yml`) to ensure code quality and seamless deployment:

*   **Continuous Integration (CI)**: Triggered on `push` and `pull_request` to the `main` branch. The pipeline automatically sets up the Node.js environment, installs dependencies, and simultaneously runs both Lint checks (via ESLint) and Unit Tests (via Jest for the backend and Vitest for the frontend). If any check or test fails, the pipeline halts, blocking faulty code.
*   **Dependabot Integration**: Automatically checks for outdated dependencies (`.github/dependabot.yml`) on a weekly interval to ensure the highest standard of security and reliability.
*   **Continuous Deployment (CD) / AWS EC2 Integration**: The workflow includes an EC2 deployment process that uses SSH (`appleboy/ssh-action`). Upon successful tests, the system connects securely to the EC2 instance, pulls the latest code, updates dependencies, builds the artifacts, and uses `PM2` to automatically restart the backend service.

## 3. Key Design Decisions
A deliberate set of choices was made to prioritize code quality, resilience, and maintainability:

*   **Prisma ORM**: Selected for its predictable, type-safe API. It handles migrations gracefully and significantly reduces boilerplate compared to raw SQL driver interactions.
*   **Idempotency in Scripts**: The `setup-shopsmart.sh` shell script was completely refactored. Rather than just creating files blindly, it first checks if files or packages exist (`mkdir -p`, checking `node_modules`). This ensures that the script can be run repetitively without breaking the system states—a key DevOps principle.
*   **Component Modularity**: The React component logic separates state mapping from the API calls, allowing tests to correctly isolate and test API mocking (via `vi.fn()`) distinct from component rendering.
*   **Modern Glassmorphic UI**: The frontend leverages raw CSS Variables and dynamic flex/grid properties, creating an aesthetically pleasing, modern layout without relying on large UI manipulation libraries.

## 4. Challenges & Resolutions

### Prisma 7.0 & CommonJS Interoperability
**Challenge:** We encountered issues initializing Prisma's `PrismaClient` using standard common defaults because Prisma V7 requires driver adapters to be formally injected when using the new `@prisma/client` bindings or throws a strictly enforced validation error if the old format is mixed.
**Resolution:** We strictly isolated the SQLite adapter injection by importing `better-sqlite3` and wrapping it intelligently with `@prisma/adapter-better-sqlite3`, enabling Prisma 7 syntax correctly whilst keeping everything operating within our required Node server structure.

### Asynchronous Test Rendering
**Challenge:** React DOM testing with Vitest resulted in the frontend tests trying to assess DOM nodes before the initial API data fully resolved, leading to missing element errors in the test runner.
**Resolution:** Applied the `@testing-library/react` `waitFor` methodology, enabling tests to suspend assertions safely until the dynamic data (such as product arrays) fully propagated out of the asynchronous DOM elements.

### Relative Path Structuring in Monorepos
**Challenge:** The execution references for `.env` and `dev.db` had mismatched mapping paths due to the location of test-runners vs execution binaries.
**Resolution:** Refactored `db.js` configurations to correctly resolve absolute/relative paths and passed explicit datasource URLs initialized natively from `dotenv` injection.
