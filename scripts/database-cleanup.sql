-- =====================================================
-- DATABASE CLEANUP SCRIPT
-- =====================================================
-- This script will delete ALL data from all tables
-- while preserving the table structure and schema
-- 
-- WARNING: This action is IRREVERSIBLE!
-- Make sure you want to delete all data before running this script
-- =====================================================

-- Disable Row Level Security temporarily for cleanup
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
ALTER TABLE service_requests DISABLE ROW LEVEL SECURITY;
ALTER TABLE payments DISABLE ROW LEVEL SECURITY;
ALTER TABLE reviews DISABLE ROW LEVEL SECURITY;
ALTER TABLE admin_settings DISABLE ROW LEVEL SECURITY;
ALTER TABLE admin_activity_log DISABLE ROW LEVEL SECURITY;

-- Delete all data from tables (in correct order to handle foreign key constraints)
-- Start with dependent tables first

-- 1. Delete admin activity logs
DELETE FROM admin_activity_log;
RESET SEQUENCE IF EXISTS admin_activity_log_id_seq;

-- 2. Delete reviews (depends on service_requests and users)
DELETE FROM reviews;
RESET SEQUENCE IF EXISTS reviews_id_seq;

-- 3. Delete payments (depends on service_requests and users)
DELETE FROM payments;
RESET SEQUENCE IF EXISTS payments_id_seq;

-- 4. Delete service requests (depends on users)
DELETE FROM service_requests;
RESET SEQUENCE IF EXISTS service_requests_id_seq;

-- 5. Delete admin settings
DELETE FROM admin_settings;
RESET SEQUENCE IF EXISTS admin_settings_id_seq;

-- 6. Delete user profiles (this should be done last as other tables reference it)
DELETE FROM users;

-- 7. Delete authentication users (this will cascade to users table if foreign key exists)
-- Note: This requires admin privileges and might not work in all environments
-- DELETE FROM auth.users;

-- Clear storage bucket contents (if you have admin access)
-- Note: This requires storage admin privileges
-- You might need to do this manually from the Supabase dashboard

-- Re-enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_activity_log ENABLE ROW LEVEL SECURITY;

-- Reset admin settings to default values
INSERT INTO admin_settings (setting_key, setting_value, description)
VALUES 
  ('site_maintenance_mode', 'false', 'Enable/disable site maintenance mode'),
  ('default_visiting_charges', '500', 'Default visiting charges for service providers'),
  ('system_version', '1.0.0', 'Current system version')
ON CONFLICT (setting_key) DO NOTHING;

-- Verify cleanup
SELECT 'users' as table_name, COUNT(*) as row_count FROM users
UNION ALL
SELECT 'service_requests' as table_name, COUNT(*) as row_count FROM service_requests
UNION ALL
SELECT 'payments' as table_name, COUNT(*) as row_count FROM payments
UNION ALL
SELECT 'reviews' as table_name, COUNT(*) as row_count FROM reviews
UNION ALL
SELECT 'admin_settings' as table_name, COUNT(*) as row_count FROM admin_settings
UNION ALL
SELECT 'admin_activity_log' as table_name, COUNT(*) as row_count FROM admin_activity_log;

-- Display cleanup completion message
SELECT 'Database cleanup completed successfully!' as status,
       'All user data has been deleted' as message,
       'Table structures and policies remain intact' as note;
