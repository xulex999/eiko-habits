# Deployment Guide

This guide covers deploying the Eiko Habits web app to production.

## Pre-deployment Checklist

- [ ] All environment variables are configured
- [ ] TypeScript builds without errors (`npm run typecheck`)
- [ ] Linting passes (`npm run lint`)
- [ ] Production build succeeds (`npm run build`)
- [ ] API endpoints are accessible
- [ ] SSL certificates are configured
- [ ] Analytics tracking is set up

## Environment Variables

### Required

```env
NEXT_PUBLIC_APP_URL=https://eikohabits.com
NEXT_PUBLIC_API_URL=https://api.eikohabits.com
```

### Optional

```env
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
NEXT_PUBLIC_POSTHOG_KEY=phc_xxxxxxxxxxxx
NEXT_PUBLIC_ENABLE_AI_COACH=true
NEXT_PUBLIC_ENABLE_ANALYTICS=true
```

## Deployment Options

### Option 1: Vercel (Recommended)

Vercel provides the best experience for Next.js apps with automatic deployments and edge optimization.

#### Setup

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Login to Vercel:
```bash
vercel login
```

3. Deploy:
```bash
vercel
```

4. For production deployment:
```bash
vercel --prod
```

#### Configuration

Create a `vercel.json` file:

```json
{
  "framework": "nextjs",
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "regions": ["iad1"],
  "env": {
    "NEXT_PUBLIC_APP_URL": "https://eikohabits.com",
    "NEXT_PUBLIC_API_URL": "https://api.eikohabits.com"
  }
}
```

### Option 2: Docker

#### Build Image

```bash
docker build -t eiko-web:latest .
```

#### Run Container

```bash
docker run -d \
  -p 3000:3000 \
  -e NEXT_PUBLIC_APP_URL=https://eikohabits.com \
  -e NEXT_PUBLIC_API_URL=https://api.eikohabits.com \
  --name eiko-web \
  eiko-web:latest
```

#### Docker Compose

```yaml
version: '3.8'

services:
  web:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NEXT_PUBLIC_APP_URL=https://eikohabits.com
      - NEXT_PUBLIC_API_URL=https://api.eikohabits.com
    restart: unless-stopped
```

### Option 3: Traditional VPS (Ubuntu/Debian)

#### Prerequisites

- Node.js 18+
- Nginx
- PM2 or systemd for process management

#### Setup

1. Install dependencies:
```bash
sudo apt update
sudo apt install -y nodejs npm nginx
npm install -g pm2
```

2. Clone and build:
```bash
git clone <repo-url>
cd apps/web
npm install
npm run build
```

3. Start with PM2:
```bash
pm2 start npm --name "eiko-web" -- start
pm2 save
pm2 startup
```

4. Configure Nginx:
```nginx
server {
    listen 80;
    server_name eikohabits.com www.eikohabits.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

5. Enable SSL with Let's Encrypt:
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d eikohabits.com -d www.eikohabits.com
```

## Post-deployment

### Verify Deployment

1. Check health endpoint:
```bash
curl https://eikohabits.com/api/health
```

2. Test key pages:
- Landing page: https://eikohabits.com
- Login: https://eikohabits.com/login
- Dashboard: https://eikohabits.com/dashboard

3. Verify SEO:
- Sitemap: https://eikohabits.com/sitemap.xml
- Robots: https://eikohabits.com/robots.txt
- Manifest: https://eikohabits.com/manifest.json

### Monitor

- Set up error tracking (Sentry, etc.)
- Configure uptime monitoring
- Set up analytics dashboards
- Monitor Core Web Vitals

### Performance Optimization

1. Enable caching headers
2. Configure CDN (Cloudflare, etc.)
3. Optimize images
4. Enable compression
5. Implement rate limiting

## Rollback

### Vercel
```bash
vercel rollback
```

### Docker
```bash
docker stop eiko-web
docker start eiko-web-previous
```

### PM2
```bash
pm2 stop eiko-web
# Deploy previous version
pm2 start eiko-web
```

## Troubleshooting

### Build Errors

- Check Node.js version (`node -v`)
- Clear cache: `rm -rf .next node_modules && npm install`
- Verify environment variables

### Runtime Errors

- Check logs: `pm2 logs eiko-web` or Vercel dashboard
- Verify API connectivity
- Check database connections

### Performance Issues

- Analyze bundle size: `npm run analyze`
- Check server resources (CPU, memory)
- Review slow queries in backend

## Support

For deployment issues, contact the development team or check the internal documentation.
