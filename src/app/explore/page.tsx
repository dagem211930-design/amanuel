"use client"

import { LayoutWrapper } from '@/components/layout-wrapper';
import { useLanguage } from '@/context/language-context';
import { useProject } from '@/context/project-context';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star } from 'lucide-react';

export default function ExplorePage() {
  const { t } = useLanguage();
  const { portfolio } = useProject();

  return (
    <LayoutWrapper>
      <section className="space-y-6">
        <div className="space-y-2">
          <h2 className="font-headline text-3xl font-bold">{t.luxuryPortfolio}</h2>
          <p className="text-muted-foreground text-sm">Exquisite craftsmanship across our finest works.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {portfolio.map((p) => (
            <Card key={p.id} className="overflow-hidden border-primary/10 bg-card/40 group animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="aspect-[4/3] relative">
                <Image 
                  src={p.imageUrl} 
                  alt={p.title} 
                  fill 
                  className="object-cover transition-transform group-hover:scale-105 duration-500" 
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                <div className="absolute top-2 right-2">
                  <Badge className="bg-primary text-background flex items-center gap-1 shadow-lg border-none font-bold">
                    <Star className="w-3 h-3 fill-current" />
                    {p.rating}
                  </Badge>
                </div>
              </div>
              <CardContent className="p-4">
                <h3 className="font-headline font-bold text-lg leading-tight mb-2 group-hover:text-primary transition-colors">{p.title}</h3>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center overflow-hidden">
                    <span className="text-[10px] font-bold text-primary">PF</span>
                  </div>
                  <span className="text-xs text-muted-foreground font-medium uppercase tracking-tighter">
                    {p.worker || "PrimeFinish Pro Team"}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {portfolio.length === 0 && (
          <div className="text-center py-20 text-muted-foreground italic">
            Check back later for new showcase projects.
          </div>
        )}
      </section>
    </LayoutWrapper>
  );
}
