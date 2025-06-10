-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  address TEXT NOT NULL,
  user_type VARCHAR(20) NOT NULL CHECK (user_type IN ('customer', 'provider')),
  service_type VARCHAR(20) CHECK (service_type IN ('electrician', 'plumber')),
  experience INTEGER,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create service_requests table
CREATE TABLE IF NOT EXISTS service_requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_id UUID REFERENCES users(id) NOT NULL,
  provider_id UUID REFERENCES users(id),
  service_type VARCHAR(20) NOT NULL CHECK (service_type IN ('electrician', 'plumber')),
  problem_description TEXT NOT NULL,
  problem_image_url TEXT,
  preferred_date DATE NOT NULL,
  preferred_time TIME NOT NULL,
  customer_address TEXT NOT NULL,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'payment_pending', 'in_progress', 'completed', 'cancelled')),
  visiting_charges DECIMAL(10,2) DEFAULT 500.00,
  total_amount DECIMAL(10,2),
  payment_status VARCHAR(20) DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create storage bucket for service images
INSERT INTO storage.buckets (id, name, public) VALUES ('service-images', 'service-images', true)
ON CONFLICT (id) DO NOTHING;

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_requests ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users table
CREATE POLICY "Users can view own profile" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Anyone can insert user profile" ON users
  FOR INSERT WITH CHECK (true);

-- RLS Policies for service_requests table
CREATE POLICY "Customers can view own requests" ON service_requests
  FOR SELECT USING (auth.uid() = customer_id);

CREATE POLICY "Providers can view relevant requests" ON service_requests
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.user_type = 'provider' 
      AND users.service_type = service_requests.service_type
    )
  );

CREATE POLICY "Customers can insert requests" ON service_requests
  FOR INSERT WITH CHECK (auth.uid() = customer_id);

CREATE POLICY "Providers can update assigned requests" ON service_requests
  FOR UPDATE USING (auth.uid() = provider_id OR auth.uid() = customer_id);

-- Storage policies
CREATE POLICY "Anyone can upload service images" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'service-images');

CREATE POLICY "Anyone can view service images" ON storage.objects
  FOR SELECT USING (bucket_id = 'service-images');

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_service_requests_customer_id ON service_requests(customer_id);
CREATE INDEX IF NOT EXISTS idx_service_requests_provider_id ON service_requests(provider_id);
CREATE INDEX IF NOT EXISTS idx_service_requests_service_type ON service_requests(service_type);
CREATE INDEX IF NOT EXISTS idx_service_requests_status ON service_requests(status);
CREATE INDEX IF NOT EXISTS idx_users_user_type ON users(user_type);
CREATE INDEX IF NOT EXISTS idx_users_service_type ON users(service_type);
