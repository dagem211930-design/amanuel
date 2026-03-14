"use client"

import { useState } from 'react';
import { useProject } from '@/context/project-context';
import { LayoutWrapper } from '@/components/layout-wrapper';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MilestoneStatus, PortfolioItem } from '@/lib/projects';
import { Badge } from '@/components/ui/badge';
import { Settings, User, Camera, Video, ArrowLeft, Search, ChevronRight, Trash2, Plus, Grid, Edit2, Star } from 'lucide-react';
import { useLanguage } from '@/context/language-context';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

type AdminTab = 'customers' | 'portfolio';

export default function AdminPage() {
  const { 
    allProjects, 
    portfolio, 
    updateMilestone, 
    updateMilestoneImage, 
    updateMilestoneVideo, 
    deleteProject,
    addPortfolioItem,
    updatePortfolioItem,
    deletePortfolioItem
  } = useProject();
  const { t, language } = useLanguage();
  const { toast } = useToast();
  
  const [activeTab, setActiveTab] = useState<AdminTab>('customers');
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [projectToDelete, setProjectToDelete] = useState<string | null>(null);

  // Portfolio State
  const [isPortfolioDialogOpen, setIsPortfolioDialogOpen] = useState(false);
  const [editingPortfolioItem, setEditingPortfolioItem] = useState<PortfolioItem | null>(null);
  const [portfolioTitle, setPortfolioTitle] = useState('');
  const [portfolioImageUrl, setPortfolioImageUrl] = useState('');
  const [portfolioRating, setPortfolioRating] = useState('5.0');
  const [portfolioToDelete, setPortfolioToDelete] = useState<string | null>(null);

  const projects = Object.values(allProjects);
  const filteredProjects = projects.filter(p => 
    p.clientName.toLowerCase().includes(searchQuery.toLowerCase()) || 
    p.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedProject = selectedProjectId ? allProjects[selectedProjectId] : null;

  const handleDeleteProject = () => {
    if (projectToDelete) {
      deleteProject(projectToDelete);
      toast({
        title: "Success",
        description: t.deleteSuccess,
      });
      setProjectToDelete(null);
      if (selectedProjectId === projectToDelete) {
        setSelectedProjectId(null);
      }
    }
  };

  const handleSavePortfolio = () => {
    const rating = parseFloat(portfolioRating) || 5.0;
    if (editingPortfolioItem) {
      updatePortfolioItem(editingPortfolioItem.id, portfolioTitle, portfolioImageUrl, rating);
    } else {
      addPortfolioItem(portfolioTitle, portfolioImageUrl, rating);
      toast({
        title: "Success",
        description: t.portfolioAdded,
      });
    }
    setIsPortfolioDialogOpen(false);
    resetPortfolioForm();
  };

  const resetPortfolioForm = () => {
    setEditingPortfolioItem(null);
    setPortfolioTitle('');
    setPortfolioImageUrl('');
    setPortfolioRating('5.0');
  };

  const openEditPortfolio = (item: PortfolioItem) => {
    setEditingPortfolioItem(item);
    setPortfolioTitle(item.title);
    setPortfolioImageUrl(item.imageUrl);
    setPortfolioRating(item.rating.toString());
    setIsPortfolioDialogOpen(true);
  };

  const handleDeletePortfolio = () => {
    if (portfolioToDelete) {
      deletePortfolioItem(portfolioToDelete);
      toast({
        title: "Success",
        description: t.portfolioDeleted,
      });
      setPortfolioToDelete(null);
    }
  };

  if (selectedProject) {
    return (
      <LayoutWrapper>
        <section className="space-y-6">
          <Button 
            variant="ghost" 
            onClick={() => setSelectedProjectId(null)}
            className="flex items-center gap-2 text-primary hover:text-primary/80 p-0"
          >
            <ArrowLeft className="w-4 h-4" />
            {t.backToList}
          </Button>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <User className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h2 className="font-headline text-3xl font-bold">{t.manageCustomer}</h2>
                <p className="text-muted-foreground text-sm">{selectedProject.clientName} ({selectedProject.id})</p>
              </div>
            </div>
            <Button
              variant="destructive"
              size="icon"
              onClick={() => setProjectToDelete(selectedProject.id)}
              className="rounded-full shadow-lg"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>

          <Card className="border-primary/20 bg-card/50 overflow-hidden shadow-lg">
            <CardHeader className="bg-primary/5 pb-4 border-b border-primary/10">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="font-headline text-xl text-primary">{selectedProject.name}</CardTitle>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="outline" className="border-primary/30 text-primary uppercase text-[10px]">
                      ID: {selectedProject.id}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              {selectedProject.milestones.map((milestone) => (
                <div key={milestone.id} className="space-y-3 p-4 rounded-xl bg-muted/20 border border-primary/5">
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-sm font-bold text-primary uppercase tracking-tight">{t[milestone.nameKey]}</span>
                    <Select 
                      value={milestone.status} 
                      onValueChange={(val) => updateMilestone(selectedProject.id, milestone.id, val as MilestoneStatus)}
                    >
                      <SelectTrigger className="w-36 h-9 bg-background border-primary/10 text-xs font-bold uppercase">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending" className="text-xs font-bold uppercase">Pending</SelectItem>
                        <SelectItem value="in-progress" className="text-xs font-bold uppercase">In-Progress</SelectItem>
                        <SelectItem value="completed" className="text-xs font-bold uppercase">Completed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-1 gap-3 pt-2 border-t border-primary/5">
                    <div className="space-y-1.5">
                      <Label className="text-[10px] uppercase font-bold text-muted-foreground flex items-center gap-1.5">
                        <Camera className="w-3 h-3" />
                        {t.imageUrl}
                      </Label>
                      <Input 
                        placeholder="https://..." 
                        value={milestone.imageUrl || ''} 
                        onChange={(e) => updateMilestoneImage(selectedProject.id, milestone.id, e.target.value)}
                        className="h-8 text-xs bg-background border-primary/10 focus:border-primary/40"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-[10px] uppercase font-bold text-muted-foreground flex items-center gap-1.5">
                        <Video className="w-3 h-3" />
                        {t.videoUrl}
                      </Label>
                      <Input 
                        placeholder="https://...mp4" 
                        value={milestone.videoUrl || ''} 
                        onChange={(e) => updateMilestoneVideo(selectedProject.id, milestone.id, e.target.value)}
                        className="h-8 text-xs bg-background border-primary/10 focus:border-primary/40"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </section>

        <AlertDialog open={!!projectToDelete} onOpenChange={(open) => !open && setProjectToDelete(null)}>
          <AlertDialogContent className="bg-card border-primary/20 text-foreground">
            <AlertDialogHeader>
              <AlertDialogTitle>{t.confirmDeleteTitle}</AlertDialogTitle>
              <AlertDialogDescription>
                {t.confirmDeleteDesc}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="bg-muted text-foreground border-none hover:bg-muted/80">{t.cancel}</AlertDialogCancel>
              <AlertDialogAction onClick={handleDeleteProject} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                {t.confirmDeleteAction}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </LayoutWrapper>
    );
  }

  return (
    <LayoutWrapper>
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Settings className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h2 className="font-headline text-3xl font-bold">{t.adminTerminal}</h2>
              <p className="text-muted-foreground text-sm">Manage projects and portfolio.</p>
            </div>
          </div>
        </div>

        <div className="flex gap-2 p-1 bg-muted/20 rounded-xl border border-primary/10">
          <Button 
            variant={activeTab === 'customers' ? 'default' : 'ghost'} 
            onClick={() => setActiveTab('customers')}
            className="flex-1 rounded-lg h-10 gap-2 font-bold uppercase text-xs"
          >
            <User className="w-4 h-4" />
            {t.customerList}
          </Button>
          <Button 
            variant={activeTab === 'portfolio' ? 'default' : 'ghost'} 
            onClick={() => setActiveTab('portfolio')}
            className="flex-1 rounded-lg h-10 gap-2 font-bold uppercase text-xs"
          >
            <Grid className="w-4 h-4" />
            {t.explore}
          </Button>
        </div>

        {activeTab === 'customers' && (
          <div className="space-y-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input 
                placeholder={t.searchCustomer} 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-12 bg-card/50 border-primary/20"
              />
            </div>

            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">{t.customerList}</h3>
              {filteredProjects.length > 0 ? (
                filteredProjects.map((project) => (
                  <div 
                    key={project.id} 
                    className="group flex items-center justify-between p-4 rounded-xl bg-card/40 border border-primary/10 hover:border-primary/40 hover:bg-primary/5 transition-all cursor-pointer"
                    onClick={() => setSelectedProjectId(project.id)}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                        {project.clientName.charAt(0)}
                      </div>
                      <div>
                        <h4 className="font-bold text-sm group-hover:text-primary transition-colors">{project.clientName}</h4>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-[10px] text-muted-foreground font-mono uppercase tracking-tighter">{project.id}</span>
                          <span className="text-[10px] text-muted-foreground">•</span>
                          <span className="text-[10px] text-muted-foreground uppercase">
                            {t[project.type as keyof typeof t] || project.type}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-destructive transition-colors opacity-0 group-hover:opacity-100"
                        onClick={(e) => {
                          e.stopPropagation();
                          setProjectToDelete(project.id);
                        }}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                      <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-all group-hover:translate-x-1" />
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-10 text-muted-foreground italic">
                  {t.noProjects}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'portfolio' && (
          <div className="space-y-6">
            <Button 
              onClick={() => {
                resetPortfolioForm();
                setIsPortfolioDialogOpen(true);
              }}
              className="w-full h-12 bg-primary text-background font-bold gap-2 rounded-xl"
            >
              <Plus className="w-5 h-5" />
              {language === 'am' ? t.amAddPortfolio : t.addPortfolio}
            </Button>

            <div className="grid grid-cols-1 gap-4">
              {portfolio.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-4 rounded-xl bg-card/40 border border-primary/10">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg bg-muted overflow-hidden">
                      <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm">{item.title}</h4>
                      <div className="flex items-center gap-1 mt-0.5">
                        <Star className="w-3 h-3 text-primary fill-current" />
                        <span className="text-[10px] text-muted-foreground font-bold">{item.rating}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" onClick={() => openEditPortfolio(item)}>
                      <Edit2 className="w-4 h-4 text-primary" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => setPortfolioToDelete(item.id)}>
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* Portfolio Item Dialog */}
      <Dialog open={isPortfolioDialogOpen} onOpenChange={setIsPortfolioDialogOpen}>
        <DialogContent className="bg-card border-primary/20 text-foreground rounded-2xl">
          <DialogHeader>
            <DialogTitle className="font-headline text-2xl text-primary">
              {editingPortfolioItem ? t.editPortfolio : (language === 'am' ? t.amAddPortfolio : t.addPortfolio)}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>{language === 'am' ? t.amPortfolioName : t.portfolioName}</Label>
              <Input 
                value={portfolioTitle} 
                onChange={(e) => setPortfolioTitle(e.target.value)}
                placeholder="Ex: Luxury Villa Interior"
                className="bg-background border-primary/10"
              />
            </div>
            <div className="space-y-2">
              <Label>{t.imageUrl}</Label>
              <Input 
                value={portfolioImageUrl} 
                onChange={(e) => setPortfolioImageUrl(e.target.value)}
                placeholder="https://images.unsplash.com/..."
                className="bg-background border-primary/10"
              />
            </div>
            <div className="space-y-2">
              <Label>{language === 'am' ? t.amPortfolioRating : t.portfolioRating}</Label>
              <Input 
                type="number"
                step="0.1"
                min="0"
                max="5"
                value={portfolioRating} 
                onChange={(e) => setPortfolioRating(e.target.value)}
                className="bg-background border-primary/10"
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleSavePortfolio} className="w-full bg-primary text-background font-bold">
              {language === 'am' ? t.amSaveProject : t.saveProject}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialogs */}
      <AlertDialog open={!!projectToDelete} onOpenChange={(open) => !open && setProjectToDelete(null)}>
        <AlertDialogContent className="bg-card border-primary/20 text-foreground">
          <AlertDialogHeader>
            <AlertDialogTitle>{t.confirmDeleteTitle}</AlertDialogTitle>
            <AlertDialogDescription>{t.confirmDeleteDesc}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t.cancel}</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteProject} className="bg-destructive text-destructive-foreground">{t.confirmDeleteAction}</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={!!portfolioToDelete} onOpenChange={(open) => !open && setPortfolioToDelete(null)}>
        <AlertDialogContent className="bg-card border-primary/20 text-foreground">
          <AlertDialogHeader>
            <AlertDialogTitle>{t.confirmDeleteTitle}</AlertDialogTitle>
            <AlertDialogDescription>{language === 'am' ? "ይህንን ስራ ከፖርትፎሊዮው ማጥፋት ይፈልጋሉ?" : "Remove this project from portfolio?"}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t.cancel}</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeletePortfolio} className="bg-destructive text-destructive-foreground">{t.confirmDeleteAction}</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </LayoutWrapper>
  );
}