"use client"

import { useState, useEffect } from 'react';
import { LayoutWrapper } from '@/components/layout-wrapper';
import { useLanguage } from '@/context/language-context';
import { useProject } from '@/context/project-context';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calculator, User } from 'lucide-react';

export default function Dashboard() {
  const { t } = useLanguage();
  const { activeProject } = useProject();
  
  const [area, setArea] = useState<string>(activeProject?.area.toString() || '');
  const [service, setService] = useState<string>(activeProject?.type || 'wallChalk');
  const [supplyType, setSupplyType] = useState<string>('full');

  useEffect(() => {
    if (activeProject) {
      setArea(activeProject.area.toString());
      setService(activeProject.type);
    }
  }, [activeProject]);

  const getRates = () => {
    switch (service) {
      case 'wallChalk': return 150;
      case 'painting': return 800;
      case 'gypsum': return 1500;
      default: return 1000;
    }
  };

  const calculateTotal = () => {
    const baseRate = getRates();
    const areaNum = parseFloat(area) || 0;
    const supplyMultiplier = supplyType === 'full' ? 1 : 0.4;
    return areaNum * baseRate * supplyMultiplier;
  };

  const total = calculateTotal();
  const labor = total * 0.4;
  const material = total * 0.6;

  return (
    <LayoutWrapper>
      <section className="space-y-6">
        <div className="flex justify-between items-end">
          <div className="space-y-2">
            <h2 className="font-headline text-3xl font-bold">{t.dashboard}</h2>
            <p className="text-muted-foreground text-sm">Professional estimation for your luxury project.</p>
          </div>
          {activeProject && (
            <div className="flex items-center gap-2 bg-primary/10 px-3 py-1.5 rounded-full border border-primary/20">
              <User className="w-3 h-3 text-primary" />
              <span className="text-[10px] font-bold text-primary uppercase tracking-tighter">
                {activeProject.clientName}
              </span>
            </div>
          )}
        </div>

        {activeProject && (
          <div className="p-4 rounded-xl bg-muted/30 border border-primary/10">
            <h3 className="text-xs font-bold uppercase tracking-widest text-primary mb-1">Active Project</h3>
            <p className="text-lg font-headline font-bold">{activeProject.name}</p>
          </div>
        )}

        <Card className="border-primary/20 bg-card/50">
          <CardContent className="pt-6 space-y-6">
            <div className="space-y-2">
              <Label htmlFor="area">{t.projectArea}</Label>
              <Input 
                id="area" 
                type="number" 
                placeholder="0.00" 
                value={area} 
                onChange={(e) => setArea(e.target.value)}
                className="bg-background border-primary/20 focus:border-primary"
              />
            </div>

            <div className="space-y-2">
              <Label>{t.serviceSelection}</Label>
              <Select value={service} onValueChange={setService}>
                <SelectTrigger className="bg-background border-primary/20">
                  <SelectValue placeholder="Select service" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="wallChalk">{t.wallChalk}</SelectItem>
                  <SelectItem value="painting">{t.painting}</SelectItem>
                  <SelectItem value="gypsum">{t.gypsum}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-4">
              <Label>{t.supplyType}</Label>
              <RadioGroup value={supplyType} onValueChange={setSupplyType} className="flex gap-4">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="full" id="full" />
                  <Label htmlFor="full" className="cursor-pointer">{t.fullSupply}</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="labor" id="labor" />
                  <Label htmlFor="labor" className="cursor-pointer">{t.laborOnly}</Label>
                </div>
              </RadioGroup>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-primary text-background border-none shadow-[0_10px_40px_-10px_rgba(245,192,26,0.3)]">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm uppercase tracking-widest flex items-center gap-2">
              <Calculator className="w-4 h-4" />
              {t.estimatorResults}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center py-4">
              <p className="text-xs opacity-70 mb-1">{t.estimatedTotal}</p>
              <p className="text-4xl font-bold font-headline">
                {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'ETB' }).format(total)}
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-background/20">
              <div className="text-center">
                <p className="text-[10px] uppercase tracking-tighter opacity-70">{t.labor}</p>
                <p className="font-bold">{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'ETB' }).format(labor)}</p>
              </div>
              <div className="text-center border-l border-background/20">
                <p className="text-[10px] uppercase tracking-tighter opacity-70">{t.material}</p>
                <p className="font-bold">{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'ETB' }).format(material)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>
    </LayoutWrapper>
  );
}
