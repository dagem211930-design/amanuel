"use client"

import { useState, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Home, ClipboardList, Grid, CalendarDays, LogOut, ShieldAlert, Languages } from 'lucide-react';
import { useLanguage } from '@/context/language-context';
import { useProject } from '@/context/project-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

export function Navigation() {
  const { language, setLanguage, t } = useLanguage();
  const { logout } = useProject();
  const pathname = usePathname();
  const router = useRouter();
  const { toast } = useToast();

  const [isAdminDialogOpen, setIsAdminDialogOpen] = useState(false);
  const [adminPin, setAdminPin] = useState('');
  const longPressTimer = useRef<NodeJS.Timeout | null>(null);

  if (pathname === '/login') return null;

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const handlePointerDown = () => {
    longPressTimer.current = setTimeout(() => {
      setIsAdminDialogOpen(true);
    }, 3000);
  };

  const handlePointerUp = () => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
    }
  };

  const handleAdminAuth = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminPin === '2026') {
      setIsAdminDialogOpen(false);
      setAdminPin('');
      router.push('/admin');
    } else {
      toast({
        variant: "destructive",
        title: "Access Denied",
        description: "Wrong Access Code. Returning to home.",
      });
      setIsAdminDialogOpen(false);
      setAdminPin('');
      router.push('/');
    }
  };

  const navItems = [
    { href: '/', icon: Home, label: t.dashboard },
    { href: '/status', icon: ClipboardList, label: t.status },
    { href: '/explore', icon: Grid, label: t.explore },
    { href: '/booking', icon: CalendarDays, label: t.booking },
  ];

  const Logo = () => (
    <div 
      className="flex items-center gap-3 cursor-default select-none active:scale-95 transition-transform"
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
    >
      <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
        <span className="text-background font-bold text-xl">P</span>
      </div>
      <div className="flex flex-col">
        <h1 className="font-headline text-lg font-bold tracking-tight text-primary leading-none">PrimeFinish</h1>
        <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-bold">Pro Edition</span>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Top Header */}
      <header className="fixed top-0 left-0 right-0 h-16 bg-background/80 backdrop-blur-md border-b z-50 px-4 flex items-center justify-between md:hidden">
        <Logo />
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setLanguage(language === 'en' ? 'am' : 'en')}
            className="text-primary hover:bg-primary/10 rounded-full h-9 w-9"
          >
            <Languages className="w-5 h-5" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={handleLogout}
            className="text-muted-foreground hover:text-destructive h-9 w-9"
          >
            <LogOut className="w-5 h-5" />
          </Button>
        </div>
      </header>

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-72 h-screen sticky top-0 border-r bg-card/30 backdrop-blur-xl z-50 p-8 shrink-0">
        <div className="mb-12">
          <Logo />
        </div>
        
        <nav className="flex-1 space-y-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link key={item.href} href={item.href}>
                <div className={cn(
                  "flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 group",
                  isActive 
                    ? "bg-primary text-background shadow-lg shadow-primary/20" 
                    : "text-muted-foreground hover:bg-primary/10 hover:text-primary"
                )}>
                  <item.icon className={cn("w-5 h-5", !isActive && "group-hover:scale-110 transition-transform")} />
                  <span className="text-sm font-bold uppercase tracking-wider">{item.label}</span>
                </div>
              </Link>
            );
          })}
        </nav>

        <div className="pt-8 border-t border-primary/10 space-y-4">
          <Button 
            variant="outline" 
            className="w-full justify-start gap-4 h-12 rounded-xl border-primary/20 hover:border-primary/40 hover:bg-primary/5 transition-all"
            onClick={() => setLanguage(language === 'en' ? 'am' : 'en')}
          >
            <Languages className="w-5 h-5 text-primary" />
            <span className="text-xs font-bold uppercase tracking-widest">
              {language === 'en' ? 'Switch to Amharic' : 'ወደ እንግሊዝኛ ቀይር'}
            </span>
          </Button>
          
          <Button 
            variant="ghost" 
            className="w-full justify-start gap-4 h-12 rounded-xl text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all"
            onClick={handleLogout}
          >
            <LogOut className="w-5 h-5" />
            <span className="text-xs font-bold uppercase tracking-widest">{t.logout}</span>
          </Button>
        </div>
      </aside>

      {/* Mobile Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-background/90 backdrop-blur-xl border-t h-20 z-50 flex items-center justify-around px-2 pb-safe-area-inset-bottom md:hidden">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link key={item.href} href={item.href} className="flex-1">
              <div className={cn(
                "flex flex-col items-center justify-center gap-1.5 transition-all duration-300",
                isActive ? "text-primary scale-110" : "text-muted-foreground hover:text-primary/70"
              )}>
                <div className={cn(
                  "p-2 rounded-xl transition-colors",
                  isActive ? "bg-primary/10" : "bg-transparent"
                )}>
                  <item.icon className={cn("w-5 h-5", isActive && "fill-current")} />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider">{item.label}</span>
              </div>
            </Link>
          );
        })}
      </nav>

      {/* Admin Access Dialog */}
      <Dialog open={isAdminDialogOpen} onOpenChange={setIsAdminDialogOpen}>
        <DialogContent className="bg-card border-primary/20 text-foreground sm:max-w-sm rounded-2xl shadow-2xl">
          <DialogHeader className="items-center text-center">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <ShieldAlert className="w-8 h-8 text-primary" />
            </div>
            <DialogTitle className="font-headline text-3xl text-primary">Restricted Access</DialogTitle>
            <DialogDescription className="text-muted-foreground text-sm mt-2">
              Please enter the administrative access code.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAdminAuth} className="space-y-6 pt-6">
            <div className="relative">
              <Input
                type="password"
                placeholder="••••"
                value={adminPin}
                onChange={(e) => setAdminPin(e.target.value)}
                className="text-center text-3xl tracking-[0.8em] font-bold h-16 bg-background/50 border-primary/20 focus:border-primary rounded-xl"
                maxLength={4}
                required
                autoFocus
              />
            </div>
            <Button type="submit" className="w-full h-14 bg-primary text-background font-bold text-lg rounded-xl shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all">
              Unlock Terminal
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
