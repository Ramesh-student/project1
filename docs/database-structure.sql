-- =====================================================
-- SERVICEHUB DATABASE STRUCTURE
-- =====================================================

-- 1. USERS TABLE
-- Location: Supabase Dashboard > Table Editor > users
-- Purpose: Store user profiles for customers and service providers
CREATE TABLE users (
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

-- Sample data you might see:
-- | id | email | full_name | phone | user_type | service_type | experience |
-- | uuid-123 | john@email.com | John Doe | +1234567890 | customer | null | null |
-- | uuid-456 | mike@email.com | Mike Smith | +0987654321 | provider | electrician | 5 |

-- =====================================================

-- 2. SERVICE_REQUESTS TABLE  
-- Location: Supabase Dashboard > Table Editor > service_requests
-- Purpose: Store all service booking requests
CREATE TABLE service_requests (
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

-- Sample data you might see:
-- | id | customer_id | service_type | problem_description | status | visiting_charges |
-- | uuid-789 | uuid-123 | electrician | Power outlet not working | pending | 500.00 |
-- | uuid-101 | uuid-123 | plumber | Leaking faucet in kitchen | completed | 500.00 |

-- =====================================================

-- 3. PAYMENTS TABLE (Optional - for future use)
-- Location: Supabase Dashboard > Table Editor > payments
-- Purpose: Track payment transactions
CREATE TABLE payments (
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

-- =====================================================

-- 4. REVIEWS TABLE (Optional - for future use)
-- Location: Supabase Dashboard > Table Editor > reviews  
-- Purpose: Store customer reviews and ratings
CREATE TABLE reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  request_id UUID REFERENCES service_requests(id) NOT NULL,
  customer_id UUID REFERENCES users(id) NOT NULL,
  provider_id UUID REFERENCES users(id) NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================

-- 5. STORAGE BUCKET
-- Location: Supabase Dashboard > Storage > service-images
-- Purpose: Store uploaded problem images
-- Bucket name: service-images
-- Public access: Yes
-- Files: Customer uploaded images showing problems
