import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { useVideoPlayback } from '../contexts/VideoPlaybackContext';

// Hooks
import { useAuth } from '../hooks/useAuth';
import { useSocket } from '../hooks/useSocket';
import { useToast } from '../hooks/useToast';
import { useModalStore } from '../store/modalStore';
import { useVideoUpload } from '../hooks/useVideoUpload';

// New modular hoo
import { useWalls } from '../hooks/koltech-line/useWalls';
import { useMessages } from '../hooks/koltech-line/useMessages';
import { useFileUpload } from '../hooks/koltech-line/useFileUpload';
import { useMessageActions } from '../hooks/koltech-line/useMessageActions';
import { useCommentActions } from '../hooks/koltech-line/useCommentActions';
import { useVisibleDate } from '../hooks/koltech-line/useVisibleDate';
import { useLinkPreview } from '../hooks/useLinkPreview';

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
import DateSeparator from '../components/koltech-line/DateSeparator';
import StickyDateHeader from '../components/koltech-line/StickyDateHeader';
import ScrollToTopButton from '../components/koltech-line/ScrollToTopButton';
import Comment from '../components/Comment';

// Modals
import AuthModal from '../components/ui/AuthModal';
import CreateWallModal from '../components/ui/CreateWallModal';
import ImageGalleryModal from '../components/ui/ImageGalleryModal';
import Toast from '../components/ui/Toast';

// Utils & Types
import { categories } from '../utils/koltech-line/constants';
import { wallApi, chatApi, contactApi, kolophoneApi, fileApi, messageApi } from '../utils/api';
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
  const videoUploadHook = useVideoUpload();
  const messageActionsHook = useMessageActions({ 
    userId: user?._id, 
    username: user ? `${user.firstName} ${user.lastName}` : undefined,
    avatar: user?.avatar ? `http://localhost:5005${user.avatar}` : undefined,
    onSuccess: showSuccess, 
    onError: showError 
  });
  const commentActionsHook = useCommentActions({ userId: user?._id, onError: showError });

  // Video playback context
  const { setSidebarOpen } = useVideoPlayback();
  
  // Local UI state
  const [newMessage, setNewMessage] = useState('');
  const { linkPreviews, hasLinks } = useLinkPreview(newMessage);
  const [showWalls, setShowWalls] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  
  // Notify video context when sidebar opens/closes
  useEffect(() => {
    setSidebarOpen(showWalls);
  }, [showWalls, setSidebarOpen]);
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
  const [highlightedMessageId, setHighlightedMessageId] = useState<string | null>(null);
  const [showCalendar, setShowCalendar] = useState(false);
  
  // Используем новый хук для отслеживания даты при прокрутке
  const dateHook = useVisibleDate({ messagesLength: messagesHook.messages.length });
  const { 
    currentVisibleDate, 
    selectedDate, 
    setCurrentVisibleDate, 
    setSelectedDate,
    formatDateForComparison
  } = dateHook;
  
  // Активные даты для календаря
  const [activeDates, setActiveDates] = useState<Date[]>([]);

  const currentWall = wallsHook.allWalls.find(w => w.id === wallId);

  // Helper function to check if element is in viewport
  const isElementInViewport = (elementId: string): boolean => {
    const element = document.getElementById(elementId);
    if (!element) return false;

    const rect = element.getBoundingClientRect();
    const windowHeight = window.innerHeight || document.documentElement.clientHeight;
    const windowWidth = window.innerWidth || document.documentElement.clientWidth;

    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= windowHeight &&
      rect.right <= windowWidth
    );
  };

  // Helper function to scroll and highlight only if not visible
  const scrollToElementIfNeeded = (elementId: string, messageId: string) => {
    setTimeout(() => {
      if (!isElementInViewport(elementId)) {
        // Element is not visible, scroll to it and highlight
        setHighlightedMessageId(messageId);
        
        const element = document.getElementById(elementId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        
        // Remove highlight after 2 seconds
        setTimeout(() => {
          setHighlightedMessageId(null);
        }, 2000);
      }
      // If element is already visible, do nothing
    }, 100);
  };
  
  // Используем функцию из хука
  // const formatDateForComparison = (date: Date): string => {
  //   // Create a new date with just year, month, day (no time)
  //   const normalized = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  //   // Return timestamp for reliable comparison
  //   return normalized.getTime().toString();
  // };
  
  // Format time for messages (only time, not relative time)
  const formatTime = (date: Date): string => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  // Group messages by date
  const groupedMessages = useMemo(() => {
    if (!messagesHook.messages.length) return new Map<string, Message[]>();
    
    const groups = new Map<string, Message[]>();
    const dates = new Set<string>();
    
    messagesHook.messages.forEach(message => {
      const dateKey = formatDateForComparison(message.timestamp);
      dates.add(dateKey);
      
      if (!groups.has(dateKey)) {
        groups.set(dateKey, []);
      }
      
      groups.get(dateKey)!.push(message);
    });
    
    // Update active dates for calendar
    const activeDatesList = Array.from(dates).map(dateStr => new Date(dateStr));
    setActiveDates(activeDatesList);
    
    return groups;
  }, [messagesHook.messages]);
  
  // Handle date click in calendar
  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    setShowCalendar(false);
    
    // Update the current visible date immediately to match the selected date
    // This ensures the header updates right away when clicking a date
    setCurrentVisibleDate(date);
    
    // Scroll to the date section if it exists
    const dateKey = formatDateForComparison(date);
    const dateElement = document.getElementById(`date-${dateKey}`);
    
    if (dateElement) {
      // If the date element exists, scroll to it
      // Use block: 'start' to ensure we scroll to the beginning of the date section
      // This will show the first message of that date at the top of the viewport
      dateElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      
      // Log that we're scrolling to the beginning of the date
      console.log(`Scrolling to the beginning of messages for ${date.toDateString()}`);
    } else {
      // If the date doesn't exist, find the nearest date with messages
      const clickedTimestamp = parseInt(dateKey);
      
      // Convert all active dates to timestamps for comparison
      const activeTimestamps = activeDates.map(d => parseInt(formatDateForComparison(d)));
      
      if (activeTimestamps.length > 0) {
        // Sort timestamps to find the nearest date in the past
        // This ensures we scroll to the past messages, not future ones
        const pastTimestamps = activeTimestamps.filter(ts => ts <= clickedTimestamp);
        
        // If there are no dates in the past, use the oldest date available
        const nearestTimestamp = pastTimestamps.length > 0 
          ? Math.max(...pastTimestamps)  // Get the most recent date in the past
          : Math.min(...activeTimestamps);  // If no past dates, get the oldest date
        
        // Scroll to the nearest date
        const nearestElement = document.getElementById(`date-${nearestTimestamp}`);
        if (nearestElement) {
          nearestElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
          
          // Update the current visible date to match the nearest date
          const nearestDate = new Date(nearestTimestamp);
          setCurrentVisibleDate(nearestDate);
          
          // Show a toast notification
          showInfo(`No messages on ${date.toLocaleDateString('en-US', { day: 'numeric', month: 'long' })}. Showing nearest date with messages.`);
          
          console.log(`Scrolling to nearest date in the past: ${new Date(nearestTimestamp).toDateString()}`);
        }
      }
    }
  };
  
  // Используем хук для отслеживания даты при прокрутке
  // Этот код заменен на хук useVisibleDate

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
        },
        onVideoProcessed: (data: any) => {
          console.log('🎬 Video processed event received:', data);
          
          // Update message with HLS path
          const message = messagesHook.messages.find(m => m.id === data.messageId);
          if (message && message.attachments) {
            const updatedAttachments = [...message.attachments];
            if (updatedAttachments[data.attachmentIndex]) {
              updatedAttachments[data.attachmentIndex] = {
                ...updatedAttachments[data.attachmentIndex],
                url: data.hlsPath,
                isHLS: true
              };
              
              messagesHook.updateMessage(data.messageId, {
                ...message,
                attachments: updatedAttachments
              });
              
              showSuccess('Video quality options now available!');
            }
          }
        }
      });

      joinNotifications();
    }
  }, [isConnected, socket, messagesHook.messages]);

  // Join wall via socket
  useEffect(() => {
    if (wallId && isConnected) {
      joinWall(wallId);
    }
  }, [wallId, isConnected]);

  // Handlers
  const handleSendMessage = async () => {
    if (editingComment) {
      const commentId = await commentActionsHook.createComment(
        replyingToComment!.parentMessageId,
        newMessage.trim(),
        replyingToComment!.commentId,
        []
      );
      setNewMessage('');
      setEditingComment(null);
      setReplyingToComment(null);
      
      // Scroll to comment
      if (commentId) {
        setTimeout(() => {
          const commentElement = document.getElementById(`comment-${commentId.id}`);
          if (commentElement) {
            commentElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }, replyingToComment!.commentId ? 800 : 100);
      }
      return;
    }

    if (editingMessage) {
      await messageActionsHook.handleEditMessage(editingMessage.id, newMessage, messagesHook.updateMessage);
      setNewMessage('');
      setEditingMessage(null);
      return;
    }

    if (replyingToComment) {
      const commentId = await commentActionsHook.createComment(
        replyingToComment.parentMessageId,
        newMessage.trim(),
        replyingToComment.commentId,
        []
      );
      
      // Update message replies count optimistically
      if (commentId) {
        const currentMessage = messagesHook.messages.find(m => m.id === replyingToComment.parentMessageId);
        if (currentMessage) {
          messagesHook.updateMessage(replyingToComment.parentMessageId, {
            replies: currentMessage.replies + 1
          });
        }
      }
      
      setNewMessage('');
      setReplyingToComment(null);
      
      // Scroll to comment
      if (commentId) {
        setTimeout(() => {
          const commentElement = document.getElementById(`comment-${commentId.id}`);
          if (commentElement) {
            commentElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }, replyingToComment.commentId ? 800 : 100);
      }
      return;
    }

    if (replyingTo) {
      const commentId = await commentActionsHook.createComment(replyingTo.messageId, newMessage.trim());
      
      // Update message replies count optimistically
      if (commentId) {
        const currentMessage = messagesHook.messages.find(m => m.id === replyingTo.messageId);
        if (currentMessage) {
          messagesHook.updateMessage(replyingTo.messageId, {
            replies: currentMessage.replies + 1
          });
        }
      }
      
      setNewMessage('');
      setReplyingTo(null);
      
      // Scroll to comment
      if (commentId) {
        setTimeout(() => {
          const commentElement = document.getElementById(`comment-${commentId.id}`);
          if (commentElement) {
            commentElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }, 100);
      }
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

    // Check if there are video files
    const videoFiles = fileUploadHook.selectedFiles.filter(f => f.type.startsWith('video/'));
    const otherFiles = fileUploadHook.selectedFiles.filter(f => !f.type.startsWith('video/'));

    // If there are videos, process them first
    if (videoFiles.length > 0) {
      try {
        // Upload and process video
        const result = await videoUploadHook.uploadVideo(videoFiles[0]);
        
        if (!result) {
          showError('Video upload failed');
          return;
        }

        // Upload other files if any
        const otherAttachments = [];
        for (const file of otherFiles) {
          // Upload images normally
          if (file.type.startsWith('image/')) {
            const uploadResponse = await fileApi.uploadImage(file, { compress: true, width: 800 });
            if (uploadResponse?.data?.file) {
              otherAttachments.push({
                type: 'image',
                url: uploadResponse.data.file.url,
                filename: uploadResponse.data.file.originalName || uploadResponse.data.file.filename
              });
            }
          }
        }

        // Create message with HLS video
        const messageData = {
          content: newMessage.trim(),
          wallId,
          attachments: [
            {
              type: 'video',
              url: result.hlsPath,
              isHLS: true
            },
            ...otherAttachments
          ],
          tags: []
        };

        const response = await messageApi.createMessage(messageData);
        
        const realMessage: Message = {
          id: response.data.message._id,
          userId: response.data.message.author._id,
          username: `${response.data.message.author.firstName} ${response.data.message.author.lastName}`,
          avatar: response.data.message.author.avatar 
            ? `http://localhost:5005${response.data.message.author.avatar}` 
            : '',
          content: response.data.message.content,
          timestamp: new Date(response.data.message.createdAt),
          attachments: response.data.message.attachments || [],
          likes: 0,
          replies: 0,
          tags: response.data.message.tags || [],
          isLiked: false,
          isEdited: false
        };

        messagesHook.addMessage(realMessage);
        setNewMessage('');
        fileUploadHook.clearFiles();
        videoUploadHook.reset();
        showSuccess('Message posted with video!');
        
        // Scroll and highlight only if not visible
        scrollToElementIfNeeded(`message-${realMessage.id}`, realMessage.id);
      } catch (error: any) {
        showError(`Error posting message: ${error.message}`);
      }
    } else {
      // No videos, use normal flow
      let tempId: string | null = null;
      
      const realMessage = await messageActionsHook.handleSendMessage(
        { content: newMessage, wallId, attachments: [], tags: [] },
        fileUploadHook.selectedFiles,
        (tempMessage) => {
          // Add optimistic message immediately
          tempId = tempMessage.id;
          messagesHook.addMessage(tempMessage);
        }
      );

      if (realMessage) {
        // Remove temp message and add real one
        if (tempId) {
          messagesHook.removeMessage(tempId);
        }
        messagesHook.addMessage(realMessage);
        setNewMessage('');
        fileUploadHook.clearFiles();
        
        // Scroll and highlight only if not visible
        scrollToElementIfNeeded(`message-${realMessage.id}`, realMessage.id);
      }
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
                  
                  {/* Sticky Date Header */}
                  {currentVisibleDate && !showWalls && (
                    <StickyDateHeader 
                      date={currentVisibleDate} 
                      onCalendarClick={() => setShowCalendar(!showCalendar)}
                    />
                  )}
                  
                  {/* Calendar Popup */}
                  {showCalendar && !showWalls && (
                    <div className="fixed top-[185px] left-4 z-50 bg-dark-700 border border-dark-600 rounded-xl shadow-2xl p-4 w-72 animate-scale-in">
                      <div className="flex items-center justify-between mb-4">
                        <button 
                          onClick={() => {
                            if (currentVisibleDate) {
                              const newDate = new Date(currentVisibleDate);
                              newDate.setMonth(newDate.getMonth() - 1);
                              setCurrentVisibleDate(newDate);
                            }
                          }}
                          className="p-1.5 rounded-lg hover:bg-dark-600 text-gray-400 hover:text-white transition-colors"
                        >
                          <ChevronLeft className="w-4 h-4" />
                        </button>
                        
                        <h3 className="text-white font-medium text-sm">
                          {currentVisibleDate?.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                        </h3>
                        
                        <button 
                          onClick={() => {
                            if (currentVisibleDate) {
                              const newDate = new Date(currentVisibleDate);
                              newDate.setMonth(newDate.getMonth() + 1);
                              setCurrentVisibleDate(newDate);
                            }
                          }}
                          className="p-1.5 rounded-lg hover:bg-dark-600 text-gray-400 hover:text-white transition-colors"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                      
                      <div className="grid grid-cols-7 gap-1 mb-2">
                        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
                          <div key={day} className="text-center text-xs text-gray-500 font-medium py-1">
                            {day}
                          </div>
                        ))}
                      </div>
                      
                      <div className="grid grid-cols-7 gap-1">
                        {(() => {
                          // Generate all dates for the current month view
                          const daysInCalendar = [];
                          if (currentVisibleDate) {
                            const year = currentVisibleDate.getFullYear();
                            const month = currentVisibleDate.getMonth();
                            
                            // Get first day of month and how many days to show from previous month
                            const firstDay = new Date(year, month, 1).getDay();
                            const daysFromPrevMonth = firstDay === 0 ? 6 : firstDay - 1; // Adjust for Monday start
                            
                            // Get days in current month
                            const daysInMonth = new Date(year, month + 1, 0).getDate();
                            
                            // Add days from previous month
                            const prevMonth = month === 0 ? 11 : month - 1;
                            const prevMonthYear = month === 0 ? year - 1 : year;
                            const daysInPrevMonth = new Date(prevMonthYear, prevMonth + 1, 0).getDate();
                            
                            for (let i = 0; i < daysFromPrevMonth; i++) {
                              const day = daysInPrevMonth - daysFromPrevMonth + i + 1;
                              daysInCalendar.push({
                                date: new Date(prevMonthYear, prevMonth, day),
                                isCurrentMonth: false
                              });
                            }
                            
                            // Add days from current month
                            for (let i = 1; i <= daysInMonth; i++) {
                              daysInCalendar.push({
                                date: new Date(year, month, i),
                                isCurrentMonth: true
                              });
                            }
                            
                            // Add days from next month to fill calendar (6 rows x 7 days = 42 total)
                            const totalDaysNeeded = 42;
                            const daysFromNextMonth = totalDaysNeeded - daysInCalendar.length;
                            const nextMonth = month === 11 ? 0 : month + 1;
                            const nextMonthYear = month === 11 ? year + 1 : year;
                            
                            for (let i = 1; i <= daysFromNextMonth; i++) {
                              daysInCalendar.push({
                                date: new Date(nextMonthYear, nextMonth, i),
                                isCurrentMonth: false
                              });
                            }
                          }
                          
                          return daysInCalendar.map((item, index) => {
                            const { date, isCurrentMonth } = item;
                            const isToday = formatDateForComparison(date) === formatDateForComparison(new Date());
                            const isActiveDate = activeDates.some(activeDate => 
                              formatDateForComparison(activeDate) === formatDateForComparison(date)
                            );
                            
                            return (
                              <button
                                key={index}
                                onClick={() => isCurrentMonth ? handleDateClick(date) : null}
                                disabled={!isCurrentMonth}
                                className={`
                                  w-9 h-9 flex items-center justify-center rounded-full text-sm transition-all
                                  ${!isCurrentMonth ? 'text-gray-600' : 'hover:bg-dark-600 cursor-pointer'}
                                  ${isToday ? 'border border-primary-500 text-primary-400' : ''}
                                  ${isActiveDate ? 'bg-primary-500/20 font-medium' : ''}
                                  ${selectedDate && formatDateForComparison(date) === formatDateForComparison(selectedDate) ? 'bg-primary-500 text-white' : ''}
                                `}
                              >
                                {date.getDate()}
                              </button>
                            );
                          });
                        })()}
                      </div>
                    </div>
                  )}
                  
                  {/* Messages */}
                  <div className={`flex-1 overflow-y-auto p-6 pb-40 container mx-auto relative transition-all duration-300 ${
                    showWalls ? 'pt-[654px] blur-sm opacity-60 pointer-events-none' : 'pt-52'
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
                        {/* Render messages grouped by date */}
                        {Array.from(groupedMessages.entries()).map(([dateKey, messagesForDate]) => {
                          // The dateKey is now a timestamp, so we need to convert it back to a date
                          const timestamp = parseInt(dateKey);
                          const dateObj = new Date(timestamp);
                          console.log('DateKey:', dateKey, 'Parsed date:', dateObj.toDateString());
                          
                          return (
                            <div key={`date-section-${dateKey}`} id={`date-${dateKey}`}>
                            <div className="space-y-6">
                              {messagesForDate.map((message, index) => (
                                <div
                                  key={`${message.id}-${index}`}
                                  id={`message-${message.id}`}
                                  className={`transition-all duration-300 ${
                                    highlightedMessageId === message.id 
                                      ? 'ring-2 ring-primary-500 rounded-xl' 
                                      : ''
                                  }`}
                                >
                          <MessageCard
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
                                    formatTime={formatTime}
                                  />
                                ))
                                )}
                              </div>
                            )}
                          </MessageCard>
                                </div>
                              ))}
                              </div>
                            </div>
                          );
                        })}
                        
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

      {/* Scroll to Top Button - Only show when not showing calendar */}
      {wallId && !showCalendar && <ScrollToTopButton threshold={800} />}

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
          sendingMessage={videoUploadHook.isUploading}
          videoUploadProgress={videoUploadHook.progress}
          videoUploadStatus={videoUploadHook.status}
          videoUploadThumbnail={videoUploadHook.thumbnail}
          onCancelVideoUpload={videoUploadHook.cancelUpload}
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
          linkPreviews={linkPreviews}
          onRemoveLinkPreview={(url) => {
            // Опционально: можно удалить URL из текста
            setNewMessage(prev => prev.replace(url, ''));
          }}
        />
      )}
    </>
  );
};

export default KolTechLineNew;
