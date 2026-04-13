# Backend Database Connection Fix

## Issue
Backend server is failing to start with MySQL connection error:
```
Access denied for user 'root'@'localhost' (using password: NO)
```

## Solutions

### Option 1: Check if MySQL is Running
```bash
# Check MySQL service status
net start mysql

# If not running, start MySQL
net start mysql
```

### Option 2: Update Database Credentials
Edit the `.env` file in the backend directory with correct MySQL credentials:

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_NAME=edusolgrow
DB_USER=root
DB_PASSWORD=your_mysql_password

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRE=7d

# Server Configuration
PORT=5000
NODE_ENV=development

# Client URL (for CORS)
CLIENT_URL=http://localhost:5173
```

### Option 3: Create Database
If MySQL is running but database doesn't exist:

```sql
CREATE DATABASE edusolgrow;
```

### Option 4: Use Alternative Database
If MySQL setup is problematic, consider using SQLite for development:

1. Install sqlite3 package
2. Update database configuration to use SQLite
3. Update models for SQLite compatibility

## Quick Fix Steps

1. **Check MySQL Service**:
   ```bash
   net start mysql
   ```

2. **Update .env file** with correct MySQL password

3. **Create Database** if needed:
   ```sql
   CREATE DATABASE edusolgrow;
   ```

4. **Restart Backend Server**:
   ```bash
   cd backend
   node server.js
   ```

## Testing Database Connection
After fixing, test the connection:
```bash
curl http://localhost:5000/health
```

Expected response:
```json
{
  "success": true,
  "message": "Server is running",
  "timestamp": "2026-04-13T13:07:31.158Z",
  "environment": "development"
}
```

## Alternative: Use the Working backend-edu
If database setup continues to fail, use the working `backend-edu` directory instead:
```bash
cd backend-edu
node server.js
```

The `backend-edu` directory has a working database configuration.
