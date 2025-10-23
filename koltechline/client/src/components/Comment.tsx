import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MessageCircle, MoreHorizontal, Settings, Flag, Phone, UserPlus } from 'lucide-react';

interface CommentProps {
  comment: {
    id: string;
    userId: string;
    username: string;
    avatar: string;
    content: string;
    timestamp: Date;
    isEdited?: boolean;
    editedAt?: Date;
    reactions?: {
      [emoji: string]: {
        count: number;
        users: string[];
      };
    };
    userReaction?: string;
    nestedReplies?: any[];
  };
  parentMessageId: string;
  currentUserId?: string;
  isLoggedIn: boolean;
  level?: number;
  highlightedCommentId?: string | null;
  onReply: (commentId: string, username: string) => void;
  onEdit: (comment: any) => void;
  onDelete: (commentId: string) => void;
  onReaction: (commentId: string, emoji: string) => void;
  onStartChat: (userId: string) => void;
  onAddContact: (userId: string) => void;
  onReport: (commentId: string) => void;
  formatTime: (date: Date) => string;
}

const Comment: React.FC<CommentProps> = ({
  comment,
  parentMessageId,
  currentUserId,
  isLoggedIn,
  level = 0,
  highlightedCommentId,
  onReply,
  onEdit,
  onDelete,
  onReaction,
  onStartChat,
  onAddContact,
  onReport,
  formatTime
}) => {
  const [showReactionPicker, setShowReactionPicker] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const hasNestedReplies = comment.nestedReplies && comment.nestedReplies.length > 0;
  const [showNestedReplies, setShowNestedReplies] = useState(false);
  const isOwnComment = currentUserId && comment.userId === currentUserId;
  const maxLevel = 3; // Максимальная глубина вложенности
  const nestedRepliesCount = comment.nestedReplies?.length || 0;

  // Автоматически раскрываем nestedReplies если внутри есть подсвеченный комментарий
  useEffect(() => {
    if (highlightedCommentId && comment.nestedReplies && comment.nestedReplies.length > 0) {
      // Рекурсивная проверка: есть ли подсвеченный комментарий в дереве вложенных ответов
      const hasHighlightedNested = (replies: any[]): boolean => {
        for (const reply of replies) {
          if (reply.id === highlightedCommentId) return true;
          if (reply.nestedReplies && reply.nestedReplies.length > 0) {
            if (hasHighlightedNested(reply.nestedReplies)) return true;
          }
        }
        return false;
      };
      
      if (hasHighlightedNested(comment.nestedReplies)) {
        setShowNestedReplies(true);
      }
    }
  }, [highlightedCommentId, comment.nestedReplies]);

  return (
    <div className={`${level > 0 ? 'ml-4 pl-4 border-l-2 border-primary-500/30' : ''}`} id={`comment-${comment.id}`}>
      <div
        className={`group relative rounded-xl p-3 transition-all ${
          highlightedCommentId === comment.id
            ? 'bg-gradient-to-br from-primary-500/20 to-accent-purple/20 border-2 border-primary-500 animate-pulse'
            : isOwnComment
            ? 'bg-gradient-to-br from-primary-500/10 to-accent-purple/10 border border-primary-500/30 hover:border-primary-500/50'
            : 'bg-dark-700/50 border border-dark-600 hover:border-primary-500/30'
        }`}
        onMouseEnter={() => setShowReactionPicker(true)}
        onMouseLeave={() => setShowReactionPicker(false)}
      >
        <div className="flex items-start space-x-2 mb-2">
          <Link to={`/user/${comment.userId}`} className="flex-shrink-0">
            <img
              src={comment.avatar}
              alt={comment.username}
              className="w-7 h-7 rounded-full object-cover border-2 border-transparent hover:border-primary-500/50 transition-colors"
            />
          </Link>
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 mb-1">
              <Link to={`/user/${comment.userId}`}>
                <span className="text-white text-sm font-medium hover:text-primary-400 transition-colors">
                  {comment.username}
                </span>
              </Link>
              <span className="text-gray-500 text-xs">
                {formatTime(comment.timestamp)}
              </span>
              {comment.isEdited && (
                <span className="text-xs text-gray-500">edited</span>
              )}
            </div>
            <p className="text-gray-300 text-sm leading-relaxed">{comment.content}</p>

            {/* Comment Reactions and Replies Counter */}
            <div className="relative">
              {((comment.reactions && Object.keys(comment.reactions).length > 0) || hasNestedReplies) && (
                <div className="flex items-center gap-1.5 flex-wrap mt-2">
                  {/* Reactions */}
                  {comment.reactions && Object.entries(comment.reactions).map(([emoji, data]) => (
                    <div
                      key={emoji}
                      className="flex items-center bg-dark-600/50 rounded-full px-1.5 py-0.5 cursor-pointer hover:bg-dark-600 transition-colors text-xs"
                      onClick={() => onReaction(comment.id, emoji)}
                    >
                      <span>{emoji}</span>
                      <span className="text-gray-400 ml-1">{data.count}</span>
                    </div>
                  ))}
                  
                  {/* Nested Replies Counter */}
                  {hasNestedReplies && (
                    <button
                      onClick={() => setShowNestedReplies(!showNestedReplies)}
                      className="text-xs text-blue-400 hover:text-blue-300 transition-colors flex items-center space-x-1 px-1.5"
                    >
                      <MessageCircle className="w-3 h-3" />
                      <span>{nestedRepliesCount}</span>
                    </button>
                  )}
                </div>
              )}

              {/* Comment Reaction Picker - Под текстом, как у сообщений */}
              {showReactionPicker && (
                <div className="absolute left-0 top-full mt-1 bg-dark-700 border border-dark-600 rounded-full px-2 py-1.5 shadow-xl flex items-center gap-1 animate-scale-in z-50">
                  {['❤️', '👍', '😂', '😮', '😢', '🔥'].map((emoji) => (
                    <button
                      key={emoji}
                      onClick={(e) => {
                        e.stopPropagation();
                        onReaction(comment.id, emoji);
                      }}
                      className={`text-lg hover:scale-110 transition-transform p-1 ${
                        comment.userReaction === emoji ? 'scale-105' : ''
                      }`}
                      title={emoji}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Comment Context Menu */}
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
              {level < maxLevel && (
                <button
                  onClick={() => {
                    onReply(comment.id, comment.username);
                    setMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 text-gray-300 hover:bg-dark-600 hover:text-white transition-colors flex items-center space-x-2 text-sm"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Reply</span>
                </button>
              )}

              {isLoggedIn && isOwnComment && (
                <>
                  <button
                    onClick={() => {
                      onEdit(comment);
                      setMenuOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 text-gray-300 hover:bg-dark-600 hover:text-white transition-colors flex items-center space-x-2 text-sm"
                  >
                    <Settings className="w-4 h-4" />
                    <span>Edit</span>
                  </button>

                  <button
                    onClick={() => {
                      onDelete(comment.id);
                      setMenuOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors flex items-center space-x-2 text-sm"
                  >
                    <Flag className="w-4 h-4" />
                    <span>Delete</span>
                  </button>
                </>
              )}

              {isLoggedIn && !isOwnComment && (
                <>
                  <button
                    onClick={() => {
                      onStartChat(comment.userId);
                      setMenuOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 text-gray-300 hover:bg-dark-600 hover:text-white transition-colors flex items-center space-x-2 text-sm"
                  >
                    <Phone className="w-4 h-4" />
                    <span>Message</span>
                  </button>

                  <button
                    onClick={() => {
                      onAddContact(comment.userId);
                      setMenuOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 text-gray-300 hover:bg-dark-600 hover:text-white transition-colors flex items-center space-x-2 text-sm"
                  >
                    <UserPlus className="w-4 h-4" />
                    <span>Add Contact</span>
                  </button>

                  <button
                    onClick={() => {
                      onReport(comment.id);
                      setMenuOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors flex items-center space-x-2 text-sm"
                  >
                    <Flag className="w-4 h-4" />
                    <span>Report</span>
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Nested Replies - Recursive - Показываем только когда showNestedReplies === true */}
      {showNestedReplies && comment.nestedReplies && comment.nestedReplies.length > 0 && level < maxLevel && (
        <div className="mt-3 space-y-3">
          {comment.nestedReplies.map((nestedReply) => (
              <Comment
                key={nestedReply.id}
                comment={nestedReply}
                parentMessageId={parentMessageId}
                currentUserId={currentUserId}
                isLoggedIn={isLoggedIn}
                level={level + 1}
                highlightedCommentId={highlightedCommentId}
                onReply={onReply}
                onEdit={onEdit}
                onDelete={onDelete}
                onReaction={onReaction}
                onStartChat={onStartChat}
                onAddContact={onAddContact}
                onReport={onReport}
                formatTime={formatTime}
              />
          ))}
        </div>
      )}
    </div>
  );
};

export default Comment;
