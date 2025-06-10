# 🚀 Supabase Project Setup Guide

## **Recommended Project Configuration**

### **1. Project Name**
\`\`\`
Project Name: servicehub-ecommerce
\`\`\`
*This appears in your Supabase dashboard URL and project list*

### **2. Database Name**
\`\`\`
Database Name: postgres (default)
\`\`\`
*Supabase automatically creates this*

### **3. Organization**
\`\`\`
Organization: Your Organization Name
\`\`\`
*Use your personal or company name*

### **4. Region**
\`\`\`
Recommended: Choose closest to your users
- US East (N. Virginia) - us-east-1
- Europe (Ireland) - eu-west-1  
- Asia Pacific (Singapore) - ap-southeast-1
\`\`\`

## **🔗 Your Project URLs Will Be:**

### **Project Dashboard**
\`\`\`
https://supabase.com/dashboard/project/[your-project-id]
\`\`\`

### **API URL Format**
\`\`\`
https://[your-project-id].supabase.co
\`\`\`

### **Database Connection**
\`\`\`
Host: db.[your-project-id].supabase.co
Database: postgres
Port: 5432
\`\`\`

## **📋 Project Settings You'll See**

### **In Supabase Dashboard:**
1. **Project Name**: servicehub-ecommerce
2. **Reference ID**: Auto-generated (like: abcdefghijklmnop)
3. **Region**: Your selected region
4. **Database**: postgres
5. **Status**: Active

### **API Configuration:**
- **URL**: `https://[reference-id].supabase.co`
- **Anon Key**: `eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...`
- **Service Role Key**: `eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...`

## **🗄️ Database Schema Name**

Your tables will be in the **`public`** schema:
- `public.users`
- `public.service_requests`  
- `public.payments`
- `public.reviews`

## **📊 Storage Bucket Names**

- **Bucket Name**: `service-images`
- **Full Path**: `https://[project-id].supabase.co/storage/v1/object/public/service-images/`
