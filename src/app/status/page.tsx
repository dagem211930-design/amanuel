"use client"

import { useState } from 'react';
import { LayoutWrapper } from '@/components/layout-wrapper';
import { useLanguage } from '@/context/language-context';
import { useProject } from '@/context/project-context';
import { MilestoneExplanation } from '@/components/milestone-explanation';
import { CheckCircle2, Clock, Circle, ArrowRight, Play, Video, LogIn, ShieldCheck } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';

export default function StatusPage() {
  const { t } = useLanguage();
  const { activeProject, login } = useProject();
  const { toast } = useToast();
  const [projectIdInput, setProjectIdInput] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (login(projectIdInput)) {
      setProjectIdInput('');
    } else {
      toast({
        variant: "destructive",
        title: "Access Denied",
        description: t.invalidId,
      });
    }
  };

  if (!activeProject) {
    return (
      <LayoutWrapper>
        <>
          <section className="space-y-6 flex flex-col items-center justify-center min-h-[60vh]">
            <Card className="w-full max-w-sm border-primary/20 bg-card/50 shadow-2xl">
              <CardHeader className="text-center space-y-4">
                <div className="mx-auto w-12 h-12 rounded-full bg-primary flex items-center justify-center">
                  <LogIn className="text-background w-6 h-6" />
                </div>
                <CardTitle className="font-headline text-2xl text-primary">{t.enterProjectId}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="text-center space-y-2">
                  <p className="text-xs text-muted-foreground">Secure access to your personal project status and updates.</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="relative">
                    <Input
                      type="text"
                      placeholder={t.projectIdPlaceholder}
                      value={projectIdInput}
                      onChange={(e) => setProjectIdInput(e.target.value)}
                      className="bg-background border-primary/20 h-12 text-center text-lg tracking-widest font-bold focus:border-primary uppercase"
                      required
                    />
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full h-12 bg-primary text-background font-bold hover:bg-primary/90 transition-all active:scale-95"
                  >
                    {t.login}
                  </Button>
                </form>

                <div className="flex items-center gap-2 justify-center text-[10px] text-muted-foreground uppercase tracking-widest pt-4 border-t border-primary/10">
                  <ShieldCheck className="w-3 h-3 text-primary" />
                  Encrypted Client Portal
                </div>
              </CardContent>
            </Card>
          </section>
        </>
      </LayoutWrapper>
    );
  }

  // Derived data based on activeProject
  const milestones = activeProject.milestones?.map(m => ({
    ...m,
    displayName: t[m.nameKey as keyof typeof t] || m.nameKey
  })) || [];

  const calculateProgress = () => {
    if (milestones.length === 0) return 0;
    const stage4 = milestones.find(m => m.nameKey === 'stage4');
    const stage3 = milestones.find(m => m.nameKey === 'stage3');
    const stage2 = milestones.find(m => m.nameKey === 'stage2');
    const stage1 = milestones.find(m => m.nameKey === 'stage1');

    if (stage4?.status === 'completed') return 100;
    if (stage3?.status === 'completed') return 80;
    if (stage2?.status === 'completed') return 50;
    if (stage1?.status === 'completed') return 10;
    return 0;
  };

  const progressPercentage = calculateProgress();
  const currentTask = milestones.find(m => m.status === 'in-progress');

  const handleNoVideo = () => {
    toast({
      title: t.noVideoUploaded,
      description: "Please check back later for live updates.",
    });
  };

  return (
    <LayoutWrapper>
      <>
        <section className="space-y-8 w-full max-w-md mx-auto">
          <div className="space-y-4 text-center">
            <div className="space-y-1">
              <h2 className="font-headline text-4xl font-bold">
                {t.liveProgress}
              </h2>
              <p className="text-muted-foreground text-sm">
                Real-time updates for your active luxury project: <span className="font-bold text-primary">{activeProject.name}</span>
              </p>
            </div>

            <Card className="bg-primary/10 border-primary/20 p-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-[10px] font-bold uppercase tracking-widest text-primary">{t.projectCompletion}</span>
                <span className="text-lg font-bold text-primary">{progressPercentage}%</span>
              </div>
              <Progress value={progressPercentage} className="h-2 bg-primary/20" />
            </Card>
          </div>

          <Card className="border-primary/20 bg-card/50 overflow-hidden shadow-2xl relative">
            <CardContent className="pt-10 px-8 pb-10">
              <div className="relative">
                {milestones.map((m, idx) => (
                  <div 
                    key={idx} 
                    className={cn(
                      "relative flex gap-6 pb-12 last:pb-0"
                    )}
                  >
                    {idx !== milestones.length - 1 && (
                      <div 
                        className={cn(
                          "absolute left-[15px] top-10 bottom-0 w-0.5 z-0 origin-top",
                          m.status === 'completed' ? "bg-primary" : "bg-muted-foreground/20"
                        )} 
                      />
                    )}
                    
                    <div className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center shrink-0 border-2 z-10 transition-all duration-700",
                      m.status === 'completed' ? "bg-primary border-primary scale-110 shadow-[0_0_15px_rgba(245,192,26,0.2)]" : 
                      m.status === 'in-progress' ? "bg-background border-primary animate-pulse shadow-[0_0_25px_rgba(245,192,26,0.6)]" : 
                      "bg-background border-muted"
                    )}
                    >
                      {m.status === 'completed' && <CheckCircle2 className="w-5 h-5 text-background" />}
                      {m.status === 'in-progress' && <Clock className="w-4 h-4 text-primary" />}
                      {m.status === 'pending' && <Circle className="w-4 h-4 text-muted" />}
                    </div>

                    <div className="flex-1 pt-0.5 space-y-3">
                      <div className="flex items-center justify-between gap-3">
                        <h3 className={cn(
                          "font-bold text-base",
                          m.status === 'completed' ? "text-foreground" : 
                          m.status === 'in-progress' ? "text-primary" : 
                          "text-muted-foreground"
                        )}>
                          {m.displayName}
                        </h3>
                        <span className={cn(
                          "text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full shrink-0 border",
                          m.status === 'completed' ? "bg-primary/10 text-primary border-primary/20" : 
                          m.status === 'in-progress' ? "bg-primary text-background border-primary" : 
                          "bg-muted/20 text-muted-foreground border-transparent"
                        )}>
                          {m.status === 'completed' ? t.completed : m.status === 'in-progress' ? t.inProgress : t.pending}
                        </span>
                      </div>
                      
                      <div className="space-y-2">
                        <p className="text-xs font-medium text-muted-foreground/80">{m.date}</p>
                        
                        <div className="flex flex-wrap items-center gap-4">
                          <MilestoneExplanation milestoneName={m.displayName} />
                          
                          {(m.status === 'in-progress' || m.status === 'completed') && (
                            m.videoUrl ? (
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button variant="ghost" size="sm" className="h-auto p-0 text-xs text-primary hover:bg-transparent hover:underline flex items-center gap-1.5">
                                    <Play className="w-3.5 h-3.5 fill-current" />
                                    {t.watchLiveVideo}
                                  </Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-3xl border-primary/20 bg-card p-0 overflow-hidden">
                                  <DialogHeader className="p-4 border-b border-primary/10">
                                    <DialogTitle className="font-headline text-xl text-primary flex items-center gap-2">
                                      <Video className="w-5 h-5" />
                                      {m.displayName} - {t.liveProgress}
                                    </DialogTitle>
                                  </DialogHeader>
                                  <div className="relative aspect-video w-full bg-black">
                                    <video 
                                      src={m.videoUrl} 
                                      controls 
                                      autoPlay 
                                      className="w-full h-full object-contain"
                                    />
                                  </div>
                                </DialogContent>
                              </Dialog>
                            ) : (
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={handleNoVideo}
                                className="h-auto p-0 text-xs text-muted-foreground hover:bg-transparent hover:underline flex items-center gap-1.5"
                              >
                                <Play className="w-3.5 h-3.5" />
                                {t.watchLiveVideo}
                              </Button>
                            )
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {currentTask && (
            <div className="p-5 rounded-2xl bg-primary/5 border border-primary/10 text-foreground text-sm flex items-center justify-between gap-4">
              <p className="leading-relaxed">
                <span className="font-bold text-primary">{currentTask.displayName}</span> is currently being handled by our elite finishers.
              </p>
              <div className="p-2 rounded-full bg-primary/10 text-primary">
                <ArrowRight className="w-5 h-5" />
              </div>
            </div>
          )}

          <div className="text-center pt-4">
            <Button variant="outline" size="sm" onClick={() => window.location.reload()} className="text-xs border-primary/20 hover:bg-primary/10">
              {t.logout}
            </Button>
          </div>
        </section>
      </>
    </LayoutWrapper>
  );
}