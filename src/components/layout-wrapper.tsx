"use client"

import { Navigation } from './navigation';
import { useProject } from '@/context/project-context';

export function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const { isLoading } = useProject();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center">
      <Navigation />
      <main className="w-full max-w-lg pt-20 pb-20 px-4 flex flex-col gap-8">
        {children}
      </main>
    </div>
  );
}
