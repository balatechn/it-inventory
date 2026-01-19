# Database Setup Guide

## Option 1: Install PostgreSQL Locally (Recommended for Development)

### Step 1: Download and Install PostgreSQL
1. Go to https://www.postgresql.org/download/windows/
2. Download the installer (PostgreSQL 15 or 16 recommended)
3. Run the installer
4. During installation:
   - Set password for `postgres` user (remember this!)
   - Default port: 5432
   - Default locale: your locale
5. Complete the installation

### Step 2: Create the Database
After installation, open Command Prompt or PowerShell and run:

```powershell
# Connect to PostgreSQL
psql -U postgres

# Enter your password when prompted

# Create the database
CREATE DATABASE it_inventory;

# Exit psql
\q
```

### Step 3: Update .env file
Update the DATABASE_URL in `.env`:
```
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/it_inventory?schema=public"
```

### Step 4: Run Migrations
```powershell
cd D:\IT-ASSET\it-inventory
npx prisma migrate dev --name init
```

### Step 5: Seed the Database (Optional)
```powershell
npx prisma db seed
```

---

## Option 2: Use Docker

### Step 1: Install Docker Desktop
1. Download from https://www.docker.com/products/docker-desktop
2. Install and restart your computer

### Step 2: Start PostgreSQL Container
```powershell
cd D:\IT-ASSET\it-inventory
docker-compose up -d
```

### Step 3: Run Migrations
```powershell
npx prisma migrate dev --name init
```

---

## Option 3: Use a Cloud Database

### Supabase (Free tier available)
1. Go to https://supabase.com
2. Create a new project
3. Go to Settings > Database
4. Copy the connection string
5. Update `.env`:
```
DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres"
```

### Neon (Free tier available)
1. Go to https://neon.tech
2. Create a new project
3. Copy the connection string
4. Update `.env` with the connection string

---

## After Database Setup

Once your database is running:

```powershell
# Navigate to project directory
cd D:\IT-ASSET\it-inventory

# Run migrations to create tables
npx prisma migrate dev --name init

# (Optional) Seed with sample data
npx prisma db seed

# Start the development server
npm run dev
```

## Troubleshooting

### Connection refused error
- Ensure PostgreSQL service is running
- Check if port 5432 is not blocked by firewall
- Verify credentials in .env file

### Permission denied
- Make sure the database user has proper permissions
- Try connecting with the postgres superuser first

### Database does not exist
- Create it manually: `CREATE DATABASE it_inventory;`
