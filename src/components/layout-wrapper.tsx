"use client"

import { Navigation } from './navigation';
import { useProject } from '@/context/project-context';

export function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const { isLoading } = useProject();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col md:flex-row overflow-x-hidden">
      <Navigation />
      <main className="flex-1 w-full max-w-5xl mx-auto pt-20 pb-28 md:pt-12 md:pb-12 px-4 md:px-12 flex flex-col gap-8">
        {children}
      </main>
    </div>
  );
}
