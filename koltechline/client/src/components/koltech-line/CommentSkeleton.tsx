import React from 'react';

const CommentSkeleton: React.FC = () => {
  return (
    <div className="bg-dark-700/30 rounded-xl p-3 animate-pulse">
      <div className="flex items-start space-x-2">
        <div className="w-7 h-7 bg-dark-600 rounded-full flex-shrink-0"></div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2 mb-1">
            <div className="h-3 bg-dark-600 rounded-full w-24"></div>
            <div className="h-2 bg-dark-600 rounded-full w-12"></div>
          </div>
          <div className="space-y-1">
            <div className="h-2 bg-dark-600 rounded-full w-full"></div>
            <div className="h-2 bg-dark-600 rounded-full w-2/3"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommentSkeleton;
