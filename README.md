# ServiceHub Platform v13 🚀

A comprehensive service management platform connecting customers with electricians and plumbers.

## 🌟 Features

### Core Functionality
- **Multi-Role Authentication**: Customer, Provider (Electrician/Plumber), Admin
- **Service Booking System**: Complete request management workflow
- **UPI Payment Integration**: Real-time payment processing with QR codes
- **Admin Dashboard**: Full platform management and analytics
- **Database Management**: Complete data exploration and backup tools

### Version 13 Highlights
- Modern gradient-based UI design
- Enhanced mobile responsiveness
- Improved user experience flows
- Advanced payment integration
- Comprehensive admin tools
- Secure server-side admin authentication

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- Supabase account
- Vercel account (for deployment)

### Installation

1. **Clone the repository**
\`\`\`bash
git clone <your-repo-url>
cd servicehub-v13
\`\`\`

2. **Install dependencies**
\`\`\`bash
npm install
\`\`\`

3. **Environment Setup**
Create a `.env.local` file:
\`\`\`env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
ADMIN_SECRET_KEY=your_secure_admin_secret
DEMO_MODE=true
\`\`\`

**Note**: The `ADMIN_SECRET_KEY` is server-side only and not exposed to the client.

4. **Database Setup**
Run the SQL scripts in order:
- `scripts/database-schema.sql`
- `scripts/database-setup.sql`
- `scripts/admin-schema-update.sql`

5. **Start Development Server**
\`\`\`bash
npm run dev
\`\`\`

## 📱 Demo Accounts

### Customer
- Email: `customer@demo.com`
- Password: `password123`

### Electrician
- Email: `electrician@demo.com`
- Password: `password123`

### Plumber
- Email: `plumber@demo.com`
- Password: `password123`

### Admin
- Email: `admin@demo.com`
- Password: `password123`

## 🔗 Key Routes

- **Homepage**: `/`
- **Login**: `/auth/login`
- **Signup**: `/auth/signup`
- **Customer Dashboard**: `/dashboard/customer`
- **Provider Dashboard**: `/dashboard/electrician` or `/dashboard/plumber`
- **Admin Panel**: `/auth/admin/login`
- **Database Explorer**: `/database-access`

## 🏗️ Architecture

### Frontend
- **Framework**: Next.js 14 with App Router
- **Styling**: Tailwind CSS + shadcn/ui
- **Icons**: Lucide React
- **State Management**: React Hooks

### Backend
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Storage**: Supabase Storage
- **API**: Next.js API Routes
- **Security**: Server-side validation for admin operations

### Database Schema
- `users` - User profiles and authentication
- `service_requests` - Service booking requests
- `payments` - Payment transactions
- `reviews` - Customer reviews and ratings
- `admin_settings` - Application configuration
- `admin_activity_log` - Admin action tracking

## 🚀 Deployment

### Vercel Deployment (Recommended)

1. **Connect to Vercel**
\`\`\`bash
npm run deploy
\`\`\`

2. **Set Environment Variables**
Add your environment variables in Vercel dashboard:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `ADMIN_SECRET_KEY` (server-side only)
- `DEMO_MODE=false` (for production)

3. **Deploy**
\`\`\`bash
npm run deploy
\`\`\`

### Manual Deployment

1. **Build the application**
\`\`\`bash
npm run build
\`\`\`

2. **Start production server**
\`\`\`bash
npm start
\`\`\`

## 🔧 Configuration

### Supabase Setup
1. Create a new Supabase project
2. Run the provided SQL scripts
3. Configure Row Level Security (RLS)
4. Set up storage buckets for images

### Admin Security
- Admin secret key validation happens server-side only
- No sensitive keys are exposed to the client
- Secure authorization flow for admin creation

### Payment Configuration
- Configure UPI payment gateway
- Set up webhook endpoints
- Update payment credentials

## 📊 Features Overview

### Customer Features
- Service booking with image upload
- Real-time request tracking
- UPI payment integration
- Service history and reviews

### Provider Features
- Request management dashboard
- Service acceptance/rejection
- Payment tracking
- Customer communication

### Admin Features
- User management
- Service request oversight
- Payment monitoring
- System configuration
- Database management tools
- Secure admin account creation

## 🛠️ Development

### Project Structure
\`\`\`
servicehub-v13/
├── app/                    # Next.js app directory
├── components/             # Reusable components
├── lib/                   # Utility functions
├── scripts/               # Database scripts
├── docs/                  # Documentation
└── public/                # Static assets
\`\`\`

### Key Components
- Authentication system
- Dashboard layouts
- Payment integration
- Database management
- Admin tools
- Server-side security utilities

## 🔒 Security

- Row Level Security (RLS) enabled
- JWT token authentication
- Secure API endpoints
- Input validation and sanitization
- CORS configuration
- Server-side admin secret validation
- No sensitive environment variables exposed to client

## 📈 Performance

- Server-side rendering (SSR)
- Static site generation (SSG)
- Image optimization
- Code splitting
- Lazy loading

## 🐛 Troubleshooting

### Common Issues
1. **Database Connection**: Check Supabase credentials
2. **Authentication**: Verify JWT configuration
3. **Payments**: Confirm UPI gateway setup
4. **Deployment**: Check environment variables
5. **Admin Access**: Ensure server-side secret key is configured

### Support
- Check the documentation in `/docs`
- Review database schema
- Test with demo accounts

## 📝 License

This project is licensed under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

---

**ServiceHub v13** - Connecting customers with trusted service providers! 🔧⚡
