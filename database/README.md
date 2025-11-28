# Database Setup

This directory contains SQL migration files for the Personal Finance SaaS database.

## Setup Instructions

1. Start the Docker containers:
   ```bash
   docker-compose up -d
   ```

2. Wait for PostgreSQL to be ready (check with `docker-compose logs db`)

3. Run the schema migration:
   ```bash
   docker exec -i finazas_postgres psql -U postgres -d postgres < database/schema.sql
   ```

## Database Structure

### Tables

- **transactions**: All income and expense transactions
- **budgets**: Monthly/weekly budget limits by category
- **goals**: Savings goals with target amounts and deadlines
- **categories**: Predefined transaction categories

### Accessing the Database

- **PostgreSQL**: `localhost:5432`
  - User: `postgres`
  - Password: `your-super-secret-password`
  - Database: `postgres`

- **PostgREST API**: `http://localhost:54321`
- **Supabase Studio**: `http://localhost:54323` (Database UI)

## Environment Variables

Make sure `.env.local` exists (copy from `.env.example` if needed).
