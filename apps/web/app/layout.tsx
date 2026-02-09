import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Eiko Habits - Track Habits, Finances & Goals',
  description: 'Build better habits, track your finances, and reach your goals with AI-powered coaching.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
