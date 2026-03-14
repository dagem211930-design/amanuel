"use client"

import { useState } from 'react';
import { clientProjectMilestoneExplanation } from '@/ai/flows/client-project-milestone-explanation';
import { Button } from '@/components/ui/button';
import { Sparkles, Loader2 } from 'lucide-react';
import { useLanguage } from '@/context/language-context';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export function MilestoneExplanation({ milestoneName }: { milestoneName: string }) {
  const { t, language } = useLanguage();
  const [explanation, setExplanation] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchExplanation = async () => {
    setLoading(true);
    try {
      const result = await clientProjectMilestoneExplanation({ 
        milestoneName, 
        language: language as 'en' | 'am'
      });
      setExplanation(result.explanation);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={fetchExplanation}
          className="text-xs text-primary p-0 h-auto hover:bg-transparent hover:underline flex items-center gap-1.5"
        >
          <Sparkles className="w-3.5 h-3.5" />
          {t.aiMilestoneHint}
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-card border-primary/20 text-foreground max-w-[90vw] sm:max-w-md rounded-xl shadow-2xl">
        <DialogHeader>
          <DialogTitle className="font-headline text-2xl text-primary border-b border-primary/10 pb-2">
            {milestoneName}
          </DialogTitle>
        </DialogHeader>
        <div className="py-6">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-10 gap-4">
              <Loader2 className="w-10 h-10 text-primary animate-spin" />
              <p className="text-sm font-medium text-muted-foreground animate-pulse">{t.aiLoading}</p>
            </div>
          ) : (
            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
              <p className="text-sm leading-relaxed text-foreground/90 first-letter:text-primary first-letter:text-lg first-letter:font-bold">
                {explanation || "Failed to load explanation."}
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
