import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface ReactionPickerProps {
  onReaction: (reactionType: string) => void;
  currentReaction?: string | null;
  reactions: {
    like: number;
    love: number;
    haha: number;
    wow: number;
    sad: number;
    angry: number;
    total: number;
  };
  disabled?: boolean;
}

const reactions = [
  { type: 'like', emoji: '👍', label: 'Like', color: 'text-blue-500' },
  { type: 'love', emoji: '❤️', label: 'Love', color: 'text-red-500' },
  { type: 'haha', emoji: '😂', label: 'Haha', color: 'text-yellow-500' },
  { type: 'wow', emoji: '😮', label: 'Wow', color: 'text-orange-500' },
  { type: 'sad', emoji: '😢', label: 'Sad', color: 'text-blue-400' }
];

const ReactionPicker: React.FC<ReactionPickerProps> = ({
  onReaction,
  currentReaction,
  reactions: reactionCounts,
  disabled = false
}) => {
  const [showPicker, setShowPicker] = useState(false);
  
  const handleReaction = (reactionType: string) => {
    onReaction(reactionType);
    setShowPicker(false);
  };

  const getCurrentReactionData = () => {
    return reactions.find(r => r.type === currentReaction);
  };

  const getTopReactions = () => {
    const reactionTypes = Object.entries(reactionCounts)
      .filter(([key, count]) => key !== 'total' && count > 0)
      .sort(([, a], [, b]) => (b as number) - (a as number))
      .slice(0, 3);
    
    return reactionTypes.map(([type]) => 
      reactions.find(r => r.type === type)
    ).filter(Boolean);
  };

  const topReactions = getTopReactions();
  const currentReactionData = getCurrentReactionData();

  return (
    <div className="relative">
      {/* Main Button */}
      <div
        className="relative group"
        onMouseEnter={() => setShowPicker(true)}
        onMouseLeave={() => setShowPicker(false)}
      >
        <button
          onClick={() => handleReaction(currentReaction || 'like')}
          disabled={disabled}
          className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all ${
            currentReaction
              ? `${currentReactionData?.color || 'text-blue-500'} bg-blue-500/10`
              : 'text-gray-400 hover:text-blue-500 hover:bg-blue-500/10'
          } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <span className="text-lg">
            {currentReactionData?.emoji || '👍'}
          </span>
          <span className="text-sm font-medium">
            {currentReactionData?.label || 'Like'}
          </span>
          {reactionCounts.total > 0 && (
            <span className="text-sm">
              {reactionCounts.total}
            </span>
          )}
        </button>

        {/* Reaction Picker */}
        {showPicker && !disabled && (
          <motion.div
            className="absolute bottom-full left-0 mb-2 bg-dark-700 border border-dark-600 rounded-xl p-3 shadow-xl z-50"
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex space-x-2">
              {reactions.map((reaction) => (
                <motion.button
                  key={reaction.type}
                  onClick={() => handleReaction(reaction.type)}
                  className="group flex flex-col items-center p-2 rounded-lg hover:bg-dark-600 transition-colors min-w-[50px]"
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <span className="text-2xl mb-1 group-hover:scale-110 transition-transform">
                    {reaction.emoji}
                  </span>
                  <span className="text-xs text-gray-400 group-hover:text-white">
                    {reaction.label}
                  </span>
                  {reactionCounts[reaction.type as keyof typeof reactionCounts] > 0 && (
                    <span className="text-xs text-gray-500 mt-1">
                      {reactionCounts[reaction.type as keyof typeof reactionCounts]}
                    </span>
                  )}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </div>

      {/* Reaction Summary */}
      {topReactions.length > 0 && (
        <div className="flex items-center space-x-1 mt-2">
          <div className="flex -space-x-1">
            {topReactions.map((reaction, index) => (
              <div
                key={reaction?.type}
                className="w-6 h-6 bg-dark-600 rounded-full flex items-center justify-center text-sm border-2 border-dark-800"
                style={{ zIndex: topReactions.length - index }}
              >
                {reaction?.emoji}
              </div>
            ))}
          </div>
          <span className="text-xs text-gray-400">
            {reactionCounts.total} {reactionCounts.total === 1 ? 'reaction' : 'reactions'}
          </span>
        </div>
      )}
    </div>
  );
};

export default ReactionPicker;