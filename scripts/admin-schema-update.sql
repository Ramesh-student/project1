-- Add admin user type to the existing user_type check constraint
ALTER TABLE users DROP CONSTRAINT IF EXISTS users_user_type_check;
ALTER TABLE users ADD CONSTRAINT users_user_type_check 
  CHECK (user_type IN ('customer', 'provider', 'admin'));

-- Create admin settings table for configuration
CREATE TABLE IF NOT EXISTS admin_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  setting_key VARCHAR(255) UNIQUE NOT NULL,
  setting_value TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create admin activity log
CREATE TABLE IF NOT EXISTS admin_activity_log (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  admin_id UUID REFERENCES users(id) NOT NULL,
  action_type VARCHAR(50) NOT NULL,
  action_details JSONB NOT NULL,
  ip_address VARCHAR(50),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert initial admin settings
INSERT INTO admin_settings (setting_key, setting_value, description)
VALUES 
  ('site_maintenance_mode', 'false', 'Enable/disable site maintenance mode'),
  ('default_visiting_charges', '500', 'Default visiting charges for service providers'),
  ('system_version', '1.0.0', 'Current system version')
ON CONFLICT (setting_key) DO NOTHING;

-- Create RLS policies for admin tables
ALTER TABLE admin_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_activity_log ENABLE ROW LEVEL SECURITY;

-- Only admins can access admin settings
CREATE POLICY "Admins can manage settings" ON admin_settings
  USING (EXISTS (
    SELECT 1 FROM users 
    WHERE users.id = auth.uid() 
    AND users.user_type = 'admin'
  ));

-- Only admins can access activity logs
CREATE POLICY "Admins can view activity logs" ON admin_activity_log
  USING (EXISTS (
    SELECT 1 FROM users 
    WHERE users.id = auth.uid() 
    AND users.user_type = 'admin'
  ));

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_admin_activity_log_admin_id ON admin_activity_log(admin_id);
CREATE INDEX IF NOT EXISTS idx_admin_activity_log_created_at ON admin_activity_log(created_at);
