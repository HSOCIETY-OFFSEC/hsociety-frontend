# DEPLOYMENT.md

# Hsociety Deployment Guide

This guide covers deployment options for the Hsociety frontend application.

## 🚀 Deployment Platforms

### Vercel (Recommended)

**Current Deployment**: https://hsociety.vercel.app/

#### Deploy via Vercel CLI

1. Install Vercel CLI
```bash
npm install -g vercel
```

2. Login to Vercel
```bash
vercel login
```

3. Deploy
```bash
vercel
```

4. Deploy to production
```bash
vercel --prod
```

#### Deploy via Git Integration

1. Push code to GitHub/GitLab/Bitbucket
2. Import project in Vercel dashboard
3. Configure build settings:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

4. Add environment variables in Vercel dashboard
5. Deploy

**Automatic deployments** will trigger on every push to main branch.

---

### Netlify

#### Deploy via Netlify CLI

1. Install Netlify CLI
```bash
npm install -g netlify-cli
```

2. Login
```bash
netlify login
```

3. Initialize site
```bash
netlify init
```

4. Deploy
```bash
netlify deploy --prod
```

#### Deploy via Git

1. Connect repository in Netlify dashboard
2. Build settings:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
   - **Base directory**: (leave empty)

3. Add environment variables
4. Deploy

---

### AWS Amplify

1. Connect Git repository
2. Build settings (auto-detected for Vite):
```yaml
version: 1
frontend:
  phases:
    preBuild:
      commands:
        - npm install
    build:
      commands:
        - npm run build
  artifacts:
    baseDirectory: dist
    files:
      - '**/*'
  cache:
    paths:
      - node_modules/**/*
```

3. Set environment variables
4. Deploy

---

### Railway

1. Create new project from GitHub repo
2. Add environment variables
3. Railway auto-detects Vite and deploys

---

### Render

1. Create new Static Site
2. Connect repository
3. Build settings:
   - **Build Command**: `npm run build`
   - **Publish Directory**: `dist`
4. Add environment variables
5. Deploy

---

## 🔧 Build Configuration

### Environment Variables

For production, set these in your deployment platform:
```env
VITE_ENV=production
VITE_API_BASE_URL=https://api.hsociety.com/api
VITE_WS_URL=wss://api.hsociety.com
```

### Build Command
```bash
npm run build
```

This creates optimized production files in the `dist` directory.

### Preview Build Locally
```bash
npm run preview
```

---

## 📋 Pre-Deployment Checklist

- [ ] All environment variables configured
- [ ] API endpoints point to production backend
- [ ] Remove console.logs and debug code
- [ ] Test build locally with `npm run preview`
- [ ] Security headers configured
- [ ] CORS settings verified
- [ ] SSL/HTTPS enabled
- [ ] Custom domain configured (if applicable)
- [ ] Analytics/monitoring setup
- [ ] Error tracking configured (e.g., Sentry)

---

## 🔒 Security Configuration

### Recommended Headers

Configure these headers in your deployment platform:
```
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
Referrer-Policy: strict-origin-when-cross-origin
Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline';
```

### Vercel Headers

Create `vercel.json`:
```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        }
      ]
    }
  ]
}
```

### Netlify Headers

Create `netlify.toml`:
```toml
[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-Content-Type-Options = "nosniff"
    X-XSS-Protection = "1; mode=block"
    Referrer-Policy = "strict-origin-when-cross-origin"
```

---

## 🔄 CI/CD Pipeline

### GitHub Actions Example

Create `.github/workflows/deploy.yml`:
```yaml
name: Deploy to Production

on:
  push:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        
    - name: Install dependencies
      run: npm install
      
    - name: Run tests
      run: npm test
      
    - name: Build
      run: npm run build
      env:
        VITE_API_BASE_URL: ${{ secrets.VITE_API_BASE_URL }}
        
    - name: Deploy to Vercel
      uses: amondnet/vercel-action@v20
      with:
        vercel-token: ${{ secrets.VERCEL_TOKEN }}
        vercel-org-id: ${{ secrets.ORG_ID }}
        vercel-project-id: ${{ secrets.PROJECT_ID }}
        vercel-args: '--prod'
```

---

## 🌐 Custom Domain Setup

### Vercel

1. Go to project settings → Domains
2. Add your custom domain
3. Configure DNS records as instructed
4. Wait for SSL certificate provisioning

### DNS Records
```
Type: A
Name: @
Value: 76.76.21.21

Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

---

## 📊 Monitoring & Analytics

### Recommended Tools

- **Error Tracking**: Sentry, LogRocket
- **Analytics**: Google Analytics, Plausible
- **Performance**: Vercel Analytics, Web Vitals
- **Uptime Monitoring**: UptimeRobot, Pingdom

---

## 🐛 Troubleshooting

### Build Fails

1. Check Node.js version (18+ required)
2. Clear cache: `npm clean-install`
3. Check environment variables
4. Review build logs

### Routes Not Working (404)

- Ensure SPA fallback is configured
- Vercel: Automatic
- Netlify: Add `_redirects` file:
```
  /*    /index.html   200
```

### API Calls Failing

- Verify CORS settings on backend
- Check API URL in environment variables
- Ensure cookies are being sent (`credentials: 'include'`)

---

## 📞 Support

For deployment issues, contact: contact@hsociety.com

---

**Last Updated**: January 31, 2026