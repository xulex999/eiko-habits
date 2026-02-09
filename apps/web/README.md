# Eiko Habits Web App

The web application for Eiko Habits, built with Next.js 15 and Tailwind CSS v4.

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Animations**: Framer Motion
- **State Management**: Zustand
- **Data Fetching**: TanStack Query (React Query)
- **Charts**: Recharts

## Getting Started

### Prerequisites

- Node.js 18+ and npm/pnpm
- Access to the Eiko Habits API (running locally or deployed)

### Installation

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local

# Start development server
npm run dev
```

The app will be available at `http://localhost:3000`.

### Environment Variables

Create a `.env.local` file with the following variables:

```env
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:3001
```

## Project Structure

```
apps/web/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Authentication pages (login, register)
│   ├── (dashboard)/       # Dashboard routes (habits, goals, finance, etc.)
│   ├── (marketing)/       # Marketing pages (landing, pricing)
│   ├── api/               # API routes
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   ├── manifest.ts        # PWA manifest
│   ├── robots.ts          # Robots.txt
│   └── sitemap.ts         # Sitemap generation
├── components/            # Reusable components
│   └── ui/               # UI components (Button, Card, etc.)
├── lib/                   # Utility functions
├── next.config.ts         # Next.js configuration
├── postcss.config.mjs     # PostCSS configuration
└── tsconfig.json          # TypeScript configuration
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint errors
- `npm run typecheck` - Run TypeScript type checking
- `npm run format` - Format code with Prettier

## Features

### Marketing Site
- Landing page with feature showcase
- Pricing page with plan comparison
- Responsive navigation
- SEO optimization with metadata and structured data

### Authentication
- Login and registration pages
- OAuth integration (Google, Apple)
- Password strength indicator
- Form validation

### Dashboard
- Overview dashboard with habits, goals, and stats
- Habit tracking with streak visualization
- Financial goal management (savings, debt, budget)
- Goal tracking with progress indicators
- Analytics and insights
- AI Coach integration (Premium feature)
- Settings page

### Design System
- Custom CSS variables for theming
- Dark mode support
- Responsive design (mobile-first)
- Accessible components
- Smooth animations with Framer Motion

## SEO & Performance

- Server-side rendering (SSR) for marketing pages
- Static generation where applicable
- Automatic sitemap generation
- Robots.txt configuration
- Open Graph and Twitter Card meta tags
- PWA support with manifest
- Image optimization
- Code splitting and lazy loading

## Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Docker

```bash
# Build
docker build -t eiko-web .

# Run
docker run -p 3000:3000 eiko-web
```

## Contributing

Please ensure all code passes linting and type checking before submitting:

```bash
npm run typecheck
npm run lint
```

## License

Proprietary - Eiko Habits
