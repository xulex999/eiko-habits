# Quick Start Guide

Get up and running with the Eiko Habits web app in 5 minutes.

## Prerequisites

- Node.js 18+ installed
- npm or pnpm package manager
- Git

## Installation

```bash
# Clone the repository
git clone <repo-url>
cd eiko-habits/apps/web

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local

# Start development server
npm run dev
```

Visit `http://localhost:3000` to see the app.

## Common Commands

```bash
# Development
npm run dev              # Start dev server
npm run build           # Build for production
npm run start           # Start production server

# Code Quality
npm run typecheck       # Check TypeScript types
npm run lint            # Lint code
npm run lint:fix        # Auto-fix linting issues
npm run format          # Format with Prettier

# Utilities
npm run clean           # Remove build artifacts
npm run analyze         # Analyze bundle size
```

## Environment Variables

Edit `.env.local`:

```env
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:3001
```

## Project Structure

```
app/
├── (auth)/              # Login, Register
├── (dashboard)/         # Protected routes
├── (marketing)/         # Public pages
└── api/                # API routes

components/ui/           # Reusable components
lib/                    # Utilities
```

## Key Features

### Routing

```typescript
// Navigate programmatically
import { useRouter } from 'next/navigation';

const router = useRouter();
router.push('/dashboard');
```

### API Calls

```typescript
import { api } from '@/lib/api';

// GET request
const data = await api.get('/api/v1/habits');

// POST request
await api.post('/api/v1/habits', { title: 'Exercise' });
```

### Analytics

```typescript
import { analytics } from '@/lib/analytics';

// Track page view
analytics.pageView('/dashboard');

// Track event
analytics.event({
  action: 'habit_complete',
  category: 'engagement',
  label: 'morning-workout',
});
```

### Components

```typescript
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';

<Button variant="primary" size="lg">
  Click me
</Button>

<Card hover padding="lg">
  Content here
</Card>
```

## Available Routes

### Public
- `/` - Landing page
- `/pricing` - Pricing
- `/login` - Login
- `/register` - Register

### Protected
- `/dashboard` - Dashboard home
- `/habits` - Habits
- `/goals` - Goals
- `/finance` - Finance
- `/analytics` - Analytics
- `/coach` - AI Coach
- `/settings` - Settings

## Styling

Use Tailwind classes with CSS variables:

```tsx
<div className="bg-[var(--primary)] text-white p-4 rounded-lg">
  Content
</div>
```

### Available Variables

```css
--primary          /* #4F46E5 */
--finance          /* #10B981 */
--streak           /* #F59E0B */
--destructive      /* #F43F5E */
--text-primary     /* Dark text */
--text-secondary   /* Gray text */
--text-tertiary    /* Light gray */
--background       /* Page background */
--surface          /* Card background */
```

## Troubleshooting

### Build Errors

```bash
# Clear cache and rebuild
npm run clean
npm install
npm run build
```

### Type Errors

```bash
# Check all type errors
npm run typecheck
```

### Port Already in Use

```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9
```

## Development Tips

1. **Hot Reload**: Changes auto-reload in dev mode
2. **Fast Refresh**: React components update without page refresh
3. **TypeScript**: Use strict typing for better DX
4. **Linting**: Run `npm run lint:fix` before committing
5. **Components**: Create reusable components in `/components`

## Testing Locally

### Test Production Build

```bash
npm run build
npm start
```

### Test with API

Make sure the backend API is running:

```bash
# In a separate terminal
cd ../api
npm run dev
```

## Deployment

### Quick Deploy to Vercel

```bash
npm i -g vercel
vercel
```

### Build Docker Image

```bash
docker build -t eiko-web .
docker run -p 3000:3000 eiko-web
```

## Next Steps

1. Read [README.md](./README.md) for detailed documentation
2. Check [DEPLOYMENT.md](./DEPLOYMENT.md) for production deployment
3. Review [PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md) for architecture
4. See [UPDATES.md](./UPDATES.md) for recent changes

## Need Help?

- Check the documentation files
- Review error messages in the terminal
- Check browser console for client-side errors
- Verify environment variables are set
- Ensure API is running and accessible

## Quick Reference

| Task | Command |
|------|---------|
| Start dev | `npm run dev` |
| Build | `npm run build` |
| Lint | `npm run lint` |
| Type check | `npm run typecheck` |
| Format code | `npm run format` |
| Clean | `npm run clean` |

---

Happy coding! 🚀
