import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { X } from 'lucide-react';

// Hooks
import { useAuth } from '../hooks/useAuth';
import { useSocket } from '../hooks/useSocket';
import { useToast } from '../hooks/useToast';
import { useModalStore } from '../store/modalStore';

// New modular hooks
import { useWalls } from '../hooks/koltech-line/useWalls';
import { useMessages } from '../hooks/koltech-line/useMessages';
import { useFileUpload } from '../hooks/koltech-line/useFileUpload';
import { useMessageActions } from '../hooks/koltech-line/useMessageActions';
import { useCommentActions } from '../hooks/koltech-line/useCommentActions';

// New modular components
import Header from '../components/Header';
import WallHeader from '../components/koltech-line/WallHeader';
import WallsList from '../components/koltech-line/WallsList';
import WallSidebar from '../components/koltech-line/WallSidebar';
import EmptyWallState from '../components/koltech-line/EmptyWallState';
import MessageInput from '../components/koltech-line/MessageInput';
import MessageCard from '../components/koltech-line/MessageCard';
import MessageSkeleton from '../components/koltech-line/MessageSkeleton';
import CommentSkeleton from '../components/koltech-line/CommentSkeleton';
import Comment from '../components/Comment';

// Modals
import AuthModal from '../components/ui/AuthModal';
import CreateWallModal from '../components/ui/CreateWallModal';
import ImageGalleryModal from '../components/ui/ImageGalleryModal';
import Toast from '../components/ui/Toast';

// Utils & Types
import { categories } from '../utils/koltech-line/constants';
import { wallApi, chatApi, contactApi, kolophoneApi } from '../utils/api';
import type { Message, ReplyToData, ReplyToCommentData, EditingMessageData, EditingCommentData, ImageGalleryModalData } from '../types/koltech-line';

const KolTechLineNew = () => {
  const navigate = useNavigate();
  const { wallId } = useParams<{ wallId?: string }>();
  const { isLoggedIn, canCreatePosts, canLikeContent, canCommentOnContent, canCreateWalls, user } = useAuth();
  const { showAuthModal, authAction, showCreateWallModal, setShowAuthModal, setShowCreateWallModal } = useModalStore();
  const { toasts, showSuccess, showError, showWarning, showInfo, removeToast } = useToast();
  const { socket, joinWall, isConnected, subscribeToEvents, joinNotifications } = useSocket();

  // Use our new modular hooks
  const wallsHook = useWalls({ userId: user?._id, selectedCategory: 'all' });
  const messagesHook = useMessages({ wallId: wallId || '', userId: user?._id });
  const fileUploadHook = useFileUpload((msg) => showWarning(msg));
  const messageActionsHook = useMessageActions({ userId: user?._id, onSuccess: showSuccess, onError: showError });
  const commentActionsHook = useCommentActions({ userId: user?._id, onError: showError });

  // Local UI state
  const [newMessage, setNewMessage] = useState('');
  const [showWalls, setShowWalls] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [wallSearchQuery, setWallSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [replyingTo, setReplyingTo] = useState<ReplyToData | null>(null);
  const [replyingToComment, setReplyingToComment] = useState<ReplyToCommentData | null>(null);
  const [editingMessage, setEditingMessage] = useState<EditingMessageData | null>(null);
  const [editingComment, setEditingComment] = useState<EditingCommentData | null>(null);
  const [imageGalleryModal, setImageGalleryModal] = useState<ImageGalleryModalData | null>(null);
  const [showReactionPicker, setShowReactionPicker] = useState<string | null>(null);
  const [isHoveringComments, setIsHoveringComments] = useState<string | null>(null);

  const currentWall = wallsHook.allWalls.find(w => w.id === wallId);

  // Socket integration
  useEffect(() => {
    if (isConnected && socket) {
      subscribeToEvents({
        onMessageReceived: (data: any) => {
          if (data.message && data.wallId === wallId && data.message.author._id !== user?._id) {
            const newMsg: Message = {
              id: data.message._id,
              userId: data.message.author._id,
              username: `${data.message.author.firstName} ${data.message.author.lastName}`,
              avatar: data.message.author.avatar ? `http://localhost:5005${data.message.author.avatar}` : '',
              content: data.message.content,
              timestamp: new Date(data.message.createdAt),
              attachments: (data.message.attachments || []).filter((att: any) => 
                att.type === 'image' || att.type === 'video' || att.type === 'gif' || att.type === 'sticker'
              ),
              likes: data.message.likesCount || 0,
              replies: data.message.repliesCount || 0,
              tags: data.message.tags || [],
              isLiked: false,
              isPinned: data.message.isPinned || false
            };
            messagesHook.addMessage(newMsg);
          }
        },
        onCallReceived: (data: any) => {
          if (data.type === 'incoming_call') {
            showInfo(`📞 Incoming call from ${data.caller.name}`);
          }
        }
      });

      joinNotifications();
    }
  }, [isConnected, socket]);

  // Join wall via socket
  useEffect(() => {
    if (wallId && isConnected) {
      joinWall(wallId);
    }
  }, [wallId, isConnected]);

  // Handlers
  const handleSendMessage = async () => {
    if (editingComment) {
      await commentActionsHook.createComment(
        replyingToComment!.parentMessageId,
        newMessage.trim(),
        replyingToComment!.commentId,
        []
      );
      setNewMessage('');
      setEditingComment(null);
      setReplyingToComment(null);
      return;
    }

    if (editingMessage) {
      await messageActionsHook.handleEditMessage(editingMessage.id, newMessage, messagesHook.updateMessage);
      setNewMessage('');
      setEditingMessage(null);
      return;
    }

    if (replyingToComment) {
      await commentActionsHook.createComment(
        replyingToComment.parentMessageId,
        newMessage.trim(),
        replyingToComment.commentId,
        []
      );
      setNewMessage('');
      setReplyingToComment(null);
      return;
    }

    if (replyingTo) {
      await commentActionsHook.createComment(replyingTo.messageId, newMessage.trim());
      setNewMessage('');
      setReplyingTo(null);
      return;
    }

    if (!isLoggedIn()) {
      setShowAuthModal(true, 'post');
      return;
    }

    if (!newMessage.trim() && fileUploadHook.selectedFiles.length === 0) {
      showWarning('Please add text or files');
      return;
    }

    if (!wallId) {
      showWarning('Please select a wall');
      return;
    }

    if (currentWall && !currentWall.isMember) {
      showWarning('Join this wall before posting');
      return;
    }

    const realMessage = await messageActionsHook.handleSendMessage(
      { content: newMessage, wallId, attachments: [], tags: [] },
      fileUploadHook.selectedFiles,
      messagesHook.addMessage
    );

    if (realMessage) {
      messagesHook.updateMessage(realMessage.id, realMessage);
      setNewMessage('');
      fileUploadHook.clearFiles();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleJoinWall = async (wallId: string) => {
    if (!isLoggedIn()) {
      setShowAuthModal(true, 'join_wall');
      return;
    }

    try {
      await wallApi.joinWall(wallId);
      wallsHook.joinWall(wallId);
      showSuccess(`Welcome! You can now post and interact.`);
    } catch (error: any) {
      if (error.message.includes('approval')) {
        showWarning('Request submitted for approval');
      } else {
        showError(`Error joining wall: ${error.message}`);
      }
    }
  };

  const handleCreateWall = () => {
    if (!canCreateWalls()) {
      setShowAuthModal(true, 'create_wall');
      return;
    }
    setShowCreateWallModal(true);
  };

  const handleWallSubmit = async (wallData: any) => {
    try {
      const response = await wallApi.createWall(wallData);
      const newWall = {
        id: response.data.wall._id,
        name: response.data.wall.name,
        description: response.data.wall.description,
        icon: () => null,
        color: 'from-primary-500 to-accent-purple',
        participants: response.data.wall.memberCount,
        category: response.data.wall.category,
        isActive: true
      };
      wallsHook.addWall(newWall);
      navigate(`/koltech-line/${newWall.id}`);
    } catch (error) {
      showError('Error creating wall');
    }
  };

  return (
    <>
      <div className="min-h-screen bg-dark-900 flex flex-col">
        <Header 
          activeWall={currentWall} 
          showWalls={showWalls}
          setShowWalls={setShowWalls}
          wallsCount={wallsHook.walls.length}
          loadingWalls={wallsHook.loadingWalls}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          categories={categories}
        />
        
        <div className="flex-1">
          {/* Walls list overlay */}
          {showWalls && (
            <div 
              className="fixed inset-0 bg-dark-900/60 backdrop-blur-sm z-10"
              onClick={() => setShowWalls(false)}
            />
          )}

          {/* Walls List Panel */}
          <div className={`bg-gradient-to-r from-dark-800 via-dark-700 to-dark-800 transition-all duration-300 fixed top-16 left-0 right-0 lg:right-80 z-20 ${
            showWalls ? 'opacity-100 h-[370px] shadow-2xl shadow-dark-900/50' : 'opacity-0 h-0 overflow-hidden'
          }`}>
            <div className="container mx-auto px-4 py-3">
              {showWalls && (
                <WallsList
                  walls={wallsHook.walls}
                  activeWallId={wallId}
                  loadingWalls={wallsHook.loadingWalls}
                  selectedCategory={selectedCategory}
                  categories={categories}
                  onCategoryChange={(cat) => {
                    setSelectedCategory(cat);
                    wallsHook.loadWalls(cat);
                  }}
                  onClose={() => setShowWalls(false)}
                  searchQuery={wallSearchQuery}
                  onSearchChange={setWallSearchQuery}
                  isSearchFocused={isSearchFocused}
                  onSearchFocus={setIsSearchFocused}
                />
              )}
            </div>
          </div>

          {/* Main content */}
          <div className="flex-1 flex w-full">
            <div className="flex-1 flex flex-col lg:pr-80">
              {!wallId ? (
                <EmptyWallState 
                  onShowWalls={() => setShowWalls(true)}
                  onCreateWall={handleCreateWall}
                />
              ) : (
                <>
                  {/* Wall Header - Fixed */}
                  <div className={`bg-gradient-to-r from-dark-800 via-dark-700 to-dark-800 p-4 fixed left-0 right-0 lg:right-80 z-30 border-b border-dark-600 shadow-lg backdrop-blur-sm transition-all duration-300 ${
                    showWalls ? 'top-[436px] blur-sm opacity-60 pointer-events-none' : 'top-16'
                  }`}>
                    <div className="container mx-auto">
                      <WallHeader 
                        currentWall={currentWall}
                        isLoggedIn={isLoggedIn()}
                        onJoinWall={handleJoinWall}
                        onStartKolophone={() => {}}
                      />
                    </div>
                  </div>
                  
                  {/* Messages */}
                  <div className={`flex-1 overflow-y-auto p-6 pb-40 container mx-auto relative transition-all duration-300 ${
                    showWalls ? 'pt-[654px] blur-sm opacity-60 pointer-events-none' : 'pt-44'
                  }`}>
                    <div className="max-w-3xl mx-auto space-y-6">
                      {messagesHook.loading ? (
                        <>
                          {[...Array(3)].map((_, i) => (
                            <MessageSkeleton key={i} />
                          ))}
                        </>
                      ) : (
                        <>
                        {messagesHook.messages.map((message) => (
                          <MessageCard
                            key={message.id}
                            message={message}
                            currentUserId={user?._id}
                            isLoggedIn={isLoggedIn()}
                            onLike={(id) => messageActionsHook.handleLike(id, message, messagesHook.updateMessage)}
                            onComment={(id) => {
                              setReplyingTo({ messageId: id, username: message.username, content: message.content });
                            }}
                            onEdit={(msg) => {
                              setEditingMessage({ id: msg.id, content: msg.content });
                              setNewMessage(msg.content);
                            }}
                            onDelete={(id) => messageActionsHook.handleDeleteMessage(id, messagesHook.removeMessage)}
                            onReport={(id) => messageActionsHook.handleReport(id, 'Inappropriate content')}
                            onReaction={(id, emoji) => messageActionsHook.handleReaction(id, emoji, message, messagesHook.updateMessage)}
                            onStartChat={(userId) => chatApi.createPrivateChat(userId).then(r => navigate(`/chat/${r.data.chat._id}`))}
                            onAddContact={(userId) => contactApi.sendRequest(userId)}
                            onToggleReplies={commentActionsHook.toggleReplies}
                            onImageClick={(msg, idx) => setImageGalleryModal({
                              isOpen: true,
                              images: msg.attachments!
                                .filter(a => a.type === 'image' || a.type === 'video' || a.type === 'gif' || a.type === 'sticker')
                                .map(a => ({ 
                                  url: a.url, 
                                  filename: a.filename, 
                                  type: (a.type === 'gif' || a.type === 'sticker' ? 'image' : a.type) as 'image' | 'video'
                                })),
                              initialIndex: idx,
                              author: { username: msg.username, avatar: msg.avatar }
                            })}
                            showReactionPicker={showReactionPicker === message.id}
                            onShowReactionPicker={(show) => setShowReactionPicker(show ? message.id : null)}
                            isHoveringComments={isHoveringComments === message.id}
                          >
                            {commentActionsHook.expandedReplies.has(message.id) && (
                              <div 
                                className="mt-4 ml-4 pl-4 border-l-2 border-primary-500/30 space-y-3"
                                onMouseEnter={() => setIsHoveringComments(message.id)}
                                onMouseLeave={() => setIsHoveringComments(null)}
                              >
                                {commentActionsHook.loadingReplies.has(message.id) ? (
                                  <>
                                    {[...Array(2)].map((_, i) => (
                                      <CommentSkeleton key={`comment-loading-${i}`} />
                                    ))}
                                  </>
                                ) : (
                                  commentActionsHook.messageReplies[message.id]?.map((comment) => (
                                  <Comment
                                    key={comment.id}
                                    comment={comment as any}
                                    parentMessageId={message.id}
                                    currentUserId={user?._id}
                                    isLoggedIn={isLoggedIn()}
                                    level={0}
                                    highlightedCommentId={commentActionsHook.highlightedCommentId}
                                    onReply={(cId, username) => {
                                      setReplyingToComment({ commentId: cId, username, parentMessageId: message.id });
                                      setNewMessage(`@${username} `);
                                    }}
                                    onEdit={(c) => {
                                      setEditingComment({ id: c.id, content: c.content });
                                      setNewMessage(c.content);
                                    }}
                                    onDelete={() => {}}
                                    onReaction={(cId, emoji) => commentActionsHook.handleCommentReaction(cId, emoji, message.id)}
                                    onStartChat={(userId) => chatApi.createPrivateChat(userId).then(r => navigate(`/chat/${r.data.chat._id}`))}
                                    onAddContact={(userId) => contactApi.sendRequest(userId)}
                                    onReport={() => {}}
                                    onImageClick={(comment, idx) => setImageGalleryModal({
                                      isOpen: true,
                                      images: comment.attachments!
                                        .filter((a: any) => a.type === 'image' || a.type === 'video' || a.type === 'gif' || a.type === 'sticker')
                                        .map((a: any) => ({ 
                                          url: a.url, 
                                          filename: a.filename, 
                                          type: (a.type === 'gif' || a.type === 'sticker' ? 'image' : a.type) as 'image' | 'video'
                                        })),
                                      initialIndex: idx,
                                      author: { username: comment.username, avatar: comment.avatar }
                                    })}
                                    formatTime={(date) => {
                                      const diff = Date.now() - date.getTime();
                                      const mins = Math.floor(diff / 60000);
                                      if (mins < 1) return 'now';
                                      if (mins < 60) return `${mins}m`;
                                      return `${Math.floor(mins / 60)}h`;
                                    }}
                                  />
                                ))
                                )}
                              </div>
                            )}
                          </MessageCard>
                        ))}
                        
                        {/* Loading More Skeletons */}
                        {messagesHook.loadingMore && (
                          <>
                            {[...Array(2)].map((_, i) => (
                              <MessageSkeleton key={`loading-${i}`} />
                            ))}
                          </>
                        )}
                        
                        {/* Load More Messages Button */}
                        {messagesHook.hasMoreMessages && messagesHook.messages.length > 0 && !messagesHook.loadingMore && (
                          <div className="flex justify-center mt-8 mb-4">
                            <button
                              onClick={() => messagesHook.loadMoreMessages()}
                              disabled={messagesHook.loadingMore}
                              className="bg-gradient-to-r from-dark-700 to-dark-800 border border-dark-600 text-gray-300 px-6 py-3 rounded-xl hover:bg-dark-600 hover:border-primary-500/50 transition-all flex items-center space-x-2 group disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                            >
                              {messagesHook.loadingMore ? (
                                <>
                                  <div className="w-5 h-5 border-2 border-gray-400/30 border-t-gray-400 rounded-full animate-spin"></div>
                                  <span>Loading...</span>
                                </>
                              ) : (
                                <>
                                  <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                  </svg>
                                  <span className="font-medium">Load More Messages</span>
                                </>
                              )}
                            </button>
                          </div>
                        )}
                        </>
                      )}
                    </div>
                  </div>
                  
                </>
              )}
            </div>

            {/* Sidebar */}
            <WallSidebar
              currentWall={currentWall}
              messagesCount={messagesHook.messages.length}
              isLoggedIn={isLoggedIn()}
              popularTags={['React', 'Node.js', 'Python', 'AI/ML', 'Blockchain', 'Mobile', 'UI/UX', 'DevOps', 'Startup', 'Funding']}
              selectedTags={selectedTags}
              onToggleTag={(tag) => {
                setSelectedTags(prev => 
                  prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
                );
              }}
              onCreateWall={handleCreateWall}
              onStartKolophone={() => {
                if (!isLoggedIn()) {
                  setShowAuthModal(true, 'kolophone');
                  return;
                }
                kolophoneApi.startCall({ type: 'wall', targetId: wallId! })
                  .then(() => showSuccess('Call started!'))
                  .catch(() => showError('Error starting call'));
              }}
              onJoinWall={handleJoinWall}
              onLeaveWall={async (wId) => {
                if (window.confirm('Leave this wall?')) {
                  try {
                    await wallApi.leaveWall(wId);
                    wallsHook.leaveWall(wId);
                    showInfo('You have left the wall');
                  } catch (error: any) {
                    showError(`Error leaving wall: ${error.message}`);
                  }
                }
              }}
            />
          </div>
        </div>
      </div>

      {/* Modals */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        action={authAction}
        onLogin={() => navigate('/auth')}
        onRegister={() => navigate('/register')}
      />

      <CreateWallModal
        isOpen={showCreateWallModal}
        onClose={() => setShowCreateWallModal(false)}
        onSubmit={handleWallSubmit}
      />

      {imageGalleryModal?.isOpen && (
        <ImageGalleryModal
          isOpen={true}
          onClose={() => setImageGalleryModal(null)}
          images={imageGalleryModal.images}
          initialIndex={imageGalleryModal.initialIndex}
          author={imageGalleryModal.author}
          onDownloadSuccess={() => showSuccess('Downloaded!')}
        />
      )}

      {toasts.map(toast => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          isVisible={true}
          onClose={() => removeToast(toast.id)}
          duration={toast.duration}
        />
      ))}

      {/* Message Input - Fixed at bottom */}
      {wallId && (
        <MessageInput
          value={newMessage}
          onChange={setNewMessage}
          onSend={handleSendMessage}
          onKeyPress={handleKeyPress}
          selectedFiles={fileUploadHook.selectedFiles}
          filePreviews={fileUploadHook.filePreviews}
          isDragging={fileUploadHook.isDragging}
          fileInputRef={fileUploadHook.fileInputRef}
          onFileSelect={fileUploadHook.handleFileSelect}
          onRemoveFile={fileUploadHook.removeFile}
          onDragOver={fileUploadHook.handleDragOver}
          onDragLeave={fileUploadHook.handleDragLeave}
          onDrop={fileUploadHook.handleDrop}
          replyingTo={replyingTo}
          replyingToComment={replyingToComment}
          editingMessage={editingMessage}
          editingComment={editingComment}
          currentWall={currentWall}
          isLoggedIn={isLoggedIn()}
          isMember={currentWall?.isMember || false}
          sendingMessage={false}
          onCancelReply={() => {
            setReplyingTo(null);
            setReplyingToComment(null);
          }}
          onCancelEdit={() => {
            setEditingMessage(null);
            setEditingComment(null);
            setNewMessage('');
          }}
          onJoinWall={handleJoinWall}
        />
      )}
    </>
  );
};

export default KolTechLineNew;
