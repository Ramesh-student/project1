-- =====================================================
-- COMPLETE DATABASE RESET
-- =====================================================
-- This script performs a complete reset of the database
-- It drops and recreates all tables with fresh schema
-- 
-- WARNING: This will delete EVERYTHING including table structure!
-- Only use this if you want to start completely fresh
-- =====================================================

-- Drop all custom tables (in reverse dependency order)
DROP TABLE IF EXISTS admin_activity_log CASCADE;
DROP TABLE IF EXISTS admin_settings CASCADE;
DROP TABLE IF EXISTS reviews CASCADE;
DROP TABLE IF EXISTS payments CASCADE;
DROP TABLE IF EXISTS service_requests CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Drop storage bucket
DELETE FROM storage.buckets WHERE id = 'service-images';

-- Drop all custom functions
DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;

-- Now recreate everything fresh by running the setup scripts
-- You would need to run database-setup.sql after this

SELECT 'Complete database reset completed!' as status,
       'All tables, data, and functions have been dropped' as message,
       'Run database-setup.sql to recreate the schema' as next_step;
