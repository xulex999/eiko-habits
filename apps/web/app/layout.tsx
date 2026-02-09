import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://eikohabits.com'),
  title: {
    default: 'Eiko Habits - Track Habits, Finances & Goals',
    template: '%s | Eiko Habits',
  },
  description: 'Build better habits, track your finances, and reach your goals with AI-powered coaching. One app for your entire self-improvement journey.',
  keywords: ['habit tracking', 'finance tracking', 'goal setting', 'AI coach', 'productivity', 'self-improvement'],
  authors: [{ name: 'Eiko Habits' }],
  creator: 'Eiko Habits',
  publisher: 'Eiko Habits',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: '/',
    title: 'Eiko Habits - Track Habits, Finances & Goals',
    description: 'Build better habits, track your finances, and reach your goals with AI-powered coaching.',
    siteName: 'Eiko Habits',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Eiko Habits - Track Habits, Finances & Goals',
    description: 'Build better habits, track your finances, and reach your goals with AI-powered coaching.',
    creator: '@eikohabits',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#4F46E5' },
    { media: '(prefers-color-scheme: dark)', color: '#4F46E5' },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased min-h-screen">{children}</body>
    </html>
  );
}
