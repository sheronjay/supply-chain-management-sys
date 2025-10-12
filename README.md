# Supply Chain Management System

This project is a web-based application for managing a supply chain, built with React and Vite for the frontend and an Express back end. It uses a MySQL database running in a Docker container.

## Prerequisites

Before you begin, ensure you have the following installed on your system:
- [Node.js](https://nodejs.org/) (v18 or later recommended)
- [Docker](https://www.docker.com/get-started)
- [Docker Compose](https://docs.docker.com/compose/install/)

## Getting Started

Follow these steps to get the project up and running on your local machine.

### 1. Clone the Repository

```bash
git clone <your-repository-url>
cd supply-chain-management-sys
```

### 2. Install Dependencies

Install the root dependency that manages the concurrent dev servers, then install the packages for the backend and frontend applications.

```bash
npm install
npm install --prefix backend
npm install --prefix frontend
```

### 3. Set Up and Run the Database

The project uses Docker Compose to manage the MySQL database service. Run the following command from the **root directory** of the project to build and start the database container.

```bash
docker-compose up -d
```

This will:
- Start a MySQL database container.
- Automatically create a database named `supplychain`.
- Initialize the database schema by running the `docker/init.sql` script.
- Make the database accessible on `localhost:3307`.
- Start an Adminer container for database management, accessible at `http://localhost:8080`.


### 4. Run the Development Servers

Start both the backend API and the Vite development server with a single command from the project root:

```bash
npm run dev
```

This uses [`concurrently`](https://www.npmjs.com/package/concurrently) to run:
- `npm run dev --prefix backend` (Express API, defaults to `http://localhost:3000`)
- `npm run dev --prefix frontend` (React app, defaults to `http://localhost:5173`)

The frontend will automatically proxy API requests to the backend when both are running.

## Database Management
 
### Resetting the Database

If you make any changes to the `docker/init.sql` file, you need to completely reset the database for the changes to take effect. The initialization script only runs when the database volume is first created.

To apply your changes, run the following commands from the project root:

1.  **Stop containers and remove the database volume:**
    ```bash
    docker-compose down -v
    ```

2.  **Start the services again:**
    ```bash
    docker-compose up -d
    ```

## Available Scripts

From the project root:

- `npm run dev`: Runs both backend and frontend development servers simultaneously using `concurrently`.

Within the `backend/` directory:

- `npm run dev`: Starts the Express development server.

Within the `frontend/` directory:
- `npm run dev`: Runs the Vite development server.
- `npm run build`: Builds the app for production.
- `npm run lint`: Lints the codebase using ESLint.
- `npm run preview`: Serves the production build locally.