# 🧭 Supabase Navigation Guide

## How to Access Your Database Tables

### **Step 1: Login to Supabase**
1. Go to [supabase.com](https://supabase.com)
2. Sign in to your account
3. Select your project

### **Step 2: Navigate to Table Editor**
\`\`\`
Supabase Dashboard → Left Sidebar → Table Editor
\`\`\`

### **Step 3: View Your Tables**
You'll see these tables listed:

#### 📋 **users**
- **Purpose**: Customer and service provider profiles
- **Key Fields**: email, full_name, user_type, service_type
- **What to Look For**: New registrations appear here

#### 📋 **service_requests** 
- **Purpose**: All service bookings and requests
- **Key Fields**: service_type, problem_description, status
- **What to Look For**: New bookings, status changes

#### 📋 **payments** (if created)
- **Purpose**: Payment transaction records
- **Key Fields**: amount, payment_method, status

#### 📋 **reviews** (if created)
- **Purpose**: Customer feedback and ratings
- **Key Fields**: rating, comment

## 🖼️ **Storage Section**

### **Access File Storage**
\`\`\`
Supabase Dashboard → Left Sidebar → Storage
\`\`\`

#### 📁 **service-images bucket**
- **Purpose**: Stores customer-uploaded problem images
- **Access**: Public (images can be viewed by anyone with URL)
- **File Types**: JPG, PNG, GIF uploaded by customers

## 🔍 **How to Monitor Activity**

### **Real-time Data Viewing**
1. **Table Editor**: See data as it's added
2. **Refresh**: Click refresh button to see latest data
3. **Filters**: Use filters to find specific records

### **SQL Editor** (Advanced)
\`\`\`
Supabase Dashboard → Left Sidebar → SQL Editor
\`\`\`
- Run custom queries
- View complex data relationships
- Export data

## 📊 **Sample Queries to Try**

### **View All Customers**
\`\`\`sql
SELECT * FROM users WHERE user_type = 'customer';
\`\`\`

### **View All Service Requests**
\`\`\`sql
SELECT 
  sr.*,
  u.full_name as customer_name
FROM service_requests sr
JOIN users u ON sr.customer_id = u.id
ORDER BY sr.created_at DESC;
\`\`\`

### **View Pending Requests**
\`\`\`sql
SELECT * FROM service_requests WHERE status = 'pending';
\`\`\`

## 🔐 **Authentication Users**

### **View Registered Users**
\`\`\`
Supabase Dashboard → Left Sidebar → Authentication → Users
\`\`\`
- See all registered users
- View email verification status
- Manage user accounts

## 📈 **Analytics & Monitoring**

### **Database Usage**
\`\`\`
Supabase Dashboard → Left Sidebar → Settings → Usage
\`\`\`
- Monitor database size
- Track API requests
- View storage usage

### **Logs**
\`\`\`
Supabase Dashboard → Left Sidebar → Logs
\`\`\`
- See database queries
- Monitor errors
- Track performance
