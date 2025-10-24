import React from 'react';

const MessageSkeleton: React.FC = () => {
  return (
    <div className="bg-gradient-to-br from-dark-700 to-dark-800 rounded-2xl p-4 border border-dark-600 shadow-xl animate-pulse">
      {/* Header */}
      <div className="flex items-start space-x-3 mb-3">
        <div className="w-9 h-9 bg-dark-600 rounded-full flex-shrink-0"></div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2 mb-1.5">
            <div className="h-3.5 bg-dark-600 rounded-full w-28"></div>
            <div className="h-2.5 bg-dark-600 rounded-full w-14"></div>
          </div>
          <div className="space-y-1.5">
            <div className="h-2.5 bg-dark-600 rounded-full w-full"></div>
            <div className="h-2.5 bg-dark-600 rounded-full w-2/3"></div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center space-x-3 pt-2 border-t border-dark-600">
        <div className="h-6 bg-dark-600 rounded-full w-14"></div>
        <div className="h-6 bg-dark-600 rounded-full w-14"></div>
        <div className="h-6 bg-dark-600 rounded-full w-14"></div>
      </div>
    </div>
  );
};

export default MessageSkeleton;
