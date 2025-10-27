import React, { useRef, useState } from 'react';
import { Send, Paperclip, X, MessageCircle, Settings, UserPlus } from 'lucide-react';
import { FilePreview, ReplyToData, ReplyToCommentData, EditingMessageData, EditingCommentData, Wall } from '../../types/koltech-line';
import VideoUploadProgress from '../VideoUploadProgress';
import { useLinkPreview, LinkMetadata } from '../../hooks/useLinkPreview';
import { LinkPreviewInput } from '../LinkPreview';

interface MessageInputProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  onKeyPress: (e: React.KeyboardEvent) => void;
  
  // Link previews
  linkPreviews?: Map<string, LinkMetadata>;
  onRemoveLinkPreview?: (url: string) => void;
  
  // File upload
  selectedFiles: File[];
  filePreviews: FilePreview[];
  isDragging: boolean;
  fileInputRef: React.RefObject<HTMLInputElement>;
  onFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveFile: (index: number) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDragLeave: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent) => void;
  
  // State
  replyingTo: ReplyToData | null;
  replyingToComment: ReplyToCommentData | null;
  editingMessage: EditingMessageData | null;
  editingComment: EditingCommentData | null;
  currentWall: Wall | undefined;
  isLoggedIn: boolean;
  isMember: boolean;
  sendingMessage: boolean;
  
  // Video upload progress
  videoUploadProgress?: number;
  videoUploadStatus?: string;
  videoUploadThumbnail?: string | null;
  onCancelVideoUpload?: () => void;
  
  // Actions
  onCancelReply: () => void;
  onCancelEdit: () => void;
  onJoinWall: (wallId: string) => void;
  
  placeholder?: string;
}

const MessageInput: React.FC<MessageInputProps> = ({
  value,
  onChange,
  onSend,
  onKeyPress,
  selectedFiles,
  filePreviews,
  isDragging,
  fileInputRef,
  onFileSelect,
  onRemoveFile,
  onDragOver,
  onDragLeave,
  onDrop,
  replyingTo,
  replyingToComment,
  editingMessage,
  editingComment,
  currentWall,
  isLoggedIn,
  isMember,
  sendingMessage,
  videoUploadProgress,
  videoUploadStatus,
  videoUploadThumbnail,
  onCancelVideoUpload,
  onCancelReply,
  onCancelEdit,
  onJoinWall,
  placeholder,
  linkPreviews,
  onRemoveLinkPreview
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [hiddenPreviews, setHiddenPreviews] = useState<Set<string>>(new Set());

  // Фильтруем скрытые превью
  const visiblePreviews = linkPreviews 
    ? new Map(Array.from(linkPreviews.entries()).filter(([url]) => !hiddenPreviews.has(url)))
    : new Map();

  const handleRemovePreview = (url: string) => {
    setHiddenPreviews(prev => new Set(prev).add(url));
    onRemoveLinkPreview?.(url);
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value);
    // Auto-resize
    const target = e.target;
    target.style.height = 'auto';
    target.style.height = Math.min(target.scrollHeight, 80) + 'px';
  };

  return (
    <div className={`bg-gradient-to-r from-dark-800 via-dark-700 to-dark-800 border-t border-dark-600 fixed bottom-0 left-0 right-0 lg:right-80 z-10 shadow-2xl transition-all duration-300 ${
      isDragging ? '' : ''
    }`}>
      <div className="py-2 px-4">
        <div className="container mx-auto">
        <div
          className={`bg-gradient-to-br from-dark-700 to-dark-800 rounded-2xl p-2 border transition-all shadow-lg ${
            isDragging ? 'border-primary-500 bg-primary-500/5 shadow-primary-500/30' : 'border-dark-600'
          }`}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
        >
          {isDragging && (
            <div className="absolute inset-0 bg-gradient-to-br from-primary-500/20 to-accent-purple/20 border-2 border-primary-500 border-dashed rounded-2xl flex items-center justify-center z-10 backdrop-blur-sm">
              <div className="text-center">
                <Paperclip className="w-8 h-8 text-primary-400 mx-auto mb-1" />
                <p className="text-primary-400 text-sm font-medium">Drop files here</p>
              </div>
            </div>
          )}
          
          <div className="flex items-center space-x-2">
            <div className="flex-1">
              <textarea
                ref={textareaRef}
                value={value}
                onChange={handleTextChange}
                onKeyDown={onKeyPress}
                placeholder={
                  placeholder ||
                  (editingMessage ? 'Edit message...' :
                  replyingTo ? `Reply to ${replyingTo.username}...` :
                  `Message ${currentWall?.name}...`)
                }
                className="w-full bg-gradient-to-br from-dark-600 to-dark-700 border border-dark-500 text-white placeholder-gray-500 resize-none focus:outline-none focus:border-primary-500/50 min-h-[36px] max-h-[80px] overflow-y-auto scrollbar-hide rounded-xl px-3 py-2 text-sm transition-all"
                style={{ height: '36px' }}
              />
            </div>
            
            <div className="flex items-center space-x-1">
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*,video/*"
                onChange={onFileSelect}
                className="hidden"
              />
              
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={selectedFiles.length >= 15}
                className={`p-1.5 rounded-xl transition-all ${
                  selectedFiles.length >= 15
                    ? 'text-gray-600 cursor-not-allowed'
                    : 'text-gray-400 hover:text-white hover:bg-dark-600 border border-transparent hover:border-dark-500'
                }`}
                title={selectedFiles.length >= 15 ? 'Max files' : 'Attach'}
              >
                <Paperclip className="w-4 h-4" />
              </button>
              
              <button
                onClick={onSend}
                disabled={(!value.trim() && selectedFiles.length === 0) || sendingMessage}
                className={`p-2 rounded-xl transition-all ${
                  (value.trim() || selectedFiles.length > 0) && !sendingMessage
                    ? 'bg-gradient-to-r from-primary-500 to-accent-purple text-white hover:shadow-lg hover:shadow-primary-500/30'
                    : 'bg-dark-600 text-gray-500 cursor-not-allowed'
                }`}
              >
                {sendingMessage ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>
          
          {/* Link Previews */}
          {visiblePreviews.size > 0 && (
            <div className="mb-2">
              <LinkPreviewInput
                previews={visiblePreviews}
                onRemove={handleRemovePreview}
              />
            </div>
          )}

          {/* Reply to Comment Banner */}
          {replyingToComment && (
            <div className="mb-2 p-2 bg-gradient-to-r from-purple-500/10 to-purple-600/10 rounded-xl border-l-2 border-purple-400 shadow-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 flex-1 min-w-0">
                  <MessageCircle className="w-3 h-3 text-purple-400 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-purple-400 text-xs font-medium">
                      Reply to {replyingToComment.username}
                    </p>
                  </div>
                </div>
                <button
                  onClick={onCancelReply}
                  className="text-gray-400 hover:text-white transition-colors text-lg leading-none ml-2"
                >
                  ×
                </button>
              </div>
            </div>
          )}

          {/* Reply to Message Banner */}
          {replyingTo && !replyingToComment && (
            <div className="mb-2 p-2 bg-gradient-to-r from-blue-500/10 to-blue-600/10 rounded-xl border-l-2 border-blue-400 shadow-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 flex-1 min-w-0">
                  <MessageCircle className="w-3 h-3 text-blue-400 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-blue-400 text-xs font-medium">
                      {replyingTo.username}
                    </p>
                    <p className="text-gray-400 text-xs truncate">
                      {replyingTo.content}
                    </p>
                  </div>
                </div>
                <button
                  onClick={onCancelReply}
                  className="text-gray-400 hover:text-white transition-colors text-lg leading-none ml-2"
                >
                  ×
                </button>
              </div>
            </div>
          )}

          {/* Edit Comment Banner */}
          {editingComment && (
            <div className="mb-2 p-2 bg-gradient-to-r from-orange-500/10 to-orange-600/10 rounded-xl border-l-2 border-orange-400 shadow-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Settings className="w-3 h-3 text-orange-400" />
                  <p className="text-orange-400 text-xs font-medium">
                    Editing comment
                  </p>
                </div>
                <button
                  onClick={onCancelEdit}
                  className="text-gray-400 hover:text-white text-xs"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Edit Message Banner */}
          {editingMessage && !editingComment && (
            <div className="mb-2 p-2 bg-gradient-to-r from-yellow-500/10 to-yellow-600/10 rounded-xl border-l-2 border-yellow-400 shadow-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Settings className="w-3 h-3 text-yellow-400" />
                  <p className="text-yellow-400 text-xs font-medium">
                    Editing message
                  </p>
                </div>
                <button
                  onClick={onCancelEdit}
                  className="text-gray-400 hover:text-white text-xs"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Wall Membership Warning */}
          {isLoggedIn && currentWall && !isMember && (
            <div className="mb-2 p-2 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 rounded-xl border-l-2 border-yellow-400 shadow-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <UserPlus className="w-4 h-4 text-yellow-400" />
                  <p className="text-yellow-400 text-xs font-medium">Join to post</p>
                </div>
                <button
                  onClick={() => currentWall && onJoinWall(currentWall.id)}
                  className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-3 py-1 rounded-xl text-xs hover:shadow-lg hover:shadow-green-500/30 transition-all font-medium"
                >
                  Join
                </button>
              </div>
            </div>
          )}
          
          {/* Video Upload Progress */}
          {sendingMessage && videoUploadProgress !== undefined && videoUploadStatus && onCancelVideoUpload && (
            <div className="mb-2">
              <VideoUploadProgress
                progress={videoUploadProgress}
                status={videoUploadStatus}
                thumbnail={videoUploadThumbnail || undefined}
                onCancel={onCancelVideoUpload}
              />
            </div>
          )}

          {/* Selected Files Preview */}
          {filePreviews.length > 0 && !sendingMessage && (
            <div className="mb-2 p-2 bg-gradient-to-br from-dark-600 to-dark-700 rounded-xl border border-dark-500 shadow-lg">
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
                {filePreviews.map((preview, index) => (
                  <div key={index} className="relative group">
                    <div className="aspect-square rounded-xl overflow-hidden bg-gradient-to-br from-dark-700 to-dark-800 border border-dark-600 shadow-md">
                      {preview.type === 'image' ? (
                        <img
                          src={preview.preview}
                          alt={preview.file.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <video
                          src={preview.preview}
                          className="w-full h-full object-cover"
                          muted
                          playsInline
                        />
                      )}
                      
                      <button
                        onClick={() => onRemoveFile(index)}
                        className="absolute top-0.5 right-0.5 w-5 h-5 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-full text-xs hover:shadow-lg hover:shadow-red-500/50 transition-all flex items-center justify-center opacity-100 sm:opacity-0 sm:group-hover:opacity-100"
                      >
                        ×
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              
              {selectedFiles.length >= 15 && (
                <p className="text-yellow-400 text-xs mt-1">
                  Max 15 files
                </p>
              )}
            </div>
          )}
        </div>
        </div>
      </div>
    </div>
  );
};

export default MessageInput;
