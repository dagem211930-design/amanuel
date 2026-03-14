export type MilestoneStatus = 'completed' | 'in-progress' | 'pending';

export interface Milestone {
  id: string;
  nameKey: 'stage1' | 'stage2' | 'stage3' | 'stage4';
  status: MilestoneStatus;
  date: string;
  imageUrl?: string;
  videoUrl?: string;
}

export interface ProjectData {
  id: string;
  name: string;
  type: 'wallChalk' | 'painting' | 'gypsum';
  clientName: string;
  area: number;
  milestones: Milestone[];
}

export interface PortfolioItem {
  id: string;
  title: string;
  imageUrl: string;
  rating: number;
  worker?: string;
}

export const createDefaultMilestones = (): Milestone[] => [
  { 
    id: 'm1', 
    nameKey: 'stage1', 
    status: 'pending', 
    date: 'Pending', 
  },
  { 
    id: 'm2', 
    nameKey: 'stage2', 
    status: 'pending', 
    date: 'Pending' 
  },
  { 
    id: 'm3', 
    nameKey: 'stage3', 
    status: 'pending', 
    date: 'Pending' 
  },
  { 
    id: 'm4', 
    nameKey: 'stage4', 
    status: 'pending', 
    date: 'Pending' 
  },
];

export const MOCK_PORTFOLIO: PortfolioItem[] = [
  { id: "p1", title: "The Royal Suite", imageUrl: "https://picsum.photos/seed/luxury1/800/600", rating: 4.9, worker: "Marcus Aurelius" },
  { id: "p2", title: "Modern Minimalist", imageUrl: "https://picsum.photos/seed/luxury2/800/600", rating: 5.0, worker: "Elena Petrov" },
  { id: "p3", title: "Premium Wall Finish", imageUrl: "https://picsum.photos/seed/luxury3/800/600", rating: 4.8, worker: "Marcus Aurelius" },
  { id: "p4", title: "GoldLeaf Finishes", imageUrl: "https://picsum.photos/seed/luxury4/800/600", rating: 4.9, worker: "Elena Petrov" },
];

export const MOCK_PROJECTS: Record<string, ProjectData> = {
  '101': {
    id: '101',
    name: 'Luxury Villa Wall Decor',
    type: 'wallChalk',
    clientName: 'Abebe Kebede',
    area: 45,
    milestones: [
      { id: 'm1', nameKey: 'stage1', status: 'completed', date: 'Oct 24, 2023', videoUrl: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4' },
      { id: 'm2', nameKey: 'stage2', status: 'completed', date: 'Nov 12, 2023' },
      { id: 'm3', nameKey: 'stage3', status: 'in-progress', date: 'In Progress' },
      { id: 'm4', nameKey: 'stage4', status: 'pending', date: 'Pending' },
    ],
  },
  '102': {
    id: '102',
    name: 'Penthouse Interior Refresh',
    type: 'painting',
    clientName: 'Sara Tekle',
    area: 120,
    milestones: [
      { id: 'm1', nameKey: 'stage1', status: 'completed', date: 'Nov 05, 2023' },
      { id: 'm2', nameKey: 'stage2', status: 'in-progress', date: 'In Progress' },
      { id: 'm3', nameKey: 'stage3', status: 'pending', date: 'Pending' },
      { id: 'm4', nameKey: 'stage4', status: 'pending', date: 'Pending' },
    ],
  },
  '103': {
    id: '103',
    name: 'Modern Office Ceiling',
    type: 'gypsum',
    clientName: 'Samuel Girma',
    area: 85,
    milestones: [
      { id: 'm1', nameKey: 'stage1', status: 'completed', date: 'Dec 01, 2023' },
      { id: 'm2', nameKey: 'stage2', status: 'completed', date: 'Dec 15, 2023' },
      { id: 'm3', nameKey: 'stage3', status: 'completed', date: 'Jan 05, 2024' },
      { id: 'm4', nameKey: 'stage4', status: 'in-progress', date: 'In Progress' },
    ],
  },
};
