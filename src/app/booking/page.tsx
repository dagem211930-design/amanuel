"use client"

import { useState } from 'react';
import { LayoutWrapper } from '@/components/layout-wrapper';
import { useLanguage } from '@/context/language-context';
import { useProject } from '@/context/project-context';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Phone, CalendarCheck, ShieldCheck, CheckCircle2, Copy } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useFirestore } from '@/firebase';
import { collection } from 'firebase/firestore';
import { addDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function BookingPage() {
  const { t } = useLanguage();
  const { toast } = useToast();
  const { registerProject } = useProject();
  const firestore = useFirestore();
  
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [generatedId, setGeneratedId] = useState('');
  const [phone, setPhone] = useState('');
  const [service, setService] = useState<'wallChalk' | 'painting' | 'gypsum' | ''>('');
  const [name, setName] = useState('');

  const handleBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!service) return;

    let displayServiceName = '';
    if (service === 'wallChalk') displayServiceName = 'Wall Chalk';
    else if (service === 'painting') displayServiceName = 'Painting';
    else if (service === 'gypsum') displayServiceName = 'Gypsum Board';

    const projectName = `${displayServiceName} Project`;
    const newId = registerProject(projectName, name, service, 50); 
    
    if (firestore) {
      const consultationRef = collection(firestore, 'consultationRequests');
      addDocumentNonBlocking(consultationRef, {
        contactPhoneNumber: phone,
        preferredServiceId: service,
        requestDateTime: new Date().toISOString(),
        status: 'New',
        clientName: name,
        id: newId
      });
    }

    setGeneratedId(newId);
    setIsSuccessOpen(true);
    
    setName('');
    setPhone('');
    setService('');
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedId);
    toast({
      title: "Copied!",
      description: "Project ID copied to clipboard.",
    });
  };

  return (
    <LayoutWrapper>
      <>
        <section className="space-y-6">
          <div className="space-y-2">
            <h2 className="font-headline text-3xl font-bold">{t.booking}</h2>
            <p className="text-muted-foreground text-sm">Schedule a private consultation and get your unique tracking ID.</p>
          </div>

          <Card className="border-primary/20 bg-card/50">
            <CardContent className="pt-8 pb-8 space-y-6">
              <form onSubmit={handleBooking} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input 
                    id="name" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name" 
                    className="bg-background border-primary/20 h-12"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone" className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-primary" />
                    {t.contactPhone}
                  </Label>
                  <Input 
                    id="phone" 
                    type="tel" 
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+251 ..." 
                    className="bg-background border-primary/20 h-12"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="service" className="flex items-center gap-2">
                    <CalendarCheck className="w-4 h-4 text-primary" />
                    {t.preferredService}
                  </Label>
                  <Select value={service} onValueChange={(val: any) => setService(val)} required>
                    <SelectTrigger className="bg-background border-primary/20 h-12">
                      <SelectValue placeholder="Choose a service" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="wallChalk">{t.wallChalk}</SelectItem>
                      <SelectItem value="painting">{t.painting}</SelectItem>
                      <SelectItem value="gypsum">{t.gypsum}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button 
                  type="submit" 
                  className="w-full h-14 bg-primary text-background font-bold text-lg rounded-xl hover:bg-primary/90 transition-transform active:scale-95 shadow-[0_10px_30px_-10px_rgba(245,192,26,0.5)]"
                >
                  {t.bookConsultation}
                </Button>
              </form>
            </CardContent>
          </Card>

          <div className="space-y-4 pt-4">
            <div className="flex gap-4 items-start p-4 rounded-xl bg-muted/30">
              <ShieldCheck className="w-6 h-6 text-primary shrink-0" />
              <div>
                <h4 className="font-bold text-sm">Quality Guaranteed</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">Every PrimeFinish Pro project comes with a 5-year structural warranty and our signature satisfaction guarantee.</p>
              </div>
            </div>
          </div>
        </section>

        <Dialog open={isSuccessOpen} onOpenChange={setIsSuccessOpen}>
          <DialogContent className="bg-card border-primary/20 text-foreground sm:max-w-md rounded-2xl p-0 overflow-hidden shadow-2xl">
            <div className="bg-primary p-6 flex flex-col items-center text-background">
              <div className="w-16 h-16 rounded-full bg-background/20 flex items-center justify-center mb-4">
                <CheckCircle2 className="w-10 h-10 text-background" />
              </div>
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold text-center">{t.bookingSuccess}</DialogTitle>
              </DialogHeader>
            </div>
            <div className="p-8 space-y-6">
              <div className="text-center space-y-2">
                <p className="text-sm font-medium text-muted-foreground">{t.yourIdIs}</p>
                <div 
                  onClick={copyToClipboard}
                  className="mx-auto w-fit flex items-center gap-3 px-6 py-4 rounded-xl bg-primary/5 border-2 border-primary/20 cursor-pointer hover:border-primary/40 transition-all group"
                >
                  <span className="text-3xl font-bold tracking-widest font-mono text-primary">{generatedId}</span>
                  <Copy className="w-5 h-5 text-primary opacity-50 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>
              
              <div className="p-4 rounded-xl bg-primary/5 border border-primary/20 flex gap-3 items-start shadow-[0_0_20px_rgba(245,192,26,0.1)]">
                <div className="space-y-2">
                  <p className="text-xs font-bold text-[#FFD700] leading-relaxed uppercase tracking-tight drop-shadow-[0_0_8px_rgba(255,215,0,0.4)]">
                    {t.idWarningEn}
                  </p>
                  <p className="text-xs font-bold text-[#FFD700] leading-relaxed drop-shadow-[0_0_8px_rgba(255,215,0,0.4)]">
                    {t.idWarningAm}
                  </p>
                </div>
              </div>

              <Button 
                onClick={() => setIsSuccessOpen(false)} 
                className="w-full h-14 bg-primary text-background font-bold text-base shadow-lg hover:bg-primary/90"
              >
                {t.savedIdButton}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </>
    </LayoutWrapper>
  );
}
