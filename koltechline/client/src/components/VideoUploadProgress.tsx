import React from 'react';
import { X } from 'lucide-react';

interface VideoUploadProgressProps {
  progress: number;
  status: string;
  onCancel: () => void;
  thumbnail?: string;
}

const VideoUploadProgress: React.FC<VideoUploadProgressProps> = ({
  progress,
  status,
  onCancel,
  thumbnail
}) => {
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="relative w-full h-64 bg-dark-800 rounded-xl overflow-hidden">
      {/* Thumbnail background */}
      {thumbnail && (
        <img
          src={thumbnail}
          alt="Video preview"
          className="absolute inset-0 w-full h-full object-cover opacity-50 blur-sm"
        />
      )}

      {/* Overlay */}
      <div className="absolute inset-0 bg-dark-900/60 backdrop-blur-sm flex items-center justify-center">
        {/* Circular progress */}
        <div className="relative">
          {/* Background circle */}
          <svg className="w-32 h-32 transform -rotate-90">
            <circle
              cx="64"
              cy="64"
              r={radius}
              stroke="rgba(255, 255, 255, 0.1)"
              strokeWidth="4"
              fill="none"
            />
            {/* Progress circle */}
            <circle
              cx="64"
              cy="64"
              r={radius}
              stroke="#6366f1"
              strokeWidth="4"
              fill="none"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className="transition-all duration-300"
            />
          </svg>

          {/* Cancel button */}
          <button
            onClick={onCancel}
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-dark-700/90 hover:bg-dark-600 rounded-full flex items-center justify-center transition-all group"
            title="Cancel upload"
          >
            <X className="w-6 h-6 text-white group-hover:scale-110 transition-transform" />
          </button>

          {/* Progress text */}
          <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 text-center whitespace-nowrap">
            <div className="text-white font-medium text-lg">
              {Math.round(progress)}%
            </div>
            <div className="text-gray-400 text-sm mt-1">
              {status}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoUploadProgress;
