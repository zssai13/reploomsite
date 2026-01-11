// Shared layout wrapper for public sales pages
import type { ReactNode } from 'react';

interface PageLayoutProps {
  children: ReactNode;
}

export function PageLayout({ children }: PageLayoutProps) {
  return (
    <div className="min-h-screen bg-black">
      {children}
    </div>
  );
}
