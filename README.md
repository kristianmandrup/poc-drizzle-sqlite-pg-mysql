# POC for Drizzle ORM with SQLite, PostgreSQL, and MySQL

## Introduction

This is a proof-of-concept (POC) project for using Drizzle ORM with SQLite, PostgreSQL, and MySQL databases. It demonstrates the capabilities of Drizzle ORM and shows how you can easily switch between different types of databases.

## Prerequisites

- Node.js
- Docker w/ Docker Compose
- pnpm

## Getting Started

1. Clone this repository

```
git clone https://github.com/constrod/poc-drizzle-sqlite-pg-mysql.git
```

2. Navigate to the project directory

```
cd poc-drizzle-sqlite-pg-mysql
```

3. Install dependencies

```
pnpm install
```

4. Create `.env` file and use `.env.example` as a template

Example:

```bash
STAGE="dev"

SQLITE_DB_NAME="db/sqlite.db"
```

5. Start development server

```
pnpm dev
```

6. Run `db:init` script to initialize the DB

```
pnpm db:init
```

```
[INFO]: Initializing databases setup
[INFO]: Creating SQLite database  in ./databases/sqlite/.db
[INFO]: Databases setup completed!
```

7. Generate and push schemas

```
pnpm sqlite:generate
pnpm sqlite:push
```

8. Generate and populate with seed (fake) data (sqlite by default)

```
pnpm db:seed
```

## Project Structure

- `src/`: Source code directory
- `src/env.ts`: Environment variables
- `src/db/{db_type}/schema.ts`: Schema definitions
- `src/db/client.ts`: Database client configurations
- `docker-compose.yaml`: Docker-compose file for PostgreSQL and MySQL
- `drizzle.{db_type}.config.ts`: Drizzle configuration files for SQLite, PostgreSQL, and MySQL
- `setup/`: Setup scripts and etc.

## Database Scripts

The `package.json` includes several scripts to interact with each database:

### SQLite

Create or ensure you have an `databases/sqlite` folder

- **Generate Schema**: `pnpm sqlite:generate`
- **Push Schema**: `pnpm sqlite:push`
- **Introspect Database**: `pnpm sqlite:introspect`
- **Drop Database**: `pnpm sqlite:drop`
- **Check Migration Status**: `pnpm sqlite:check`
- **Apply Migrations**: `pnpm sqlite:up`
- **Open Drizzle Studio**: `pnpm sqlite:studio`

### PostgreSQL

- **Generate Schema**: `pnpm pg:generate`
- **Push Schema**: `pnpm pg:push`
- **Introspect Database**: `pnpm pg:introspect`
- **Drop Database**: `pnpm pg:drop`
- **Check Migration Status**: `pnpm pg:check`
- **Apply Migrations**: `pnpm pg:up`
- **Open Drizzle Studio**: `pnpm pg:studio`

### MySQL

- **Generate Schema**: `pnpm mysql:generate`
- **Push Schema**: `pnpm mysql:push`
- **Introspect Database**: `pnpm mysql:introspect`
- **Drop Database**: `pnpm mysql:drop`
- **Check Migration Status**: `pnpm mysql:check`
- **Apply Migrations**: `pnpm mysql:up`
- **Open Drizzle Studio**: `pnpm mysql:studio`

## Running the Databases

To start the PostgreSQL and MySQL databases, run:

```
pnpm db:start
```

To stop them, run:

```
pnpm db:stop
```
