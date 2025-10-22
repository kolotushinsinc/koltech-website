import React from 'react';
import { Lock, UserPlus, LogIn, X } from 'lucide-react';
import Modal from './Modal';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  action: 'like' | 'comment' | 'post' | 'create_wall' | 'join_wall' | 'report' | 'kolophone' | 'message';
  onLogin: () => void;
  onRegister: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  action,
  onLogin,
  onRegister
}) => {
  const getActionText = () => {
    switch (action) {
      case 'like': return 'like posts';
      case 'comment': return 'comment on posts';
      case 'post': return 'create posts';
      case 'create_wall': return 'create walls';
      case 'join_wall': return 'join walls';
      case 'report': return 'report content';
      case 'kolophone': return 'start Kolophone calls';
      case 'message': return 'send private messages';
      default: return 'access this feature';
    }
  };

  const getDescription = () => {
    switch (action) {
      case 'like':
        return 'Show your appreciation for posts by liking them. Connect with the community and discover trending content.';
      case 'comment':
        return 'Join the conversation! Share your thoughts, ask questions, and engage with other community members.';
      case 'post':
        return 'Share your ideas, projects, and opportunities with the KolTech community. Make your voice heard.';
      case 'create_wall':
        return 'Create your own walls to build communities around specific topics, projects, or interests.';
      case 'join_wall':
        return 'Join walls to connect with like-minded professionals and stay updated on relevant discussions.';
      case 'report':
        return 'Help keep our community safe by reporting inappropriate content or behavior.';
      case 'kolophone':
        return 'Start video calls and conferences with up to 50+ participants for real-time collaboration.';
      case 'message':
        return 'Connect privately with other professionals. Build relationships and collaborate one-on-one.';
      default:
        return 'Join KolTech to access all features and connect with the professional community.';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-md bg-dark-800 rounded-2xl border border-primary-500/20 shadow-2xl">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-lg hover:bg-dark-700 transition-colors text-gray-400 hover:text-white z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center p-6 pb-4">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-primary-500 to-accent-purple rounded-full flex items-center justify-center mb-4">
            <Lock className="w-8 h-8 text-white" />
          </div>
          
          <h2 className="text-2xl font-bold text-white mb-2">
            Authentication Required
          </h2>
          
          <p className="text-gray-400 text-sm">
            To {getActionText()}, you need to be logged in
          </p>
        </div>

        {/* Content */}
        <div className="px-6 pb-6">
          <div className="bg-dark-700/50 rounded-xl p-4 mb-6">
            <p className="text-gray-300 text-sm leading-relaxed">
              {getDescription()}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              onClick={onLogin}
              className="w-full bg-gradient-to-r from-primary-500 to-accent-purple text-white py-3 px-4 rounded-xl font-medium hover:shadow-lg transition-all duration-300 flex items-center justify-center space-x-2"
            >
              <LogIn className="w-5 h-5" />
              <span>Log In to KolTech</span>
            </button>
            
            <button
              onClick={onRegister}
              className="w-full bg-dark-700 border border-dark-600 text-gray-300 py-3 px-4 rounded-xl font-medium hover:bg-dark-600 hover:text-white transition-all duration-300 flex items-center justify-center space-x-2"
            >
              <UserPlus className="w-5 h-5" />
              <span>Create Account</span>
            </button>
          </div>

          {/* Features Preview */}
          <div className="mt-6 pt-6 border-t border-dark-700">
            <p className="text-gray-400 text-xs text-center mb-3">
              Join KolTech for free and unlock:
            </p>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="text-gray-500">• Professional networking</div>
              <div className="text-gray-500">• Project collaboration</div>
              <div className="text-gray-500">• Video conferencing</div>
              <div className="text-gray-500">• Private messaging</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;