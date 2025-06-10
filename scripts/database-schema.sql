-- Enable Row Level Security
ALTER DATABASE postgres SET "app.jwt_secret" TO 'your-jwt-secret';

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

-- Create payments table
CREATE TABLE IF NOT EXISTS payments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  request_id UUID REFERENCES service_requests(id) NOT NULL,
  customer_id UUID REFERENCES users(id) NOT NULL,
  provider_id UUID REFERENCES users(id),
  amount DECIMAL(10,2) NOT NULL,
  payment_type VARCHAR(20) NOT NULL CHECK (payment_type IN ('visiting_charges', 'service_charges')),
  payment_method VARCHAR(20) DEFAULT 'upi',
  transaction_id VARCHAR(255),
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create reviews table
CREATE TABLE IF NOT EXISTS reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  request_id UUID REFERENCES service_requests(id) NOT NULL,
  customer_id UUID REFERENCES users(id) NOT NULL,
  provider_id UUID REFERENCES users(id) NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create storage bucket for service images
INSERT INTO storage.buckets (id, name, public) VALUES ('service-images', 'service-images', true);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

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

-- RLS Policies for payments table
CREATE POLICY "Users can view own payments" ON payments
  FOR SELECT USING (auth.uid() = customer_id OR auth.uid() = provider_id);

CREATE POLICY "Customers can insert payments" ON payments
  FOR INSERT WITH CHECK (auth.uid() = customer_id);

-- RLS Policies for reviews table
CREATE POLICY "Anyone can view reviews" ON reviews
  FOR SELECT USING (true);

CREATE POLICY "Customers can insert reviews" ON reviews
  FOR INSERT WITH CHECK (auth.uid() = customer_id);

-- Storage policies
CREATE POLICY "Anyone can upload service images" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'service-images');

CREATE POLICY "Anyone can view service images" ON storage.objects
  FOR SELECT USING (bucket_id = 'service-images');

-- Create indexes for better performance
CREATE INDEX idx_service_requests_customer_id ON service_requests(customer_id);
CREATE INDEX idx_service_requests_provider_id ON service_requests(provider_id);
CREATE INDEX idx_service_requests_service_type ON service_requests(service_type);
CREATE INDEX idx_service_requests_status ON service_requests(status);
CREATE INDEX idx_users_user_type ON users(user_type);
CREATE INDEX idx_users_service_type ON users(service_type);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_service_requests_updated_at BEFORE UPDATE ON service_requests
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
