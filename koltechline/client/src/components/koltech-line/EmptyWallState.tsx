import React from 'react';
import { Users, Plus } from 'lucide-react';

interface EmptyWallStateProps {
  onShowWalls: () => void;
  onCreateWall: () => void;
}

const EmptyWallState: React.FC<EmptyWallStateProps> = ({ onShowWalls, onCreateWall }) => {
  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
      <div className="text-center max-w-md px-6 animate-fade-in">
        <div className="w-24 h-24 bg-gradient-to-br from-primary-500 to-accent-purple rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-primary-500/30 animate-pulse">
          <Users className="w-12 h-12 text-white" />
        </div>
        <h2 className="text-white text-3xl font-bold mb-3">Welcome to KolTech Line</h2>
        <p className="text-gray-400 text-lg mb-8">
          Choose a wall to start connecting with professionals, entrepreneurs, and innovators
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={onShowWalls}
            className="bg-gradient-to-r from-primary-500 to-accent-purple text-white px-6 py-3 rounded-xl font-semibold text-base hover:shadow-2xl hover:shadow-primary-500/40 transition-all transform hover:scale-105 flex items-center space-x-2 group whitespace-nowrap"
          >
            <Users className="w-5 h-5 group-hover:scale-110 transition-transform" />
            <span>Choose a Wall</span>
          </button>
          
          <span className="text-gray-500 text-base font-medium">or</span>
          
          <button
            onClick={onCreateWall}
            className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-3 rounded-xl font-semibold text-base hover:shadow-2xl hover:shadow-green-500/40 transition-all transform hover:scale-105 flex items-center space-x-2 group whitespace-nowrap"
          >
            <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" />
            <span>Create Wall</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmptyWallState;
