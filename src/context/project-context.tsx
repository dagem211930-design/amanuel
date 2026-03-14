"use client"

import React, { createContext, useContext, useState, useEffect } from 'react';
import { ProjectData, MOCK_PROJECTS, MilestoneStatus, createDefaultMilestones, PortfolioItem, MOCK_PORTFOLIO } from '@/lib/projects';
import { useFirestore } from '@/firebase';
import { doc, collection, setDoc } from 'firebase/firestore';
import { setDocumentNonBlocking } from '@/firebase/non-blocking-updates';

type ProjectContextType = {
  activeProject: ProjectData | null;
  allProjects: Record<string, ProjectData>;
  portfolio: PortfolioItem[];
  login: (id: string) => boolean;
  logout: () => void;
  registerProject: (name: string, clientName: string, type: 'wallChalk' | 'painting' | 'gypsum', area: number) => string;
  updateMilestone: (projectId: string, milestoneId: string, status: MilestoneStatus) => void;
  updateMilestoneImage: (projectId: string, milestoneId: string, imageUrl: string) => void;
  updateMilestoneVideo: (projectId: string, milestoneId: string, videoUrl: string) => void;
  deleteProject: (projectId: string) => void;
  addPortfolioItem: (title: string, imageUrl: string, rating: number) => void;
  updatePortfolioItem: (id: string, title: string, imageUrl: string, rating: number) => void;
  deletePortfolioItem: (id: string) => void;
  isLoading: boolean;
};

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export const ProjectProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [allProjects, setAllProjects] = useState<Record<string, ProjectData>>(MOCK_PROJECTS);
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>(MOCK_PORTFOLIO);
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const firestore = useFirestore();

  useEffect(() => {
    const savedProjects = localStorage.getItem('primefinish_all_projects');
    if (savedProjects) {
      setAllProjects(JSON.parse(savedProjects));
    }
    
    const savedPortfolio = localStorage.getItem('primefinish_portfolio');
    if (savedPortfolio) {
      setPortfolio(JSON.parse(savedPortfolio));
    }

    const savedId = localStorage.getItem('primefinish_project_id');
    if (savedId) {
      setActiveProjectId(savedId);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem('primefinish_all_projects', JSON.stringify(allProjects));
      localStorage.setItem('primefinish_portfolio', JSON.stringify(portfolio));
    }
  }, [allProjects, portfolio, isLoading]);

  const activeProject = activeProjectId ? allProjects[activeProjectId] : null;

  const login = (id: string) => {
    if (allProjects[id]) {
      setActiveProjectId(id);
      localStorage.setItem('primefinish_project_id', id);
      return true;
    }
    return false;
  };

  const logout = () => {
    setActiveProjectId(null);
    localStorage.removeItem('primefinish_project_id');
  };

  const registerProject = (name: string, clientName: string, type: 'wallChalk' | 'painting' | 'gypsum', area: number) => {
    const count = Object.keys(allProjects).length + 1;
    const suffix = count.toString().padStart(2, '0');
    const newId = `PF-2026-${suffix}`;
    
    const newProject: ProjectData = {
      id: newId,
      name,
      clientName,
      type,
      area,
      milestones: createDefaultMilestones(),
    };

    setAllProjects(prev => ({
      ...prev,
      [newId]: newProject
    }));

    // Persist to Firestore
    if (firestore) {
      const projectRef = doc(firestore, 'projects', newId);
      setDocumentNonBlocking(projectRef, newProject, { merge: true });
    }

    return newId;
  };

  const updateMilestone = (projectId: string, milestoneId: string, status: MilestoneStatus) => {
    setAllProjects(prev => {
      const project = prev[projectId];
      if (!project) return prev;

      const updatedMilestones = project.milestones.map(m => 
        m.id === milestoneId ? { 
          ...m, 
          status, 
          date: status === 'completed' ? new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : status === 'in-progress' ? 'In Progress' : 'Pending' 
        } : m
      );

      const updatedProject = { ...project, milestones: updatedMilestones };

      // Persist update to Firestore
      if (firestore) {
        const projectRef = doc(firestore, 'projects', projectId);
        setDocumentNonBlocking(projectRef, updatedProject, { merge: true });
      }

      return {
        ...prev,
        [projectId]: updatedProject
      };
    });
  };

  const updateMilestoneImage = (projectId: string, milestoneId: string, imageUrl: string) => {
    setAllProjects(prev => {
      const project = prev[projectId];
      if (!project) return prev;

      const updatedMilestones = project.milestones.map(m => 
        m.id === milestoneId ? { ...m, imageUrl } : m
      );

      const updatedProject = { ...project, milestones: updatedMilestones };

      if (firestore) {
        const projectRef = doc(firestore, 'projects', projectId);
        setDocumentNonBlocking(projectRef, updatedProject, { merge: true });
      }

      return {
        ...prev,
        [projectId]: updatedProject
      };
    });
  };

  const updateMilestoneVideo = (projectId: string, milestoneId: string, videoUrl: string) => {
    setAllProjects(prev => {
      const project = prev[projectId];
      if (!project) return prev;

      const updatedMilestones = project.milestones.map(m => 
        m.id === milestoneId ? { ...m, videoUrl } : m
      );

      const updatedProject = { ...project, milestones: updatedMilestones };

      if (firestore) {
        const projectRef = doc(firestore, 'projects', projectId);
        setDocumentNonBlocking(projectRef, updatedProject, { merge: true });
      }

      return {
        ...prev,
        [projectId]: updatedProject
      };
    });
  };

  const deleteProject = (projectId: string) => {
    setAllProjects(prev => {
      const next = { ...prev };
      delete next[projectId];
      return next;
    });
    if (activeProjectId === projectId) {
      logout();
    }
  };

  const addPortfolioItem = (title: string, imageUrl: string, rating: number) => {
    const newItem: PortfolioItem = {
      id: Date.now().toString(),
      title,
      imageUrl,
      rating,
      worker: "PrimeFinish Pro Team"
    };
    setPortfolio(prev => [newItem, ...prev]);
  };

  const updatePortfolioItem = (id: string, title: string, imageUrl: string, rating: number) => {
    setPortfolio(prev => prev.map(item => 
      item.id === id ? { ...item, title, imageUrl, rating } : item
    ));
  };

  const deletePortfolioItem = (id: string) => {
    setPortfolio(prev => prev.filter(item => item.id !== id));
  };

  return (
    <ProjectContext.Provider value={{ 
      activeProject, 
      allProjects, 
      portfolio,
      login, 
      logout, 
      registerProject, 
      updateMilestone, 
      updateMilestoneImage, 
      updateMilestoneVideo, 
      deleteProject,
      addPortfolioItem,
      updatePortfolioItem,
      deletePortfolioItem,
      isLoading 
    }}>
      {children}
    </ProjectContext.Provider>
  );
};

export const useProject = () => {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error('useProject must be used within a ProjectProvider');
  }
  return context;
};
