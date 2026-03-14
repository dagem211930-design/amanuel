"use client"

import { useState, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Home, ClipboardList, Grid, CalendarDays, LogOut, ShieldAlert } from 'lucide-react';
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
    // RESTORED: Admin Panel trigger (3-second long press on the logo)
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
    // VERIFIED: Admin PIN is 2026
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

  return (
    <>
      <header className="fixed top-0 left-0 right-0 h-16 bg-background/80 backdrop-blur-md border-b z-50 px-4 flex items-center justify-between">
        <div 
          className="flex items-center gap-2 cursor-default select-none active:scale-95 transition-transform"
          onPointerDown={handlePointerDown}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerUp}
        >
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
            <span className="text-background font-bold">P</span>
          </div>
          <h1 className="font-headline text-xl font-bold tracking-tight text-primary">PrimeFinish Pro</h1>
        </div>
        
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setLanguage(language === 'en' ? 'am' : 'en')}
            className="border-primary/60 text-primary hover:bg-primary hover:text-background transition-all font-bold px-3 py-1 h-8 min-w-[3.5rem] rounded-full text-xs"
          >
            {language === 'en' ? 'EN' : 'አማ'}
          </Button>
          
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={handleLogout}
            className="text-muted-foreground hover:text-destructive h-8 w-8"
          >
            <LogOut className="w-4 h-4" />
          </Button>
        </div>
      </header>

      <nav className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-md border-t h-16 z-50 flex items-center justify-around px-2 pb-safe-area-inset-bottom">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link key={item.href} href={item.href} className="flex-1">
              <div className={cn(
                "flex flex-col items-center justify-center gap-1 transition-colors",
                isActive ? "text-primary" : "text-muted-foreground hover:text-primary"
              )}>
                <item.icon className={cn("w-5 h-5", isActive && "fill-current")} />
                <span className="text-[10px] font-medium uppercase tracking-wider">{item.label}</span>
              </div>
            </Link>
          );
        })}
      </nav>

      <Dialog open={isAdminDialogOpen} onOpenChange={setIsAdminDialogOpen}>
        <DialogContent className="bg-card border-primary/20 text-foreground sm:max-w-sm rounded-xl">
          <DialogHeader className="items-center text-center">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <ShieldAlert className="w-6 h-6 text-primary" />
            </div>
            <DialogTitle className="font-headline text-2xl text-primary">Restricted Access</DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Please enter the 4-digit administrative PIN.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAdminAuth} className="space-y-4 pt-4">
            <Input
              type="password"
              placeholder="••••"
              value={adminPin}
              onChange={(e) => setAdminPin(e.target.value)}
              className="text-center text-2xl tracking-[1em] font-bold h-14 bg-background border-primary/20 focus:border-primary"
              maxLength={4}
              required
              autoFocus
            />
            <Button type="submit" className="w-full h-12 bg-primary text-background font-bold">
              Unlock Terminal
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}