# 🧹 Database Cleanup Guide

## Overview
This guide helps you clean your ServiceHub database and start fresh with empty tables.

## ⚠️ **IMPORTANT WARNING**
**Database cleanup is IRREVERSIBLE!** 
- All user data will be permanently deleted
- All service requests will be lost
- All payment records will be removed
- All uploaded images will be deleted

**Make sure you want to proceed before running any cleanup scripts!**

## 🗂️ **Cleanup Options**

### Option 1: Data-Only Cleanup (Recommended)
**File**: `scripts/database-cleanup.sql`
- ✅ Keeps table structure intact
- ✅ Preserves database schema
- ✅ Maintains RLS policies
- ❌ Deletes all user data

### Option 2: Complete Reset
**File**: `scripts/complete-reset.sql`
- ❌ Drops all tables
- ❌ Removes all data
- ❌ Deletes schema structure
- ⚠️ Requires running setup scripts again

### Option 3: Auth Users Cleanup
**File**: `scripts/auth-users-cleanup.sql`
- 🔐 Cleans authentication users
- ⚠️ Requires admin privileges
- 🔄 May need manual intervention

### Option 4: Storage Cleanup
**File**: `scripts/storage-cleanup.sql`
- 🖼️ Removes uploaded images
- 📁 Cleans storage buckets
- ⚠️ May require manual deletion

## 📋 **Step-by-Step Cleanup Process**

### Method A: Using Supabase Dashboard (Recommended)

1. **Go to Supabase Dashboard**
   \`\`\`
   https://supabase.com/dashboard/project/[your-project-id]
   \`\`\`

2. **Navigate to SQL Editor**
   \`\`\`
   Dashboard → SQL Editor → New Query
   \`\`\`

3. **Run Data Cleanup Script**
   - Copy content from `scripts/database-cleanup.sql`
   - Paste into SQL Editor
   - Click "Run" button

4. **Clean Authentication Users**
   \`\`\`
   Dashboard → Authentication → Users → Select All → Delete
   \`\`\`

5. **Clean Storage Files**
   \`\`\`
   Dashboard → Storage → service-images → Select All → Delete
   \`\`\`

### Method B: Using Database Client

1. **Connect to your database**
   \`\`\`
   Host: db.[your-project-id].supabase.co
   Database: postgres
   Port: 5432
   \`\`\`

2. **Run cleanup scripts in order**
   \`\`\`sql
   -- 1. First run data cleanup
   \i scripts/database-cleanup.sql
   
   -- 2. Then clean auth users (if you have permissions)
   \i scripts/auth-users-cleanup.sql
   
   -- 3. Finally clean storage
   \i scripts/storage-cleanup.sql
   \`\`\`

## 🔍 **Verification Steps**

After cleanup, verify the results:

\`\`\`sql
-- Check table row counts
SELECT 'users' as table_name, COUNT(*) as rows FROM users
UNION ALL
SELECT 'service_requests', COUNT(*) FROM service_requests
UNION ALL
SELECT 'payments', COUNT(*) FROM payments
UNION ALL
SELECT 'reviews', COUNT(*) FROM reviews
UNION ALL
SELECT 'admin_settings', COUNT(*) FROM admin_settings
UNION ALL
SELECT 'admin_activity_log', COUNT(*) FROM admin_activity_log;

-- Check auth users
SELECT COUNT(*) as auth_users_count FROM auth.users;

-- Check storage files
SELECT COUNT(*) as storage_files_count FROM storage.objects 
WHERE bucket_id = 'service-images';
\`\`\`

**Expected Results After Cleanup:**
- `users`: 0 rows
- `service_requests`: 0 rows  
- `payments`: 0 rows
- `reviews`: 0 rows
- `admin_settings`: 3 rows (default settings)
- `admin_activity_log`: 0 rows
- `auth.users`: 0 rows
- `storage files`: 0 files

## 🚀 **After Cleanup**

Once cleanup is complete:

1. **Tables are ready for new data**
2. **You can start creating new accounts**
3. **All functionality will work normally**
4. **Default admin settings are restored**

## 🛠️ **Troubleshooting**

### Permission Errors
If you get permission errors:
- Use Supabase Dashboard instead of direct SQL
- Contact your database administrator
- Check if you have the required privileges

### Foreign Key Constraints
If deletion fails due to constraints:
- Run the cleanup script (it handles dependencies)
- Delete in the correct order (dependencies first)

### Auth Users Won't Delete
If auth.users can't be deleted:
- Use Supabase Dashboard → Authentication → Users
- Delete users manually one by one
- Use Supabase Admin API

### Storage Files Won't Delete
If storage files can't be deleted:
- Use Supabase Dashboard → Storage
- Delete files manually from the UI
- Check bucket permissions

## 📞 **Need Help?**

If you encounter issues:
1. Check the Supabase documentation
2. Review error messages carefully
3. Try using the dashboard instead of SQL
4. Contact support if needed

---

**Remember**: Database cleanup is permanent. Make sure you really want to delete all data before proceeding!
