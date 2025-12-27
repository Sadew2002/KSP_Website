# Database Setup Guide for Kandy Super Phone

## Prerequisites

You need to have PostgreSQL installed on your system.

### Windows Installation

#### Option 1: Using PostgreSQL Installer (Recommended)

1. Download PostgreSQL from: https://www.postgresql.org/download/windows/
2. Run the installer and follow the setup wizard
3. Remember the password you set for the `postgres` user
4. PostgreSQL will be installed as a Windows Service and start automatically

#### Option 2: Using Windows Package Manager (Chocolatey)

```powershell
choco install postgresql
```

#### Option 3: Using WSL (Windows Subsystem for Linux)

```bash
sudo apt-get update
sudo apt-get install postgresql postgresql-contrib
```

## Verify PostgreSQL Installation

### Check if PostgreSQL Service is Running

**Windows Services:**
1. Press `Win + R`
2. Type `services.msc`
3. Look for "postgresql-x64-*" service
4. If status is blank, click it and click "Start"

**Or use PowerShell:**
```powershell
Get-Service | Where-Object {$_.Name -like "*postgres*"} | Format-Table Name, Status
```

## Create the Database

### Using psql Command Line

1. Open PowerShell or Command Prompt

2. Connect to PostgreSQL:
```powershell
psql -U postgres -h localhost
```

3. Enter the password you set during installation (default: `postgres`)

4. Create the database:
```sql
CREATE DATABASE kandy_super_phone;
\q
```

### Using pgAdmin (GUI Tool)

1. Open pgAdmin (comes with PostgreSQL installer)
2. Expand "Servers" → "PostgreSQL"
3. Right-click "Databases" → "Create" → "Database"
4. Enter name: `kandy_super_phone`
5. Click "Save"

## Configure Environment Variables

A `.env` file has been created in the backend folder with these settings:

```
DB_HOST=localhost
DB_PORT=5432
DB_NAME=kandy_super_phone
DB_USER=postgres
DB_PASSWORD=postgres
```

**⚠️ Important:** Change `DB_PASSWORD` to match the password you set for the `postgres` user during PostgreSQL installation.

## Start the Backend Server

Once PostgreSQL is running:

```powershell
cd D:\Projects\KSP\backend
npm run dev
```

You should see:
```
✓ Database connected successfully
🚀 Server running on http://localhost:5000
```

## Troubleshooting

### Error: "connection refused"

**Cause:** PostgreSQL is not running

**Solution:**
- **Windows:** Start the PostgreSQL service in Services app
- **Command:** `net start postgresql-x64-15` (adjust version number)
- **PowerShell:**
  ```powershell
  Start-Service -Name postgresql-x64-15
  ```

### Error: "role 'postgres' does not exist"

**Solution:** Create the role:
```sql
CREATE ROLE postgres WITH LOGIN PASSWORD 'postgres';
ALTER ROLE postgres SUPERUSER CREATEDB CREATEROLE;
```

### Error: "database 'kandy_super_phone' does not exist"

**Solution:** Create the database:
```bash
createdb -U postgres kandy_super_phone
```

### Error: "password authentication failed"

**Cause:** Wrong password in `.env` file

**Solution:**
1. Reset PostgreSQL password:
   ```bash
   psql -U postgres -h localhost
   \password postgres
   ```
2. Update `.env` file with new password

## Quick Start Checklist

- [ ] PostgreSQL installed and running
- [ ] `kandy_super_phone` database created
- [ ] `.env` file created with correct credentials
- [ ] Backend installed: `npm install`
- [ ] Backend started: `npm run dev`
- [ ] See "✓ Database connected successfully"

## Next Steps

Once the database is connected:

1. Start the frontend:
   ```powershell
   cd D:\Projects\KSP\frontend
   npm start
   ```

2. Access the application at: http://localhost:3000

3. The backend API will be available at: http://localhost:5000

## Database Schema Auto-Sync

During development, the server automatically syncs database models. For production, you'll want to use migrations instead.

To manually sync:
```powershell
npm run migrate
```

---

**Need Help?**

If you're still having issues:
1. Verify PostgreSQL is running: `psql -U postgres -h localhost`
2. Check `.env` credentials match your PostgreSQL setup
3. Review the server logs for specific error messages
4. Ensure port 5432 is not blocked by firewall
