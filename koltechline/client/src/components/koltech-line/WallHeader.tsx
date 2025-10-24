import React from 'react';
import { Users, TrendingUp, MessageCircle, Search, PhoneCall, UserPlus } from 'lucide-react';

interface Wall {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<any>;
  color: string;
  participants: number;
  category: string;
  isActive?: boolean;
  isMember?: boolean;
  isAdmin?: boolean;
  requiresApproval?: boolean;
}

interface WallHeaderProps {
  currentWall: Wall | undefined;
  isLoggedIn: boolean;
  onJoinWall: (wallId: string) => void;
  onStartKolophone: () => void;
}

const WallHeader: React.FC<WallHeaderProps> = ({
  currentWall,
  isLoggedIn,
  onJoinWall,
  onStartKolophone
}) => {
  if (!currentWall) {
    // Header Skeleton
    return (
      <div className="flex items-center justify-between animate-pulse">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-dark-600 rounded-xl"></div>
          <div>
            <div className="h-3 bg-dark-600 rounded w-48 mb-2"></div>
            <div className="flex items-center space-x-3">
              <div className="h-2 bg-dark-600 rounded w-20"></div>
              <div className="h-2 bg-dark-600 rounded w-16"></div>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <div className="h-9 bg-dark-600 rounded-xl w-20"></div>
          <div className="h-9 w-9 bg-dark-600 rounded-xl"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <div className={`p-3 bg-gradient-to-r ${currentWall.color} rounded-xl shadow-lg`}>
          {currentWall.icon && <currentWall.icon className="w-6 h-6 text-white" />}
        </div>
        <div>
          <p className="text-gray-300 text-sm truncate max-w-md font-medium">
            {currentWall.description}
          </p>
          <div className="flex items-center space-x-3 mt-1">
            <div className="flex items-center space-x-1">
              <Users className="w-3 h-3 text-primary-400" />
              <span className="text-xs text-gray-400">{currentWall.participants} members</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-xs text-green-400">Active</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex items-center space-x-2">
        {isLoggedIn && currentWall && !currentWall.isMember ? (
          <button
            onClick={() => onJoinWall(currentWall.id)}
            className="flex items-center space-x-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-2 rounded-xl hover:shadow-lg hover:shadow-green-500/30 transition-all text-sm font-medium group"
          >
            <UserPlus className="w-4 h-4 group-hover:scale-110 transition-transform" />
            <span>Join</span>
          </button>
        ) : (
          isLoggedIn && currentWall && currentWall.isMember && (
            <button
              onClick={onStartKolophone}
              className="flex items-center space-x-2 bg-gradient-to-r from-primary-500 to-accent-purple text-white px-4 py-2 rounded-xl hover:shadow-lg hover:shadow-primary-500/30 transition-all text-sm font-medium group"
            >
              <PhoneCall className="w-4 h-4 group-hover:scale-110 transition-transform" />
              <span>Call</span>
            </button>
          )
        )}
        
        <button className="p-2.5 bg-dark-700/50 border border-dark-600 text-gray-400 rounded-xl hover:text-white hover:border-primary-500/50 transition-all">
          <Search className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default WallHeader;
