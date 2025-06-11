# Database Migration: Supabase to SQLite3

## Overview
Successfully migrated the Community Hope donation platform from Supabase (PostgreSQL) to SQLite3 for improved local development and simplified deployment.

## Changes Made

### 1. **Dependencies Added**
```bash
npm install better-sqlite3 @types/better-sqlite3
```

### 2. **New Database Files Created**
- `src/lib/database.ts` - Main database configuration and schema
- `src/lib/database-services.ts` - Database service functions

### 3. **Database Schema**
Created three main tables with proper relationships and constraints:

#### **Projects Table**
```sql
CREATE TABLE projects (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  image_url TEXT,
  target_amount INTEGER NOT NULL CHECK (target_amount > 0),
  raised_amount INTEGER DEFAULT 0 CHECK (raised_amount >= 0),
  category TEXT NOT NULL,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed', 'paused')),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

#### **Donations Table**
```sql
CREATE TABLE donations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  project_id INTEGER NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  amount INTEGER NOT NULL CHECK (amount > 0),
  payment_method TEXT NOT NULL CHECK (payment_method IN ('mpesa', 'card')),
  phone_number TEXT,
  transaction_id TEXT UNIQUE,
  checkout_request_id TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed')),
  message TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

#### **Admin Users Table**
```sql
CREATE TABLE admin_users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  last_login DATETIME
);
```

### 4. **Database Services**

#### **Projects Service**
- `getAll()` - Fetch all active projects
- `getById(id)` - Get project by ID
- `updateRaisedAmount(id, amount)` - Update total raised amount
- `incrementRaisedAmount(id, amount)` - Add to raised amount

#### **Donations Service**
- `create(donation)` - Create new donation record
- `getById(id)` - Get donation by ID
- `updateStatus(id, status, transactionId?)` - Update donation status
- `getByProject(projectId)` - Get donations for a project
- `getAll()` - Get all donations with project names
- `getStats()` - Get donation statistics
- `findByCheckoutRequestId(id)` - Find donation by M-Pesa checkout ID

#### **Admin Service**
- `authenticate(email, password)` - Simple admin authentication

### 5. **API Routes Updated**
- `src/routes/api/projects/+server.ts` - Now uses SQLite
- `src/routes/api/donations/+server.ts` - Now uses SQLite
- `src/routes/api/mpesa/callback/+server.ts` - Updated for SQLite

### 6. **Frontend Components Updated**
- `src/routes/+page.svelte` - Updated imports
- `src/routes/admin/+page.svelte` - Updated imports

### 7. **Sample Data**
Automatically inserts sample data on first run:
- 6 sample projects across different categories
- 8 sample donations with realistic data
- 1 admin user (admin@communityhope.com / password123)

### 8. **Files Removed**
- `src/lib/supabase.ts` - No longer needed
- Supabase environment variables from `.env`

## Benefits of SQLite Migration

### **1. Simplified Development**
- No external database service required
- Instant setup for new developers
- Database file included in project

### **2. Improved Performance**
- Local database access
- No network latency
- Faster queries for small to medium datasets

### **3. Easier Deployment**
- Single file database
- No database server setup required
- Works on any hosting platform

### **4. Better Testing**
- Isolated test databases
- Easy to reset and seed data
- No shared database conflicts

### **5. Cost Effective**
- No database hosting costs
- No connection limits
- No bandwidth charges

## Database Location
- **Development**: `community-hope.db` (project root)
- **Production**: `/tmp/community-hope.db`

## Migration Verification

### **API Endpoints Working**
✅ `GET /api/projects` - Returns all projects from SQLite
✅ `GET /api/donations` - Returns all donations with project names
✅ `POST /api/donations` - Creates new donation records
✅ `POST /api/mpesa/stk-push` - M-Pesa integration working
✅ `POST /api/mpesa/callback` - Updates donation status in SQLite

### **Frontend Working**
✅ Home page displays projects from SQLite
✅ Donation modal creates records in SQLite
✅ Admin dashboard reads from SQLite
✅ M-Pesa payment flow integrated with SQLite

### **Data Integrity**
✅ Foreign key constraints enforced
✅ Check constraints for valid data
✅ Automatic timestamp updates
✅ Transaction safety with better-sqlite3

## Future Considerations

### **Scaling Options**
- SQLite handles up to 1TB databases
- Supports thousands of concurrent reads
- Can migrate to PostgreSQL if needed
- Database schema is compatible

### **Backup Strategy**
- Simple file-based backups
- Can use SQLite's backup API
- Easy to replicate across environments

### **Performance Optimization**
- Indexes already created for common queries
- WAL mode enabled for better concurrency
- Prepared statements for security

## Conclusion
The migration to SQLite3 was successful and provides a more streamlined development experience while maintaining all functionality. The application is now easier to set up, deploy, and maintain without sacrificing features or performance.
