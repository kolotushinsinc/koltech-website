import { Code, TrendingUp, DollarSign, Brain, Target } from 'lucide-react';

export const getCategoryIcon = (category: string) => {
  switch (category) {
    case 'freelance': return Code;
    case 'startups': return TrendingUp;
    case 'investments': return DollarSign;
    case 'technology': return Brain;
    default: return Target;
  }
};

export const getCategoryColor = (category: string) => {
  switch (category) {
    case 'freelance': return 'from-blue-500 to-cyan-500';
    case 'startups': return 'from-purple-500 to-pink-500';
    case 'investments': return 'from-green-500 to-emerald-500';
    case 'technology': return 'from-orange-500 to-red-500';
    default: return 'from-gray-500 to-slate-500';
  }
};

export const formatTime = (date: Date) => {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return 'now';
  if (minutes < 60) return `${minutes}m`;
  if (hours < 24) return `${hours}h`;
  return `${days}d`;
};

export const extractTagsFromContent = (content: string): string[] => {
  const tagRegex = /#[\w]+/g;
  const matches = content.match(tagRegex);
  return matches ? matches.map(tag => tag.substring(1).toLowerCase()) : [];
};

export const filterWallsByParticipants = (participants: number, range: string): boolean => {
  switch (range) {
    case 'small': return participants < 100;
    case 'medium': return participants >= 100 && participants < 500;
    case 'large': return participants >= 500 && participants < 1000;
    case 'huge': return participants >= 1000;
    default: return true;
  }
};
