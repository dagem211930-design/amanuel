"use client"

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/context/language-context';
import { useProject } from '@/context/project-context';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ShieldCheck, LogIn } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function LoginPage() {
  const { t } = useLanguage();
  const { login } = useProject();
  const [projectId, setProjectId] = useState('');
  const router = useRouter();
  const { toast } = useToast();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (login(projectId)) {
      router.push('/');
    } else {
      toast({
        variant: "destructive",
        title: "Access Denied",
        description: t.invalidId,
      });
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-sm border-primary/20 bg-card/50 shadow-2xl">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-12 h-12 rounded-full bg-primary flex items-center justify-center">
            <span className="text-background font-bold text-xl">P</span>
          </div>
          <CardTitle className="font-headline text-2xl text-primary">PrimeFinish Pro</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-lg font-bold">{t.enterProjectId}</h2>
            <p className="text-xs text-muted-foreground">Secure access to your project status and estimates.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="relative">
              <Input
                type="text"
                placeholder={t.projectIdPlaceholder}
                value={projectId}
                onChange={(e) => setProjectId(e.target.value)}
                className="bg-background border-primary/20 h-12 text-center text-lg tracking-widest font-bold focus:border-primary uppercase"
                required
              />
            </div>
            <Button 
              type="submit" 
              className="w-full h-12 bg-primary text-background font-bold hover:bg-primary/90 transition-all active:scale-95"
            >
              <LogIn className="w-4 h-4 mr-2" />
              {t.login}
            </Button>
          </form>

          <div className="flex items-center gap-2 justify-center text-[10px] text-muted-foreground uppercase tracking-widest pt-4 border-t border-primary/10">
            <ShieldCheck className="w-3 h-3 text-primary" />
            Encrypted Client Portal
          </div>
        </CardContent>
      </Card>
    </div>
  );
}