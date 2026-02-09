# Eiko Habits Web App - Project Structure

```
apps/web/
├── .github/
│   └── workflows/
│       └── ci.yml                    # GitHub Actions CI/CD pipeline
│
├── app/                              # Next.js 15 App Router
│   ├── (auth)/                       # Auth route group (login, register)
│   │   ├── layout.tsx               # Auth layout with noindex metadata
│   │   ├── login/
│   │   │   └── page.tsx             # Login page with OAuth
│   │   └── register/
│   │       └── page.tsx             # Registration with password strength
│   │
│   ├── (dashboard)/                  # Dashboard route group
│   │   ├── layout.tsx               # Sidebar layout with mobile support
│   │   ├── loading.tsx              # Loading skeleton
│   │   ├── page.tsx                 # Dashboard home (/dashboard)
│   │   ├── habits/
│   │   │   └── page.tsx             # Habit tracking page
│   │   ├── goals/
│   │   │   └── page.tsx             # Goal management page
│   │   ├── finance/
│   │   │   └── page.tsx             # Finance tracking page
│   │   ├── analytics/
│   │   │   └── page.tsx             # Analytics and insights
│   │   ├── coach/
│   │   │   └── page.tsx             # AI Coach (Premium upsell)
│   │   └── settings/
│   │       └── page.tsx             # User settings
│   │
│   ├── (marketing)/                  # Marketing route group
│   │   ├── layout.tsx               # Marketing layout
│   │   ├── loading.tsx              # Marketing loading state
│   │   ├── page.tsx                 # Landing page with SEO
│   │   └── pricing/
│   │       └── page.tsx             # Pricing page
│   │
│   ├── api/                          # API Routes
│   │   ├── health/
│   │   │   └── route.ts             # Health check endpoint
│   │   └── webhook/                 # Webhook handlers (existing)
│   │
│   ├── globals.css                   # Global styles with CSS variables
│   ├── layout.tsx                    # Root layout with metadata
│   ├── error.tsx                     # Error boundary
│   ├── not-found.tsx                # 404 page
│   ├── manifest.ts                   # PWA manifest
│   ├── robots.ts                     # Robots.txt
│   └── sitemap.ts                    # Sitemap generation
│
├── components/                       # React components
│   └── ui/                          # UI components
│       ├── Button.tsx               # Reusable button component
│       └── Card.tsx                 # Reusable card component
│
├── lib/                              # Utilities and helpers
│   ├── analytics.ts                 # Analytics tracking utilities
│   ├── api.ts                       # API client with auth
│   └── constants.ts                 # App-wide constants
│
├── public/                           # Static assets (icons, images)
│
├── .dockerignore                     # Docker ignore patterns
├── .env.example                      # Environment variables template
├── .eslintrc.json                   # ESLint configuration
├── .gitignore                       # Git ignore patterns
├── .prettierrc                      # Prettier configuration
├── DEPLOYMENT.md                     # Deployment guide
├── Dockerfile                       # Docker configuration
├── next.config.ts                   # Next.js configuration
├── next-env.d.ts                    # Next.js TypeScript definitions
├── package.json                     # Dependencies and scripts
├── postcss.config.mjs               # PostCSS config for Tailwind v4
├── PROJECT_STRUCTURE.md             # This file
├── README.md                        # Project documentation
├── tailwind.config.ts               # Tailwind CSS configuration
├── tsconfig.json                    # TypeScript configuration
└── UPDATES.md                       # Update summary
```

## Key Directories

### `/app`
Next.js 15 App Router with route groups for organization:
- **(auth)**: Authentication pages (login, register)
- **(dashboard)**: Protected dashboard routes
- **(marketing)**: Public marketing pages

### `/components`
Reusable React components:
- **/ui**: Base UI components (Button, Card, etc.)

### `/lib`
Utility functions and helpers:
- **analytics.ts**: Event tracking
- **api.ts**: HTTP client
- **constants.ts**: App constants

### `/public`
Static assets served directly

## Route Structure

### Public Routes
```
/                    → Landing page
/pricing            → Pricing page
/login              → Login page
/register           → Registration page
```

### Protected Routes (Dashboard)
```
/dashboard          → Dashboard home
/habits             → Habit tracking
/goals              → Goal management
/finance            → Finance tracking
/analytics          → Analytics
/coach              → AI Coach (Premium)
/settings           → Settings
```

### API Routes
```
/api/health         → Health check
/api/webhook/*      → Webhook handlers
```

### Meta Routes
```
/sitemap.xml        → Sitemap
/robots.txt         → Robots
/manifest.json      → PWA Manifest
```

## File Naming Conventions

- **page.tsx**: Route pages
- **layout.tsx**: Route layouts
- **loading.tsx**: Loading states
- **error.tsx**: Error boundaries
- **route.ts**: API routes
- **Component.tsx**: React components (PascalCase)
- **utility.ts**: Utility functions (camelCase)

## CSS Architecture

### Global Styles
`app/globals.css` contains:
- CSS custom properties (variables)
- Dark mode support
- Global resets
- Utility classes

### Component Styles
Components use Tailwind utility classes with CSS variables:
```tsx
className="bg-[var(--primary)] text-white"
```

## TypeScript Configuration

- Strict mode enabled
- Path aliases configured:
  - `@/*` → Project root
  - `@eiko/shared-types` → Shared types package
  - `@eiko/shared-logic` → Shared logic package

## Build Output

```
.next/
├── static/              # Static assets with hashing
├── server/              # Server-side code
└── standalone/          # Standalone build for Docker
```

## Development Workflow

1. **Local Development**
   ```bash
   npm run dev
   ```

2. **Type Checking**
   ```bash
   npm run typecheck
   ```

3. **Linting**
   ```bash
   npm run lint
   npm run lint:fix
   ```

4. **Building**
   ```bash
   npm run build
   ```

5. **Production Server**
   ```bash
   npm start
   ```

## Environment Variables

See `.env.example` for required variables:
- `NEXT_PUBLIC_APP_URL`: Public app URL
- `NEXT_PUBLIC_API_URL`: API endpoint

## Docker Build

Multi-stage build process:
1. **deps**: Install dependencies
2. **builder**: Build application
3. **runner**: Production runtime

## CI/CD Pipeline

GitHub Actions workflow:
1. Lint and type check
2. Build application
3. Upload artifacts

## Documentation Files

- **README.md**: Getting started guide
- **DEPLOYMENT.md**: Deployment instructions
- **UPDATES.md**: Change summary
- **PROJECT_STRUCTURE.md**: This file

---

Last updated: 2026-02-09
