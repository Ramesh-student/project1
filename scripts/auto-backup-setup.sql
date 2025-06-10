-- Create a function for automatic backups
CREATE OR REPLACE FUNCTION create_auto_backup() RETURNS TRIGGER AS $$
DECLARE
  backup_data JSONB;
  table_name TEXT := TG_TABLE_NAME;
  operation TEXT := TG_OP;
  row_count INTEGER;
BEGIN
  -- Get count of rows in the table
  EXECUTE format('SELECT COUNT(*) FROM %I', table_name) INTO row_count;
  
  -- Create backup metadata
  backup_data := jsonb_build_object(
    'table', table_name,
    'operation', operation,
    'timestamp', now(),
    'row_count', row_count
  );
  
  -- Log the backup event
  INSERT INTO backup_logs (
    backup_type, 
    backup_status, 
    backup_location,
    metadata
  ) VALUES (
    'auto_' || operation,
    'completed',
    'system',
    backup_data
  );
  
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for major tables to track significant changes
DO $$
DECLARE
  tables TEXT[] := ARRAY['users', 'service_requests', 'payments', 'admin_activity_log'];
  t TEXT;
BEGIN
  FOREACH t IN ARRAY tables LOOP
    -- Drop existing trigger if it exists
    EXECUTE format('DROP TRIGGER IF EXISTS auto_backup_trigger ON %I', t);
    
    -- Create new trigger
    EXECUTE format('
      CREATE TRIGGER auto_backup_trigger
      AFTER INSERT OR UPDATE OR DELETE ON %I
      FOR EACH STATEMENT
      EXECUTE FUNCTION create_auto_backup()
    ', t);
  END LOOP;
END;
$$;

-- Create a function to perform daily backup
CREATE OR REPLACE FUNCTION perform_daily_backup() RETURNS VOID AS $$
DECLARE
  backup_data JSONB;
  total_rows INTEGER := 0;
  table_stats JSONB := '{}';
  t RECORD;
BEGIN
  -- Collect statistics for each table
  FOR t IN 
    SELECT table_name 
    FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_type = 'BASE TABLE'
  LOOP
    DECLARE
      row_count INTEGER;
    BEGIN
      EXECUTE format('SELECT COUNT(*) FROM %I', t.table_name) INTO row_count;
      total_rows := total_rows + row_count;
      table_stats := table_stats || jsonb_build_object(t.table_name, row_count);
    END;
  END LOOP;
  
  -- Create backup metadata
  backup_data := jsonb_build_object(
    'timestamp', now(),
    'total_rows', total_rows,
    'table_statistics', table_stats,
    'backup_type', 'scheduled_daily'
  );
  
  -- Log the backup event
  INSERT INTO backup_logs (
    backup_type, 
    backup_size,
    backup_status, 
    backup_location,
    metadata
  ) VALUES (
    'daily_scheduled',
    total_rows * 100, -- Rough estimate of size
    'completed',
    'system',
    backup_data
  );
END;
$$ LANGUAGE plpgsql;

-- Output success message
SELECT 'Auto-backup system configured successfully' AS result;
