import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, MessageCircle, TrendingUp, Hash, Plus, PhoneCall, UserPlus } from 'lucide-react';
import { Wall } from '../../types/koltech-line';

interface WallSidebarProps {
  currentWall?: Wall;
  messagesCount: number;
  isLoggedIn: boolean;
  popularTags: string[];
  selectedTags: string[];
  onToggleTag: (tag: string) => void;
  onCreateWall: () => void;
  onStartKolophone: () => void;
  onJoinWall: (wallId: string) => void;
  onLeaveWall: (wallId: string) => void;
}

const WallSidebar: React.FC<WallSidebarProps> = ({
  currentWall,
  messagesCount,
  isLoggedIn,
  popularTags,
  selectedTags,
  onToggleTag,
  onCreateWall,
  onStartKolophone,
  onJoinWall,
  onLeaveWall
}) => {
  const navigate = useNavigate();

  if (!currentWall) {
    return (
      <div className="w-80 bg-dark-800 border-l border-dark-700 p-6 hidden lg:block fixed right-0 top-14 bottom-0 overflow-y-auto" 
           style={{ scrollbarWidth: 'thin', scrollbarColor: '#4B5563 #1F2937', paddingBottom: '120px' }}>
        <div className="space-y-6 pb-20">
          {/* Skeleton Loading */}
          <div className="bg-gradient-to-br from-dark-700 to-dark-800 rounded-2xl p-5 border border-dark-600 shadow-xl animate-pulse">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-dark-600 rounded-xl"></div>
              <div className="flex-1">
                <div className="h-4 bg-dark-600 rounded w-32 mb-2"></div>
                <div className="h-2 bg-dark-600 rounded w-20"></div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="bg-dark-600/50 rounded-xl p-3 h-24"></div>
              <div className="bg-dark-600/50 rounded-xl p-3 h-24"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-80 bg-dark-800 border-l border-dark-700 p-6 hidden lg:block fixed right-0 top-14 bottom-0 overflow-y-auto" 
         style={{ scrollbarWidth: 'thin', scrollbarColor: '#4B5563 #1F2937', paddingBottom: '120px' }}>
      <div className="space-y-6 pb-20">
        {/* Current Wall Info */}
        <div className="bg-gradient-to-br from-dark-700 to-dark-800 rounded-2xl p-5 border border-dark-600 shadow-xl">
          {/* Wall Header */}
          <div className="flex items-center space-x-3 mb-4">
            <div className={`p-3 bg-gradient-to-r ${currentWall.color} rounded-xl shadow-lg`}>
              {currentWall.icon && <currentWall.icon className="w-6 h-6 text-white" />}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-white font-bold text-lg truncate">{currentWall.name}</h3>
              <p className="text-gray-400 text-xs capitalize">{currentWall.category}</p>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="bg-dark-600/50 rounded-xl p-3 border border-dark-500 hover:border-primary-500/50 transition-all group">
              <div className="flex items-center space-x-2 mb-1">
                <Users className="w-4 h-4 text-primary-400 group-hover:scale-110 transition-transform" />
                <span className="text-gray-400 text-xs">Members</span>
              </div>
              <p className="text-white text-2xl font-bold">{currentWall.participants || 0}</p>
              <div className="flex items-center space-x-1 mt-1">
                <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-green-400 text-xs">+12 today</span>
              </div>
            </div>

            <div className="bg-dark-600/50 rounded-xl p-3 border border-dark-500 hover:border-accent-purple/50 transition-all group">
              <div className="flex items-center space-x-2 mb-1">
                <MessageCircle className="w-4 h-4 text-accent-purple group-hover:scale-110 transition-transform" />
                <span className="text-gray-400 text-xs">Messages</span>
              </div>
              <p className="text-white text-2xl font-bold">{messagesCount}</p>
              <div className="flex items-center space-x-1 mt-1">
                <TrendingUp className="w-3 h-3 text-accent-purple" />
                <span className="text-accent-purple text-xs">Active</span>
              </div>
            </div>
          </div>

          {/* Activity Indicator */}
          <div className="bg-dark-600/30 rounded-xl p-3 mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400 text-xs">Activity Level</span>
              <span className="text-green-400 text-xs font-medium">Very High</span>
            </div>
            <div className="w-full bg-dark-500 rounded-full h-2 overflow-hidden">
              <div className="bg-gradient-to-r from-green-500 to-emerald-400 h-full rounded-full animate-pulse" 
                   style={{ width: '85%' }}></div>
            </div>
          </div>

          {/* Your Status */}
          <div className="flex items-center justify-between mb-4">
            <span className="text-gray-400 text-sm">Your Status</span>
            {isLoggedIn ? (
              <div className={`flex items-center space-x-2 px-3 py-1.5 rounded-full ${
                currentWall.isMember 
                  ? 'bg-green-500/20 border border-green-500/30' 
                  : 'bg-yellow-500/20 border border-yellow-500/30'
              }`}>
                {currentWall.isMember ? (
                  <>
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-green-400 text-xs font-medium">Member</span>
                  </>
                ) : (
                  <>
                    <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                    <span className="text-yellow-400 text-xs font-medium">Guest</span>
                  </>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-2 px-3 py-1.5 rounded-full bg-gray-500/20 border border-gray-500/30">
                <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                <span className="text-gray-400 text-xs font-medium">Visitor</span>
              </div>
            )}
          </div>
          
          {/* Join/Leave Actions */}
          {isLoggedIn && (
            <div className="pt-4 border-t border-dark-600">
              {!currentWall.isMember ? (
                <button
                  onClick={() => onJoinWall(currentWall.id)}
                  className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white py-3 px-4 rounded-xl hover:shadow-lg hover:shadow-green-500/20 transition-all flex items-center justify-center space-x-2 font-medium group"
                >
                  <UserPlus className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  <span>Join This Wall</span>
                </button>
              ) : (
                <div className="space-y-2">
                  <div className="flex items-center justify-center space-x-2 text-green-400 text-sm mb-3 bg-green-500/10 py-2 rounded-lg">
                    <Users className="w-4 h-4" />
                    <span className="font-medium">You're a member!</span>
                  </div>
                  <button
                    onClick={() => onLeaveWall(currentWall.id)}
                    className="w-full bg-red-500/10 border border-red-500/30 text-red-400 py-2.5 px-4 rounded-xl hover:bg-red-500/20 transition-all text-sm font-medium"
                  >
                    Leave Wall
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Trending Tags */}
        <div className="bg-gradient-to-br from-dark-700 to-dark-800 rounded-2xl p-5 border border-dark-600 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Hash className="w-5 h-5 text-accent-purple" />
              <h3 className="text-white font-bold">Trending Tags</h3>
            </div>
            <TrendingUp className="w-4 h-4 text-accent-purple animate-pulse" />
          </div>
          <div className="flex flex-wrap gap-2">
            {popularTags.slice(0, 10).map((tag, index) => (
              <button
                key={tag}
                onClick={() => onToggleTag(tag)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all transform hover:scale-105 ${
                  selectedTags.includes(tag)
                    ? 'bg-gradient-to-r from-accent-purple to-primary-500 text-white shadow-lg shadow-accent-purple/30'
                    : 'bg-dark-600 text-gray-400 hover:text-white hover:bg-dark-500 border border-dark-500'
                }`}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                #{tag}
              </button>
            ))}
          </div>
        </div>

        {/* Online Users */}
        <div className="bg-gradient-to-br from-dark-700 to-dark-800 rounded-2xl p-5 border border-dark-600 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Users className="w-5 h-5 text-green-400" />
                <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-400 rounded-full animate-ping"></div>
              </div>
              <h3 className="text-white font-bold">Online Now</h3>
            </div>
            <span className="text-green-400 text-sm font-medium">3 active</span>
          </div>
          <div className="space-y-3">
            {[
              { name: 'Alex Chen', status: 'Available for projects', color: 'from-blue-500 to-cyan-500', online: true },
              { name: 'Sarah Johnson', status: 'Seeking investors', color: 'from-purple-500 to-pink-500', online: true },
              { name: 'Mike Rodriguez', status: 'Building MVP', color: 'from-orange-500 to-red-500', online: true }
            ].map((user, index) => (
              <div 
                key={index} 
                className="flex items-center space-x-3 p-2 rounded-xl hover:bg-dark-600/50 transition-all cursor-pointer group"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="relative">
                  <div className={`w-10 h-10 bg-gradient-to-br ${user.color} rounded-full group-hover:scale-110 transition-transform`}></div>
                  {user.online && (
                    <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-400 rounded-full border-2 border-dark-700 animate-pulse"></div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm font-medium truncate group-hover:text-primary-400 transition-colors">{user.name}</p>
                  <p className="text-gray-400 text-xs truncate">{user.status}</p>
                </div>
                <MessageCircle className="w-4 h-4 text-gray-500 group-hover:text-primary-400 transition-colors" />
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="space-y-3">
          <button
            onClick={onCreateWall}
            className="w-full bg-gradient-to-r from-primary-500 to-accent-purple text-white py-3.5 rounded-xl font-medium hover:shadow-lg hover:shadow-primary-500/30 transition-all flex items-center justify-center space-x-2 group"
          >
            <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" />
            <span>Create New Wall</span>
          </button>
          
          {isLoggedIn && (
            <button
              onClick={onStartKolophone}
              className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white py-3.5 rounded-xl font-medium hover:shadow-lg hover:shadow-green-500/30 transition-all flex items-center justify-center space-x-2 group"
            >
              <PhoneCall className="w-5 h-5 group-hover:scale-110 transition-transform" />
              <span>Start Wall Call</span>
            </button>
          )}
          
          <button
            onClick={() => navigate('/contacts')}
            className="w-full bg-dark-700 border border-dark-600 text-gray-300 py-3.5 rounded-xl font-medium hover:bg-dark-600 hover:border-primary-500/50 transition-all flex items-center justify-center space-x-2 group"
          >
            <UserPlus className="w-5 h-5 group-hover:scale-110 transition-transform" />
            <span>Manage Contacts</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default WallSidebar;
