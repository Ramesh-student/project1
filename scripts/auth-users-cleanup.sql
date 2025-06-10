-- =====================================================
-- AUTHENTICATION USERS CLEANUP
-- =====================================================
-- This script handles cleanup of Supabase auth.users table
-- Note: This requires admin/service role privileges
-- =====================================================

-- WARNING: This will delete ALL authentication users
-- This action is IRREVERSIBLE!

-- Method 1: Using Supabase Admin API (Recommended)
-- You should run this from the Supabase dashboard or using the admin API
-- This is safer and handles all cascading properly

-- Method 2: Direct SQL (Use with caution)
-- Only use this if you have direct database admin access

-- Delete all users from auth.users table
-- This will cascade to the users table if foreign key constraints are set up properly
-- DELETE FROM auth.users;

-- Alternative: Delete users one by one (safer approach)
-- DO $$
-- DECLARE
--     user_record RECORD;
-- BEGIN
--     FOR user_record IN SELECT id FROM auth.users LOOP
--         DELETE FROM auth.users WHERE id = user_record.id;
--     END LOOP;
-- END $$;

-- Verify auth cleanup
SELECT 'auth.users' as table_name, COUNT(*) as row_count FROM auth.users;

-- Note: If you can't delete auth.users directly, you can:
-- 1. Go to Supabase Dashboard > Authentication > Users
-- 2. Delete users manually from the UI
-- 3. Or use the Supabase Admin API to delete users programmatically
