import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Heart,
  MessageCircle,
  MoreHorizontal,
  Pin,
  Settings,
  Flag,
  Phone,
  UserPlus,
  Share2
} from 'lucide-react';
import { Message } from '../../types/koltech-line';
import { formatTime } from '../../utils/koltech-line/wallHelpers';
import { reactionEmojis } from '../../utils/koltech-line/constants';
import ImageCarousel from '../ImageCarousel';

interface MessageCardProps {
  message: Message;
  currentUserId?: string;
  isLoggedIn: boolean;
  
  // Actions
  onLike: (messageId: string) => void;
  onComment: (messageId: string) => void;
  onEdit: (message: Message) => void;
  onDelete: (messageId: string) => void;
  onReport: (messageId: string) => void;
  onReaction: (messageId: string, emoji: string) => void;
  onStartChat: (userId: string) => void;
  onAddContact: (userId: string) => void;
  onToggleReplies: (messageId: string) => void;
  onImageClick: (message: Message, imageIndex: number) => void;
  
  // State
  showReactionPicker: boolean;
  onShowReactionPicker: (show: boolean) => void;
  isHoveringComments: boolean;
  
  // Children (for replies)
  children?: React.ReactNode;
}

const MessageCard: React.FC<MessageCardProps> = ({
  message,
  currentUserId,
  isLoggedIn,
  onLike,
  onComment,
  onEdit,
  onDelete,
  onReport,
  onReaction,
  onStartChat,
  onAddContact,
  onToggleReplies,
  onImageClick,
  showReactionPicker,
  onShowReactionPicker,
  isHoveringComments,
  children
}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const isOwnMessage = currentUserId && message.userId === currentUserId;

  return (
    <div
      className={`group relative rounded-2xl transition-all duration-200 shadow-lg hover:shadow-xl ${
        isOwnMessage
          ? 'bg-gradient-to-br from-primary-500/15 to-accent-purple/15 border border-primary-500/40 hover:border-primary-500/60 hover:shadow-primary-500/20'
          : 'bg-gradient-to-br from-dark-800 to-dark-700 border border-dark-600 hover:border-primary-500/30 hover:shadow-dark-900/50'
      }`}
      onMouseEnter={() => {
        if (!isHoveringComments) {
          onShowReactionPicker(true);
        }
      }}
      onMouseLeave={() => onShowReactionPicker(false)}
    >
      {/* Message Header */}
      <div className="flex items-start space-x-2.5 p-3 pb-2 rounded-t-2xl overflow-hidden">
        <Link to={`/user/${message.userId}`} className="flex-shrink-0">
          <img
            src={message.avatar}
            alt={message.username}
            className="w-8 h-8 rounded-full object-cover border-2 border-transparent hover:border-primary-500/50 transition-colors"
          />
        </Link>
        
        <div className="flex-1 min-w-0">
          {/* Name and Time in ONE line - Telegram style */}
          <div className="flex items-center space-x-2 mb-0.5">
            <Link to={`/user/${message.userId}`} className="group flex-shrink-0">
              <h3 className="text-white font-medium text-sm group-hover:text-primary-400 transition-colors">
                {message.username}
              </h3>
            </Link>
            <span className="text-gray-500 text-xs flex-shrink-0">
              {formatTime(message.timestamp)}
            </span>
            {message.isEdited && (
              <span className="text-xs text-gray-500 flex-shrink-0">edited</span>
            )}
            {message.isPinned && (
              <Pin className="w-3 h-3 text-primary-400 flex-shrink-0" />
            )}
          </div>

          {/* Message Content */}
          {message.content && (
            <p className="text-gray-300 leading-relaxed text-sm whitespace-pre-wrap break-words mt-0.5">
              {message.content}
            </p>
          )}
        </div>
      </div>
      
      {/* 🎨 ИСПРАВЛЕННОЕ ОТОБРАЖЕНИЕ ФОТО - Attachments Carousel */}
      {message.attachments && message.attachments.length > 0 && (
        <div className="overflow-hidden">
          <ImageCarousel
            attachments={message.attachments
              .filter(att => 
                att.type === 'image' || att.type === 'video' || att.type === 'gif' || att.type === 'sticker'
              )
              .map(att => ({
                type: att.type as 'image' | 'video' | 'gif' | 'sticker',
                url: att.url,
                filename: att.filename
              }))}
            onImageClick={(index) => onImageClick(message, index)}
          />
        </div>
      )}

      {/* Tags */}
      {message.tags && message.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 px-3 pt-2 overflow-hidden">
          {message.tags.map(tag => (
            <span
              key={tag}
              className="bg-dark-700 text-gray-400 px-2 py-0.5 rounded text-xs hover:bg-primary-500 hover:text-white transition-colors cursor-pointer"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* Message Footer - Reactions */}
      <div className="px-3 pb-3 pt-2 rounded-b-2xl">
        <div className="relative flex items-center gap-1.5 flex-wrap min-h-[20px]">
          {message.reactions && Object.entries(message.reactions).map(([emoji, data]) => (
            <div 
              key={emoji}
              className="flex items-center bg-dark-700/50 rounded-full px-2 py-0.5 cursor-pointer hover:bg-dark-700 transition-colors text-xs"
              onClick={() => onShowReactionPicker(!showReactionPicker)}
            >
              <span className="text-base">{emoji}</span>
              <span className="text-gray-400 ml-1 font-medium">{data.count}</span>
            </div>
          ))}
          
          {message.replies > 0 && (
            <button
              onClick={() => onToggleReplies(message.id)}
              className="text-xs text-blue-400 hover:text-blue-300 transition-colors flex items-center space-x-1 px-2 py-0.5 rounded-full hover:bg-dark-700/50"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span className="font-medium">{message.replies}</span>
            </button>
          )}
          
          {/* Reaction Picker - показывается всегда при наведении */}
          {showReactionPicker && !isHoveringComments && (
            <div className="absolute left-0 top-full mt-1 bg-dark-700 border border-dark-600 rounded-full px-2 py-1.5 shadow-xl flex items-center gap-1 animate-scale-in z-10">
              {reactionEmojis.map((emoji) => (
                <button
                  key={emoji}
                  onClick={(e) => {
                    e.stopPropagation();
                    onReaction(message.id, emoji);
                  }}
                  className={`text-lg hover:scale-110 transition-transform p-1 ${
                    message.userReaction === emoji ? 'scale-105' : ''
                  }`}
                  title={emoji}
                >
                  {emoji}
                </button>
              ))}
            </div>
          )}
        </div>
        
        {/* Replies Section */}
        {children}
      </div>
      
      {/* Hover Actions Menu */}
      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={(e) => {
            e.stopPropagation();
            setMenuOpen(!menuOpen);
          }}
          className="p-1.5 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-dark-700"
        >
          <MoreHorizontal className="w-4 h-4" />
        </button>
        
        {menuOpen && (
          <div className="absolute right-0 top-full mt-1 w-48 bg-dark-700 border border-dark-600 rounded-xl shadow-2xl z-[100] overflow-hidden">
            <button
              onClick={() => {
                onComment(message.id);
                setMenuOpen(false);
              }}
              className="w-full text-left px-3 py-2 text-gray-300 hover:bg-dark-600 hover:text-white transition-colors flex items-center space-x-2 text-sm"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Reply</span>
            </button>
            
            {isLoggedIn && isOwnMessage && (
              <>
                <button
                  onClick={() => {
                    onEdit(message);
                    setMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 text-gray-300 hover:bg-dark-600 hover:text-white transition-colors flex items-center space-x-2 text-sm"
                >
                  <Settings className="w-4 h-4" />
                  <span>Edit</span>
                </button>
                
                <button
                  onClick={() => {
                    onDelete(message.id);
                    setMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors flex items-center space-x-2 text-sm"
                >
                  <Flag className="w-4 h-4" />
                  <span>Delete</span>
                </button>
              </>
            )}
            
            {isLoggedIn && !isOwnMessage && (
              <>
                <button
                  onClick={() => {
                    onStartChat(message.userId);
                    setMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 text-gray-300 hover:bg-dark-600 hover:text-white transition-colors flex items-center space-x-2 text-sm"
                >
                  <Phone className="w-4 h-4" />
                  <span>Message</span>
                </button>
                
                <button
                  onClick={() => {
                    onAddContact(message.userId);
                    setMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 text-gray-300 hover:bg-dark-600 hover:text-white transition-colors flex items-center space-x-2 text-sm"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Add Contact</span>
                </button>
                
                <button
                  onClick={() => {
                    onReport(message.id);
                    setMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors flex items-center space-x-2 text-sm"
                >
                  <Flag className="w-4 h-4" />
                  <span>Report</span>
                </button>
              </>
            )}
            
            <div className="border-t border-dark-600"></div>
            <button
              onClick={() => setMenuOpen(false)}
              className="w-full text-left px-3 py-2 text-gray-300 hover:bg-dark-600 hover:text-white transition-colors flex items-center space-x-2 text-sm"
            >
              <Share2 className="w-4 h-4" />
              <span>Share</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageCard;
