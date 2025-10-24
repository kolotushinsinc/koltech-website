import { Code, TrendingUp, DollarSign, Brain, Target } from 'lucide-react';
import { Category, ParticipantRange } from '../../types/koltech-line';

export const categories: Category[] = [
  { id: 'all', name: 'All Categories' },
  { id: 'freelance', name: 'Freelance' },
  { id: 'startups', name: 'Startups' },
  { id: 'investments', name: 'Investments' },
  { id: 'technology', name: 'Technology' }
];

export const participantRanges: ParticipantRange[] = [
  { id: 'all', name: 'Any Size' },
  { id: 'small', name: '< 100 members' },
  { id: 'medium', name: '100-500 members' },
  { id: 'large', name: '500-1000 members' },
  { id: 'huge', name: '1000+ members' }
];

export const popularTags = [
  'React', 'Node.js', 'Python', 'AI/ML', 'Blockchain', 'Mobile', 'UI/UX',
  'DevOps', 'Startup', 'Funding', 'Series A', 'MVP', 'SaaS', 'Fintech'
];

export const reactionEmojis = ['❤️', '👍', '😂', '😮', '😢', '🔥'];

export const MAX_FILES = 15;
export const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
