import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, X, Search } from 'lucide-react';
import { Wall } from '../../types/koltech-line';

interface WallsListProps {
  walls: Wall[];
  activeWallId?: string;
  loadingWalls: boolean;
  selectedCategory: string;
  categories: { id: string; name: string }[];
  onCategoryChange: (category: string) => void;
  onClose: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  isSearchFocused: boolean;
  onSearchFocus: (focused: boolean) => void;
}

const WallsList: React.FC<WallsListProps> = ({
  walls,
  activeWallId,
  loadingWalls,
  selectedCategory,
  categories,
  onCategoryChange,
  onClose,
  searchQuery,
  onSearchChange,
  isSearchFocused,
  onSearchFocus
}) => {
  const navigate = useNavigate();

  const filteredWalls = walls.filter(wall => {
    if (searchQuery) {
      return wall.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
             wall.description.toLowerCase().includes(searchQuery.toLowerCase());
    }
    return true;
  });

  return (
    <div className="animate-fade-in">
      {/* Header with Category Filters */}
      <div className="space-y-3 mb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Users className="w-4 h-4 text-primary-400" />
            <h3 className="text-white font-semibold text-sm">Available Walls</h3>
            <span className="text-xs text-gray-400 bg-dark-600 px-2 py-0.5 rounded-full">
              {filteredWalls.length}
            </span>
          </div>
          
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-all p-1.5 rounded-full hover:bg-dark-600 group"
          >
            <X className="w-4 h-4 group-hover:rotate-90 transition-transform" />
          </button>
        </div>
        
        {/* Category Filters and Search */}
        <div className="flex items-center gap-2">
          {/* Category Filters */}
          <div className={`flex items-center space-x-1.5 flex-1 overflow-x-auto scrollbar-hide transition-all duration-300 ${
            isSearchFocused ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100'
          }`}>
            {categories.map((category, index) => (
              <button
                key={category.id}
                onClick={() => onCategoryChange(category.id)}
                className={`px-2.5 py-1 rounded-xl text-xs font-medium transition-all transform hover:scale-105 whitespace-nowrap ${
                  selectedCategory === category.id
                    ? 'bg-gradient-to-r from-primary-500 to-accent-purple text-white shadow-lg shadow-primary-500/20'
                    : 'bg-dark-700/50 border border-dark-600 text-gray-400 hover:text-white hover:border-primary-500/50'
                }`}
                style={{ animationDelay: `${index * 30}ms` }}
              >
                {category.name}
              </button>
            ))}
          </div>
          
          {/* Search Input */}
          <div className={`relative flex-shrink-0 transition-all duration-300 ${
            isSearchFocused ? 'w-full' : 'w-48'
          }`}>
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              onFocus={() => onSearchFocus(true)}
              onBlur={() => onSearchFocus(false)}
              placeholder="Search walls..."
              className="w-full bg-dark-700/50 border border-dark-600 text-white placeholder-gray-500 pl-9 pr-3 py-1 rounded-xl text-xs focus:outline-none focus:border-primary-500/50 transition-all"
            />
            {searchQuery && (
              <button
                onMouseDown={(e) => {
                  e.preventDefault();
                  onSearchChange('');
                }}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>
      </div>
      
      {/* Walls Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 max-h-[320px] overflow-y-auto px-2 pt-2 pb-6" 
           style={{ scrollbarWidth: 'thin', scrollbarColor: '#4B5563 #1F2937' }}>
        {loadingWalls ? (
          /* Skeleton Loading */
          Array(10).fill(0).map((_, i) => (
            <div
              key={i}
              className="p-3 rounded-xl border border-dark-600 bg-gradient-to-br from-dark-700 to-dark-800 animate-pulse"
              style={{ animationDelay: `${i * 50}ms` }}
            >
              <div className="flex items-center space-x-2 mb-2">
                <div className="p-1.5 rounded-lg bg-dark-600 w-7 h-7"></div>
                <div className="h-3 bg-dark-600 rounded w-20"></div>
              </div>
              <div className="space-y-1.5 mb-2">
                <div className="h-2 bg-dark-600 rounded w-full"></div>
                <div className="h-2 bg-dark-600 rounded w-5/6"></div>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-dark-600/30">
                <div className="flex items-center space-x-1">
                  <div className="w-3 h-3 bg-dark-600 rounded-full"></div>
                  <div className="h-2 bg-dark-600 rounded w-5"></div>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-dark-600 rounded-full"></div>
                  <div className="h-2 bg-dark-600 rounded w-8"></div>
                </div>
              </div>
            </div>
          ))
        ) : filteredWalls.length === 0 ? (
          /* No Walls Found */
          <div className="col-span-full flex flex-col items-center justify-center py-12 px-4">
            <div className="w-16 h-16 bg-dark-600/50 rounded-full flex items-center justify-center mb-4">
              <Users className="w-8 h-8 text-gray-500" />
            </div>
            <h3 className="text-white font-semibold text-lg mb-2">No Walls Found</h3>
            <p className="text-gray-400 text-sm text-center max-w-md mb-4">
              {searchQuery 
                ? `No walls match "${searchQuery}"`
                : selectedCategory === 'all' 
                  ? 'There are no walls available at the moment.'
                  : `No walls found in the "${categories.find(c => c.id === selectedCategory)?.name}" category.`
              }
            </p>
            {(selectedCategory !== 'all' || searchQuery) && (
              <button
                onClick={() => {
                  onCategoryChange('all');
                  onSearchChange('');
                }}
                className="text-primary-400 hover:text-primary-300 text-sm font-medium transition-colors"
              >
                View all walls
              </button>
            )}
          </div>
        ) : (
          filteredWalls.map((wall, index) => (
            <button
              key={wall.id}
              onClick={() => {
                if (activeWallId !== wall.id) {
                  navigate(`/koltech-line-new/${wall.id}`);
                }
                onClose();
              }}
              className={`p-3 rounded-xl border transition-all duration-200 group text-left relative hover:z-10 ${
                activeWallId === wall.id
                  ? 'bg-gradient-to-br ' + wall.color + ' border-transparent text-white shadow-lg scale-[1.02]'
                  : 'bg-gradient-to-br from-dark-700 to-dark-800 border-dark-600 text-gray-300 hover:border-primary-500/50 hover:shadow-md hover:scale-[1.02]'
              }`}
              style={{ animationDelay: `${index * 30}ms` }}
            >
              {/* Icon & Name */}
              <div className="flex items-center space-x-2 mb-2">
                <div className={`p-1.5 rounded-lg ${
                  activeWallId === wall.id ? 'bg-white/20' : 'bg-gradient-to-r ' + wall.color
                }`}>
                  {wall.icon && <wall.icon className="w-3.5 h-3.5" />}
                </div>
                <span className="font-semibold text-xs truncate flex-1">{wall.name}</span>
              </div>
              
              {/* Description */}
              <p className={`text-xs mb-2 line-clamp-2 leading-tight ${
                activeWallId === wall.id ? 'opacity-90' : 'opacity-70'
              }`}>
                {wall.description}
              </p>
              
              {/* Stats */}
              <div className="flex items-center justify-between pt-2 border-t border-current/10">
                <div className="flex items-center space-x-1">
                  <Users className="w-3 h-3 opacity-70" />
                  <span className="text-xs font-medium">{wall.participants}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-xs opacity-70">Live</span>
                </div>
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  );
};

export default WallsList;
