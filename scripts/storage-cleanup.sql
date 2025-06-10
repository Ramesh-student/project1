-- =====================================================
-- STORAGE CLEANUP SCRIPT
-- =====================================================
-- This script helps clean up storage buckets
-- Note: File deletion usually requires admin privileges or API calls
-- =====================================================

-- List all files in the service-images bucket
SELECT name, id, created_at, updated_at, last_accessed_at, metadata
FROM storage.objects 
WHERE bucket_id = 'service-images'
ORDER BY created_at DESC;

-- Delete all files from service-images bucket
-- Note: This might require admin privileges
DELETE FROM storage.objects WHERE bucket_id = 'service-images';

-- Verify storage cleanup
SELECT 'storage.objects' as table_name, 
       COUNT(*) as total_files,
       bucket_id
FROM storage.objects 
GROUP BY bucket_id
UNION ALL
SELECT 'service-images bucket' as table_name,
       COUNT(*) as total_files,
       'service-images' as bucket_id
FROM storage.objects 
WHERE bucket_id = 'service-images';

-- Note: If direct SQL deletion doesn't work, you can:
-- 1. Go to Supabase Dashboard > Storage > service-images
-- 2. Select all files and delete them manually
-- 3. Or use the Supabase Storage API to delete files programmatically
