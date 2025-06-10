-- Create a backup_logs table to track database backups
CREATE TABLE IF NOT EXISTS backup_logs (
  id SERIAL PRIMARY KEY,
  backup_time TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  backup_type VARCHAR(50) NOT NULL,
  backup_size BIGINT,
  backup_status VARCHAR(50) NOT NULL,
  backup_location VARCHAR(255),
  admin_id UUID REFERENCES users(id),
  metadata JSONB
);

-- Create a function to log backups
CREATE OR REPLACE FUNCTION log_backup(
  p_backup_type VARCHAR(50),
  p_backup_size BIGINT,
  p_backup_status VARCHAR(50),
  p_backup_location VARCHAR(255),
  p_admin_id UUID,
  p_metadata JSONB
) RETURNS VOID AS $$
BEGIN
  INSERT INTO backup_logs (
    backup_type,
    backup_size,
    backup_status,
    backup_location,
    admin_id,
    metadata
  ) VALUES (
    p_backup_type,
    p_backup_size,
    p_backup_status,
    p_backup_location,
    p_admin_id,
    p_metadata
  );
END;
$$ LANGUAGE plpgsql;

-- Create a view for backup statistics
CREATE OR REPLACE VIEW backup_statistics AS
SELECT
  date_trunc('day', backup_time) AS backup_date,
  backup_type,
  COUNT(*) AS backup_count,
  SUM(backup_size) AS total_size,
  MAX(backup_time) AS latest_backup
FROM backup_logs
GROUP BY date_trunc('day', backup_time), backup_type
ORDER BY backup_date DESC;

-- Sample data for testing
INSERT INTO backup_logs (backup_type, backup_size, backup_status, backup_location, metadata)
VALUES 
('manual', 1024000, 'completed', 'local_storage', '{"tables": ["users", "service_requests", "payments"], "record_count": 150}'),
('scheduled', 1536000, 'completed', 'local_storage', '{"tables": ["users", "service_requests", "payments"], "record_count": 175}');

-- Output success message
SELECT 'Backup schema and functions created successfully' AS result;
