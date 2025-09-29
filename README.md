# Supply Chain Management System

This project is a web-based application for managing a supply chain, built with React and Vite. It uses a MySQL database running in a Docker container.

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

### 2. Install Frontend Dependencies

Install the necessary Node.js packages for the React frontend.

```bash
npm install
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


### 4. Run the Frontend Application

Start the Vite development server to run the React application.

```bash
npm run dev
```

The application will be available at `http://localhost:5173` (or another port if 5173 is in use).

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

In the project directory, you can run:

- `npm run dev`: Runs the app in development mode.
- `npm run build`: Builds the app for production.
- `npm run lint`: Lints the codebase using ESLint.
- `npm run preview`: Serves the production build locally.