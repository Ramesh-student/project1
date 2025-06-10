# ServiceHub v13 Deployment Guide 🚀

## Pre-Deployment Checklist ✅

### 1. Environment Setup
- [ ] Supabase project created and configured
- [ ] Database schema deployed
- [ ] Environment variables ready (server-side only for sensitive data)
- [ ] Payment gateway configured

### 2. Code Preparation
- [ ] All version files cleaned up
- [ ] Dependencies updated
- [ ] Build process tested locally
- [ ] Demo accounts configured
- [ ] Security vulnerabilities addressed

## Deployment Options

### Option 1: Vercel Deployment (Recommended) ⭐

#### Step 1: Prepare for Deployment
\`\`\`bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login
\`\`\`

#### Step 2: Configure Environment Variables
Create these environment variables in Vercel:

**Public Variables (exposed to client):**
\`\`\`env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
\`\`\`

**Private Variables (server-side only):**
\`\`\`env
ADMIN_SECRET_KEY=your_secure_admin_secret_here
DEMO_MODE=false
\`\`\`

**Important**: Never use `NEXT_PUBLIC_` prefix for sensitive data like admin secrets.

#### Step 3: Deploy
\`\`\`bash
# Deploy to production
vercel --prod

# Or deploy preview
vercel
\`\`\`

### Option 2: Netlify Deployment

#### Step 1: Build Configuration
Create `netlify.toml`:
\`\`\`toml
[build]
  command = "npm run build"
  publish = ".next"

[build.environment]
  NODE_VERSION = "18"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
\`\`\`

#### Step 2: Deploy
\`\`\`bash
# Install Netlify CLI
npm install -g netlify-cli

# Deploy
netlify deploy --prod --dir=.next
\`\`\`

### Option 3: Docker Deployment

#### Dockerfile
\`\`\`dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
\`\`\`

#### Deploy with Docker
\`\`\`bash
# Build image
docker build -t servicehub-v13 .

# Run container
docker run -p 3000:3000 servicehub-v13
\`\`\`

## Database Setup for Production

### 1. Supabase Configuration

#### Create Tables
Run these scripts in order:
1. `scripts/database-schema.sql`
2. `scripts/database-setup.sql`
3. `scripts/admin-schema-update.sql`

#### Enable RLS Policies
\`\`\`sql
-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
\`\`\`

#### Storage Setup
\`\`\`sql
-- Create storage bucket
INSERT INTO storage.buckets (id, name, public) 
VALUES ('service-images', 'service-images', true);
\`\`\`

### 2. Demo Data (Optional)
\`\`\`sql
-- Insert demo users
INSERT INTO auth.users (id, email) VALUES 
  ('demo-customer-id', 'customer@demo.com'),
  ('demo-electrician-id', 'electrician@demo.com'),
  ('demo-plumber-id', 'plumber@demo.com'),
  ('demo-admin-id', 'admin@demo.com');
\`\`\`

## Security Configuration

### Environment Variables Security
- **Never** use `NEXT_PUBLIC_` prefix for sensitive data
- Admin secrets are validated server-side only
- Use strong, unique secrets for production
- Rotate secrets regularly

### Production Security Checklist
- [ ] Admin secret key is server-side only
- [ ] No sensitive data exposed to client
- [ ] HTTPS enabled
- [ ] Database access restricted
- [ ] Admin panel protected
- [ ] Input validation implemented

## Post-Deployment Verification

### 1. Functionality Tests
- [ ] Homepage loads correctly
- [ ] Authentication works
- [ ] Demo accounts functional
- [ ] Database connections active
- [ ] Payment system operational
- [ ] Admin creation works with server-side validation

### 2. Security Tests
- [ ] Admin secret not visible in client code
- [ ] Server-side validation working
- [ ] No sensitive environment variables in browser
- [ ] Admin authorization functioning

### 3. Performance Checks
- [ ] Page load times < 3 seconds
- [ ] Mobile responsiveness
- [ ] Image optimization
- [ ] API response times

## Monitoring & Maintenance

### 1. Error Tracking
Set up monitoring with:
- Vercel Analytics
- Sentry for error tracking
- Supabase monitoring

### 2. Backup Strategy
- Daily database backups
- Code repository backups
- Environment variable backups (secure storage)

### 3. Updates
- Regular dependency updates
- Security patches
- Feature deployments

## Troubleshooting

### Common Deployment Issues

#### Build Failures
\`\`\`bash
# Clear cache and rebuild
rm -rf .next node_modules
npm install
npm run build
\`\`\`

#### Environment Variable Issues
\`\`\`bash
# Verify variables are set
vercel env ls

# Add missing variables (use correct prefixes)
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add ADMIN_SECRET_KEY
\`\`\`

#### Security Issues
- Ensure no `NEXT_PUBLIC_` prefix on sensitive variables
- Verify server-side validation is working
- Check that admin secrets are not exposed

#### Database Connection Issues
- Check Supabase project status
- Verify connection strings
- Test database queries

### Performance Issues
- Enable caching
- Optimize images
- Use CDN for static assets

## Production URLs

After successful deployment, your ServiceHub v13 will be available at:

- **Production**: `https://your-app.vercel.app`
- **Admin Panel**: `https://your-app.vercel.app/auth/admin/login`
- **API Endpoints**: `https://your-app.vercel.app/api/*`

## Support

For deployment support:
1. Check Vercel/Netlify documentation
2. Review Supabase setup guides
3. Test with demo accounts
4. Monitor application logs
5. Verify security configurations

---

**ServiceHub v13 is ready for secure production deployment! 🎉**
