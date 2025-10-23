Short, actionable guidance for AI coding agents working in this repository.

Purpose
- Help code assistants make productive, low-risk changes to the Supply Chain Management System.

Keep edits small and focused
- Prefer minimal diffs that preserve existing style and APIs. Example: backend uses ES modules (import/export) and "type": "module" in package.json; use the same style.

Big-picture architecture (what to know quickly)
- Monorepo-like layout: root orchestrates two apps:
  - `backend/` — Express API (ES modules). Entry: `backend/src/index.js` starts server; `backend/src/app.js` wires routes and middleware.
  - `frontend/` — React + Vite app. Entry: `frontend/src/main.jsx` and `index.html`.
- Database: MySQL initialized by `docker/init.sql` and served via Docker Compose (see `docker-compose.yml`). Backend connects using `backend/src/db/pool.js`.
- Routes are grouped under `backend/src/routes/*` and controllers under `backend/src/controllers/*`. Services live in `backend/services/*` and are used by controllers.

Common developer workflows & useful commands
- Install and start both apps (root): `npm install` then `npm run dev` (runs backend and frontend concurrently). See `README.md` for Docker steps.
- To reset DB after editing `docker/init.sql`: `docker-compose down -v` then `docker-compose up -d` from project root.
- Backend dev: `npm run dev` in `backend/` (nodemon). Port defaults read from env (see `backend/src/index.js`).
- Frontend dev: `npm run dev` in `frontend/` (Vite). Proxying is configured so API requests go to backend during development.

Project-specific conventions and patterns
- ES module syntax everywhere in backend (import/export). Keep new backend files consistent.
- DB access uses a shared MySQL pool: `backend/src/db/pool.js` returns a promise-wrapped pool. Use `pool.query()` or `pool.getConnection()` consistently.
- Controllers are thin: they call service functions and handle responses/errors via the centralized `middleware/errorHandler.js`. Add business logic to `backend/services/*` not controllers.
- Routes map 1:1 to controllers (e.g., `backend/src/routes/order.routes.js` -> `backend/src/controllers/order.controller.js`). Follow this pattern for new endpoints.
- Environment variables: `dotenv` is used. Default DB host/port/user/password are set in `pool.js` — prefer using env vars for changes.

Testing, linting, and safety
- There are no automated tests in the repo. Before adding tests, keep changes covered by manual smoke checks:
  - Run `npm run dev` (root) and hit `GET /health` on backend (default port 5000) to confirm server starts.
  - Use Adminer at `http://localhost:8080` (after `docker-compose up -d`) to inspect the `supplychain` DB.
- Linting is configured for the frontend (`npm run lint` in `frontend/`). Follow frontend ESLint rules for UI changes.

Integration points & external dependencies
- Docker Compose spins up MySQL and Adminer. DB init script: `docker/init.sql` (contains schema + seed data). Changes require DB volume reset.
- Backend dependencies: express, mysql2, uuid, dotenv, cors. Avoid introducing heavy native modules unless necessary.
- Frontend uses axios for API calls; the UI expects API routes under `/api/*` (see `backend/src/app.js`).

Examples & quick references
- Add a new API route:
  1. Create `backend/src/controllers/my.controller.js` exporting handlers.
  2. Create `backend/src/services/my.service.js` for DB/business logic and reuse `pool`.
  3. Add `backend/src/routes/my.routes.js` and wire it in `backend/src/app.js`.

- DB pool usage example (follow `pool.js`):
  const pool = await import('../db/pool.js');
  const [rows] = await pool.query('SELECT * FROM orders WHERE order_id = ?', [id]);

What to avoid
- Do not assume `docker/init.sql` runs on every start — it only runs on initial volume creation. If you modify it, document the need to `docker-compose down -v`.
- Don't mix CommonJS and ESM in backend files.
- Avoid changing global ports/env defaults without updating README and Docker configs.

If you are unsure
- Look at `backend/src/index.js`, `backend/src/app.js`, and `docker-compose.yml` for runtime wiring.
- Prefer small, reviewable PRs. Link to the DB seeding script when changing models or migration-like SQL.

Need changes or missing info?
- Ask the repo owner to clarify desired env var overrides, CI, or migration strategy before implementing large DB changes.

End of instructions.
