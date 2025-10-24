import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, Link, useParams } from 'react-router-dom';
import {
  Send,
  Image,
  Video,
  Smile,
  Paperclip,
  Filter,
  Users,
  TrendingUp,
  Code,
  Smartphone,
  Brain,
  DollarSign,
  Target,
  Clock,
  Hash,
  Star,
  MessageCircle,
  Heart,
  Share2,
  MoreHorizontal,
  Search,
  Plus,
  Phone,
  PhoneCall,
  Settings,
  UserPlus,
  Flag,
  Pin,
  X
} from 'lucide-react';
import Header from '../components/Header';
import Comment from '../components/Comment';
import ImageCarousel from '../components/ImageCarousel';
import AuthModal from '../components/ui/AuthModal';
import CreateWallModal from '../components/ui/CreateWallModal';
import ImageGalleryModal from '../components/ui/ImageGalleryModal';
import Toast from '../components/ui/Toast';
import { useAuth } from '../hooks/useAuth';
import { useModalStore } from '../store/modalStore';
import { useSocket } from '../hooks/useSocket';
import { useToast } from '../hooks/useToast';
import { wallApi, messageApi, chatApi, contactApi, kolophoneApi, fileApi } from '../utils/api';

interface Message {
  id: string;
  userId: string;
  username: string;
  avatar: string;
  content: string;
  timestamp: Date;
  attachments?: {
    type: 'image' | 'video' | 'gif' | 'sticker';
    url: string;
    filename?: string;
  }[];
  likes: number;
  replies: number;
  tags: string[];
  isLiked?: boolean;
  isPinned?: boolean;
  isEdited?: boolean;
  editedAt?: Date;
  reactions?: {
    [emoji: string]: {
      count: number;
      users: string[];
    };
  };
  userReaction?: string; // The emoji the current user reacted with
  parentComment?: string; // ID родительского комментария для вложенных ответов
  nestedReplies?: Message[]; // Вложенные ответы на этот комментарий
}

interface Wall {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<any>;
  color: string;
  participants: number;
  category: string;
  isActive?: boolean;
  isMember?: boolean;
  isAdmin?: boolean;
  requiresApproval?: boolean;
}

const KolTechLine = () => {
  const navigate = useNavigate();
  const { wallId } = useParams<{ wallId?: string }>();
  const { isLoggedIn, canCreatePosts, canLikeContent, canCommentOnContent, canCreateWalls, user } = useAuth();
  const {
    showAuthModal,
    authAction,
    showCreateWallModal,
    setShowAuthModal,
    setShowCreateWallModal
  } = useModalStore();

  // State management
  const [walls, setWalls] = useState<Wall[]>([]); // Полный список всех стен
  const [allWalls, setAllWalls] = useState<Wall[]>([]); // Кэш всех стен для поиска currentWall
  const [activeWall, setActiveWall] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [loadingWalls, setLoadingWalls] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMoreMessages, setHasMoreMessages] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [sendingMessage, setSendingMessage] = useState(false);
  const [replyingTo, setReplyingTo] = useState<{ messageId: string; username: string; content: string } | null>(null);
  const [editingMessage, setEditingMessage] = useState<{ id: string; content: string } | null>(null);
  const [imageGalleryModal, setImageGalleryModal] = useState<{
    isOpen: boolean;
    images: { url: string; filename?: string; type: 'image' | 'video' }[];
    initialIndex: number;
    author: { username: string; avatar: string };
  } | null>(null);
  
  // Reaction picker state
  const [showReactionPicker, setShowReactionPicker] = useState<string | null>(null);
  const [showCommentReactionPicker, setShowCommentReactionPicker] = useState<string | null>(null);
  const [messageMenuOpen, setMessageMenuOpen] = useState<string | null>(null);
  const [commentMenuOpen, setCommentMenuOpen] = useState<string | null>(null);
  const [expandedReplies, setExpandedReplies] = useState<Set<string>>(new Set());
  const [messageReplies, setMessageReplies] = useState<{ [key: string]: Message[] }>({});
  const [loadingReplies, setLoadingReplies] = useState<Set<string>>(new Set());
  const [editingComment, setEditingComment] = useState<{ id: string; content: string } | null>(null);
  const [replyingToComment, setReplyingToComment] = useState<{ commentId: string; username: string; parentMessageId: string } | null>(null);
  const [isHoveringComments, setIsHoveringComments] = useState<string | null>(null); // Track which message's comments area is being hovered
  
  // UI state
  const [showFilters, setShowFilters] = useState(false);
  const [showWalls, setShowWalls] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedParticipants, setSelectedParticipants] = useState('all');
  const [lastOpenedWallsCategory, setLastOpenedWallsCategory] = useState<string | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [showKolophonePanel, setShowKolophonePanel] = useState(false);
  const [activeCall, setActiveCall] = useState<any>(null);
  const [wallSearchQuery, setWallSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  
  // File upload
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [filePreviews, setFilePreviews] = useState<{file: File; preview: string; type: 'image' | 'video'}[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const dropZoneRef = useRef<HTMLDivElement>(null);

  // Toast notifications
  const { toasts, showSuccess, showError, showWarning, showInfo, removeToast } = useToast();

  // Socket.IO integration for real-time updates (without frequent reconnections)
  const { socket, joinWall, leaveWall, emitTyping, joinNotifications, subscribeToEvents, isConnected } = useSocket();

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      
      // Close message menu if clicking outside
      if (messageMenuOpen && !target.closest('.message-menu-container')) {
        setMessageMenuOpen(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [messageMenuOpen]);

  // Subscribe to socket events only once
  useEffect(() => {
    if (isConnected && socket) {
      subscribeToEvents({
        // On message received
        onMessageReceived: (data: any) => {
          if (data.type === 'like_updated') {
            setMessages(prev => prev.map(msg =>
              msg.id === data.messageId
                ? { ...msg, likes: data.likesCount, isLiked: data.likedBy === user?._id }
                : msg
            ));
          } else if (data.message && data.wallId === activeWall) {
            // New message received - only add if not from current user to prevent duplication
            if (data.message.author._id !== user?._id) {
              const newMsg: Message = {
                id: data.message._id,
                userId: data.message.author._id,
                username: `${data.message.author.firstName} ${data.message.author.lastName}`,
                avatar: data.message.author.avatar ? `http://localhost:5005${data.message.author.avatar}` : `https://ui-avatars.com/api/?name=${encodeURIComponent(data.message.author.firstName + ' ' + data.message.author.lastName)}&background=6366f1&color=fff&size=40`,
                content: data.message.content,
                timestamp: new Date(data.message.createdAt),
                attachments: data.message.attachments || [],
                likes: data.message.likesCount || 0,
                replies: data.message.repliesCount || 0,
                tags: data.message.tags || [],
                isLiked: false,
                isPinned: data.message.isPinned || false,
                isEdited: data.message.isEdited || false,
                editedAt: data.message.editedAt ? new Date(data.message.editedAt) : undefined
              };
              console.log('📨 New message received from other user:', newMsg.username);
              setMessages(prev => [newMsg, ...prev]);
            }
          }
        },
        // On call received
        onCallReceived: (data: any) => {
          if (data.type === 'call_started') {
            alert(`Kolophone call started in ${data.type === 'wall' ? 'wall' : 'chat'}!`);
          } else if (data.type === 'incoming_call') {
            showInfo(`📞 Incoming Kolophone call from ${data.caller.name}. Video calling UI coming soon!`);
            // Auto-join for demo purposes
            // kolophoneApi.joinCall(data.callId).catch(console.error);
          }
        }
      });

      // Direct socket listeners for comments
      const handleNewComment = (data: any) => {
        console.log('📨 Direct new_comment event:', data);
        
        // ВАЖНО: НЕ увеличиваем счетчик если это наш собственный комментарий
        // (он уже был увеличен оптимистично в createComment)
        if (data.comment?.author?._id !== user?._id) {
          // Update comment count only for other users' comments
          setMessages(prev => prev.map(msg =>
            msg.id === data.parentMessageId
              ? { ...msg, replies: msg.replies + 1 }
              : msg
          ));
        }
        
        // If comments are expanded - reload them (только если это не наш комментарий)
        if (expandedReplies.has(data.parentMessageId) && data.comment?.author?._id !== user?._id) {
          messageApi.getComments(data.parentMessageId).then(response => {
            const commentTree = buildCommentTree(response.data.comments, data.parentMessageId);
            setMessageReplies(prev => ({
              ...prev,
              [data.parentMessageId]: commentTree
            }));
          }).catch(console.error);
        }
      };

      const handleMessageReactionUpdated = (data: any) => {
        console.log('❤️ Direct message_reaction_updated event:', data);
        setMessages(prev => prev.map(msg =>
          msg.id === data.messageId
            ? {
                ...msg,
                reactions: data.reactions.reduce((acc: any, r: any) => {
                  acc[r.emoji] = { count: r.count, users: r.users };
                  return acc;
                }, {}),
                userReaction: data.userReaction
              }
            : msg
        ));
      };

      socket.on('new_comment', handleNewComment);
      socket.on('nested_reply_added', handleNewComment);
      socket.on('message_reaction_updated', handleMessageReactionUpdated);

      // Join notifications once when connected
      joinNotifications();

      return () => {
        socket.off('new_comment', handleNewComment);
        socket.off('nested_reply_added', handleNewComment);
        socket.off('message_reaction_updated', handleMessageReactionUpdated);
      };
    }
  }, [isConnected, socket, expandedReplies]); // Depend on socket and expandedReplies

  // Set active wall from URL parameter and load it if not in cache
  useEffect(() => {
    if (wallId) {
      setActiveWall(wallId);
      
      // Если стены нет в кэше, загружаем её отдельно
      if (!allWalls.find(w => w.id === wallId)) {
        loadSingleWall(wallId);
      }
    }
  }, [wallId]);
  
  // Load single wall info
  const loadSingleWall = async (wallId: string) => {
    try {
      const response = await wallApi.getWalls({ limit: 50 }); // Load all to find the wall
      const allWallsData = response.data.walls.map((wall: any) => ({
        id: wall._id,
        name: wall.name,
        description: wall.description,
        icon: getCategoryIcon(wall.category),
        color: getCategoryColor(wall.category),
        participants: wall.memberCount,
        category: wall.category,
        isActive: true,
        isMember: user ? wall.members?.includes(user._id) : false,
        isAdmin: user ? wall.admins?.includes(user._id) : false,
        requiresApproval: wall.settings?.requireApproval || false
      }));
      
      // Добавляем все стены в кэш
      setAllWalls(allWallsData);
    } catch (error) {
      console.error('Error loading single wall:', error);
    }
  };

  // Load walls from API
  useEffect(() => {
    loadWalls();
  }, [selectedCategory]);

  // Load messages when wall changes (don't wait for socket)
  useEffect(() => {
    if (activeWall) {
      console.log('🏠 Switching to wall:', activeWall);
      loadMessages(1, true); // Reset pagination when switching walls
    } else {
      // Clear messages when no wall is selected
      setMessages([]);
      setLoading(false);
    }
  }, [activeWall]);

  // Join wall via socket when connected
  useEffect(() => {
    if (activeWall && isConnected) {
      console.log('🔌 Socket connected, joining wall:', activeWall);
      joinWall(activeWall);
    }
  }, [activeWall, isConnected]);

  const loadWalls = async () => {
    setLoadingWalls(true);
    try {
      const response = await wallApi.getWalls({
        category: selectedCategory !== 'all' ? selectedCategory : undefined,
        limit: 50
      });
      
      const wallsData = response.data.walls.map((wall: any) => ({
        id: wall._id,
        name: wall.name,
        description: wall.description,
        icon: getCategoryIcon(wall.category),
        color: getCategoryColor(wall.category),
        participants: wall.memberCount,
        category: wall.category,
        isActive: true,
        isMember: user ? wall.members?.includes(user._id) : false,
        isAdmin: user ? wall.admins?.includes(user._id) : false,
        requiresApproval: wall.settings?.requireApproval || false
      }));
      
      setWalls(wallsData);
      
      // Сохраняем все стены в кэш при первой загрузке или при загрузке всех категорий
      if (selectedCategory === 'all') {
        setAllWalls(wallsData);
      } else {
        // При фильтрации добавляем новые стены в кэш, не удаляя старые
        setAllWalls(prev => {
          const newWalls = wallsData.filter((w: Wall) => !prev.find(p => p.id === w.id));
          return [...prev, ...newWalls];
        });
      }
      
      // ВАЖНО: НЕ сбрасываем activeWall при фильтрации категорий
      // activeWall управляется только через URL параметр wallId
      // Это позволяет пользователю фильтровать стены, оставаясь на текущей стене
    } catch (error) {
      console.error('Error loading walls:', error);
    } finally {
      setLoadingWalls(false);
    }
  };

  const loadMessages = async (page = 1, reset = true) => {
    if (!activeWall) return;
    
    if (reset) {
      setLoading(true);
      setCurrentPage(1);
      setHasMoreMessages(true);
    } else {
      setLoadingMore(true);
    }
    
    try {
      const response = await messageApi.getWallMessages(activeWall, {
        limit: 20,
        page
      });
      
      const messagesData = response.data.messages.map((msg: any) => {
        // Convert reactions array to object format for frontend
        const reactionsObj: { [emoji: string]: { count: number; users: string[] } } = {};
        if (msg.reactions && Array.isArray(msg.reactions)) {
          msg.reactions.forEach((reaction: any) => {
            reactionsObj[reaction.emoji] = {
              count: reaction.count,
              users: reaction.users
            };
          });
        }
        
        // Find user's reaction
        let userReaction: string | undefined;
        if (user && msg.reactions) {
          const reaction = msg.reactions.find((r: any) => 
            r.users.some((userId: string) => userId === user._id)
          );
          if (reaction) {
            userReaction = reaction.emoji;
          }
        }
        
        return {
          id: msg._id,
          userId: msg.author._id,
          username: `${msg.author.firstName} ${msg.author.lastName}`,
          avatar: msg.author.avatar ? `http://localhost:5005${msg.author.avatar}` : `https://ui-avatars.com/api/?name=${encodeURIComponent(msg.author.firstName + ' ' + msg.author.lastName)}&background=6366f1&color=fff&size=40`,
          content: msg.content,
          timestamp: new Date(msg.createdAt),
          attachments: msg.attachments || [],
          likes: msg.likesCount,
          replies: msg.repliesCount,
          tags: msg.tags || [],
          isLiked: msg.likes?.includes(user?._id) || false,
          isPinned: msg.isPinned || false,
          isEdited: msg.isEdited || false,
          editedAt: msg.editedAt ? new Date(msg.editedAt) : undefined,
          reactions: reactionsObj,
          userReaction
        };
      });
      
      if (reset) {
        setMessages(messagesData);
      } else {
        setMessages(prev => [...prev, ...messagesData]);
      }
      
      // Check if there are more messages
      setHasMoreMessages(messagesData.length === 20);
      setCurrentPage(page);
      
      setLoading(false);
      setLoadingMore(false);
    } catch (error) {
      console.error('Error loading messages:', error);
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const loadMoreMessages = () => {
    if (loadingMore || !hasMoreMessages) return;
    loadMessages(currentPage + 1, false);
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'freelance': return Code;
      case 'startups': return TrendingUp;
      case 'investments': return DollarSign;
      case 'technology': return Brain;
      default: return Target;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'freelance': return 'from-blue-500 to-cyan-500';
      case 'startups': return 'from-purple-500 to-pink-500';
      case 'investments': return 'from-green-500 to-emerald-500';
      case 'technology': return 'from-orange-500 to-red-500';
      default: return 'from-gray-500 to-slate-500';
    }
  };

  const categories = [
    { id: 'all', name: 'All Categories' },
    { id: 'freelance', name: 'Freelance' },
    { id: 'startups', name: 'Startups' },
    { id: 'investments', name: 'Investments' },
    { id: 'technology', name: 'Technology' }
  ];

  const participantRanges = [
    { id: 'all', name: 'Any Size' },
    { id: 'small', name: '< 100 members' },
    { id: 'medium', name: '100-500 members' },
    { id: 'large', name: '500-1000 members' },
    { id: 'huge', name: '1000+ members' }
  ];

  const popularTags = [
    'React', 'Node.js', 'Python', 'AI/ML', 'Blockchain', 'Mobile', 'UI/UX', 
    'DevOps', 'Startup', 'Funding', 'Series A', 'MVP', 'SaaS', 'Fintech'
  ];

  // API integration methods
  const handleJoinWall = async (wallId: string) => {
    if (!isLoggedIn()) {
      setShowAuthModal(true, 'join_wall');
      return;
    }

    try {
      console.log('🏠 Attempting to join wall:', wallId);
      await wallApi.joinWall(wallId);
      
      // Update wall membership status in both walls and allWalls
      setWalls(prev => prev.map(wall =>
        wall.id === wallId
          ? { ...wall, isMember: true, participants: wall.participants + 1 }
          : wall
      ));
      
      // ВАЖНО: Также обновляем кэш allWalls для корректного отображения
      setAllWalls(prev => prev.map(wall =>
        wall.id === wallId
          ? { ...wall, isMember: true, participants: wall.participants + 1 }
          : wall
      ));
      
      console.log('✅ Successfully joined wall');
      showSuccess(`🎉 Welcome to ${walls.find(w => w.id === wallId)?.name}! You can now post and interact with the community.`);
    } catch (error: any) {
      console.error('❌ Error joining wall:', error);
      if (error.message.includes('approval')) {
        showWarning('📋 Your request to join this wall has been submitted for approval. You\'ll be notified when it\'s reviewed.');
      } else {
        showError(`❌ Error joining wall: ${error.message}`);
      }
    }
  };

  const handleLeaveWall = async (wallId: string) => {
    if (!isLoggedIn()) return;

    const confirm = window.confirm('Are you sure you want to leave this wall?');
    if (!confirm) return;

    try {
      await wallApi.leaveWall(wallId);
      
      // Update wall membership status in both walls and allWalls
      setWalls(prev => prev.map(wall =>
        wall.id === wallId
          ? { ...wall, isMember: false, participants: Math.max(0, wall.participants - 1) }
          : wall
      ));
      
      // ВАЖНО: Также обновляем кэш allWalls для корректного отображения
      setAllWalls(prev => prev.map(wall =>
        wall.id === wallId
          ? { ...wall, isMember: false, participants: Math.max(0, wall.participants - 1) }
          : wall
      ));
      
      showInfo('👋 You have left the wall. You can rejoin anytime.');
    } catch (error: any) {
      console.error('❌ Error leaving wall:', error);
      showError(`❌ Error leaving wall: ${error.message}`);
    }
  };

  const handleSendMessage = async () => {
    // Check if editing comment
    if (editingComment) {
      handleSaveCommentEdit();
      return;
    }

    // Check if editing message
    if (editingMessage) {
      handleSaveEdit();
      return;
    }

    // Check if replying to comment
    if (replyingToComment) {
      if (!newMessage.trim() && selectedFiles.length === 0) return;
      await createComment(replyingToComment.parentMessageId, newMessage.trim(), replyingToComment.commentId);
      setNewMessage('');
      setReplyingToComment(null);
      return;
    }

    // Check if replying to message
    if (replyingTo) {
      if (!newMessage.trim() && selectedFiles.length === 0) return;
      await createComment(replyingTo.messageId, newMessage.trim());
      setNewMessage('');
      setReplyingTo(null);
      return;
    }

    console.log('📝 Attempting to send message...');
    console.log('🔐 Can create posts:', canCreatePosts());
    console.log('👤 User:', user);
    console.log('🏠 Active wall:', activeWall);
    console.log('💬 Message content:', newMessage.trim());

    if (!isLoggedIn()) {
      console.log('❌ User is not logged in, showing auth modal');
      setShowAuthModal(true, 'post');
      return;
    }

    if (!newMessage.trim() && selectedFiles.length === 0) {
      console.log('❌ No content to send');
      showWarning('⚠️ Please add some text or attach files to send a message');
      return;
    }

    if (!activeWall) {
      console.log('❌ No active wall selected');
      showWarning('⚠️ Please select a wall first');
      return;
    }

    // Check if user is member of the wall
    // Находим текущую стену из ПОЛНОГО кэша стен (allWalls), а не из отфильтрованного списка (walls)
  // Это гарантирует, что информация о стене всегда доступна, даже если она не входит в текущий фильтр категорий
  const currentWall = allWalls.find(w => w.id === activeWall);
    if (currentWall && !currentWall.isMember) {
      console.log('❌ User is not a member of this wall');
      showWarning('🏠 You need to join this wall before posting. Click the "Join Wall" button in the header or sidebar.');
      return;
    }

    console.log('✅ Starting message creation...');
    
    // Generate temporary ID for optimistic update
    const tempId = `temp-${Date.now()}`;
    
    // Create optimistic message with file previews
    const optimisticAttachments = filePreviews.map(preview => ({
      type: preview.type,
      url: preview.preview, // Use local preview URL temporarily
      filename: preview.file.name
    }));
    
    const optimisticMessage: Message = {
      id: tempId,
      userId: user!._id,
      username: `${user!.firstName} ${user!.lastName}`,
      avatar: user!.avatar ? `http://localhost:5005${user!.avatar}` : `https://ui-avatars.com/api/?name=${encodeURIComponent(user!.firstName + ' ' + user!.lastName)}&background=6366f1&color=fff&size=40`,
      content: newMessage.trim(),
      timestamp: new Date(),
      attachments: optimisticAttachments as any,
      likes: 0,
      replies: 0,
      tags: extractTagsFromContent(newMessage),
      isLiked: false,
      isEdited: false
    };
    
    // OPTIMISTIC UPDATE - мгновенно добавляем сообщение в UI
    setMessages(prev => [optimisticMessage, ...prev]);
    
    // Очищаем форму сразу для лучшего UX
    const messageContent = newMessage.trim();
    const filesToUpload = [...selectedFiles];
    setNewMessage('');
    setSelectedFiles([]);
    setFilePreviews([]);
    setSendingMessage(true);
    
    try {
      // Upload files first if any
      const attachments = [];
      console.log('📁 Files to upload:', filesToUpload.length);
      
      for (const file of filesToUpload) {
        try {
          console.log('📤 Uploading file:', file.name, 'Type:', file.type);
          let uploadResponse;
          if (file.type.startsWith('image/')) {
            uploadResponse = await fileApi.uploadImage(file, { compress: true, width: 800 });
          } else if (file.type.startsWith('video/')) {
            uploadResponse = await fileApi.uploadVideo(file);
          }
          
          console.log('📥 Upload response:', uploadResponse);
          
          if (uploadResponse?.data?.file) {
            const attachment = {
              type: file.type.startsWith('image/') ? 'image' : 'video',
              url: uploadResponse.data.file.url,
              filename: uploadResponse.data.file.originalName || uploadResponse.data.file.filename
            };
            attachments.push(attachment);
            console.log('✅ File uploaded successfully:', attachment);
          } else {
            console.error('❌ Invalid upload response:', uploadResponse);
          }
        } catch (fileError) {
          console.error('❌ Error uploading file:', fileError);
          showError(`Error uploading ${file.name}: ${fileError}`);
        }
      }
      
      console.log('📎 Final attachments array:', attachments);

      const messageData = {
        content: messageContent || '',
        wallId: activeWall,
        attachments,
        tags: extractTagsFromContent(messageContent)
      };

      console.log('📤 Sending message data:', messageData);

      // Create message on server
      const response = await messageApi.createMessage(messageData);
      console.log('✅ Message created successfully:', response);

      // Replace optimistic message with real one from server
      const realMessage: Message = {
        id: response.data.message._id,
        userId: response.data.message.author._id,
        username: `${response.data.message.author.firstName} ${response.data.message.author.lastName}`,
        avatar: response.data.message.author.avatar ? `http://localhost:5005${response.data.message.author.avatar}` : `https://ui-avatars.com/api/?name=${encodeURIComponent(response.data.message.author.firstName + ' ' + response.data.message.author.lastName)}&background=6366f1&color=fff&size=40`,
        content: response.data.message.content,
        timestamp: new Date(response.data.message.createdAt),
        attachments: response.data.message.attachments || attachments,
        likes: 0,
        replies: 0,
        tags: response.data.message.tags || [],
        isLiked: false,
        isEdited: false
      };
      
      // Replace temporary message with real one
      setMessages(prev => prev.map(msg => 
        msg.id === tempId ? realMessage : msg
      ));
      
      console.log('✅ Optimistic message replaced with real message');
    } catch (error: any) {
      console.error('❌ Error sending message:', error);
      console.error('❌ Error details:', error.response?.data || error.message);
      
      // Remove optimistic message on error
      setMessages(prev => prev.filter(msg => msg.id !== tempId));
      
      // Restore form data
      setNewMessage(messageContent);
      setSelectedFiles(filesToUpload);
      // Regenerate previews
      filesToUpload.forEach(file => {
        if (file.type.startsWith('image/') || file.type.startsWith('video/')) {
          const reader = new FileReader();
          reader.onload = (e) => {
            setFilePreviews(prev => [...prev, {
              file,
              preview: e.target?.result as string,
              type: file.type.startsWith('image/') ? 'image' : 'video'
            }]);
          };
          reader.readAsDataURL(file);
        }
      });
      
      showError(`❌ Error sending message: ${error.message || 'Please try again.'}`);
    } finally {
      setSendingMessage(false);
    }
  };

  const extractTagsFromContent = (content: string): string[] => {
    const tagRegex = /#[\w]+/g;
    const matches = content.match(tagRegex);
    return matches ? matches.map(tag => tag.substring(1).toLowerCase()) : [];
  };

  // Typing indicators
  const [isTyping, setIsTyping] = useState(false);
  const typingTimeoutRef = useRef<number | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNewMessage(e.target.value);
    
    // Emit typing start
    if (!isTyping && activeWall) {
      setIsTyping(true);
      emitTyping(activeWall, true);
    }

    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Set timeout to stop typing
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
      if (activeWall) {
        emitTyping(activeWall, false);
      }
    }, 2000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
      
      // Stop typing when sending message
      if (isTyping && activeWall) {
        setIsTyping(false);
        emitTyping(activeWall, false);
        if (typingTimeoutRef.current) {
          clearTimeout(typingTimeoutRef.current);
        }
      }
    }
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'now';
    if (minutes < 60) return `${minutes}m`;
    if (hours < 24) return `${hours}h`;
    return `${days}d`;
  };

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const filteredWalls = walls.filter(wall => {
    if (selectedCategory !== 'all' && wall.category !== selectedCategory) return false;
    
    if (selectedParticipants !== 'all') {
      const participants = wall.participants;
      switch (selectedParticipants) {
        case 'small': return participants < 100;
        case 'medium': return participants >= 100 && participants < 500;
        case 'large': return participants >= 500 && participants < 1000;
        case 'huge': return participants >= 1000;
        default: return true;
      }
    }
    
    return true;
  });

  const handleLike = async (messageId: string) => {
    if (!canLikeContent()) {
      setShowAuthModal(true, 'like');
      return;
    }
    
    // Prevent double clicking
    const currentMessage = messages.find(msg => msg.id === messageId);
    if (!currentMessage) return;
    
    // Optimistic update to prevent double clicks
    setMessages(prev => prev.map(msg =>
      msg.id === messageId
        ? {
            ...msg,
            likes: msg.isLiked ? msg.likes - 1 : msg.likes + 1,
            isLiked: !msg.isLiked
          }
        : msg
    ));
    
    try {
      const response = await messageApi.toggleLike(messageId);
      
      // Update with server response
      setMessages(prev => prev.map(msg =>
        msg.id === messageId
          ? {
              ...msg,
              likes: response.data.likesCount,
              isLiked: response.data.hasLiked
            }
          : msg
      ));
    } catch (error) {
      console.error('Error toggling like:', error);
      // Revert optimistic update on error
      setMessages(prev => prev.map(msg =>
        msg.id === messageId
          ? {
              ...msg,
              likes: currentMessage.isLiked ? currentMessage.likes : currentMessage.likes - 1,
              isLiked: currentMessage.isLiked
            }
          : msg
      ));
    }
  };

  const handleComment = (messageId: string) => {
    if (!canCommentOnContent()) {
      setShowAuthModal(true, 'comment');
      return;
    }
    
    const message = messages.find(msg => msg.id === messageId);
    if (message) {
      setReplyingTo({
        messageId,
        username: message.username,
        content: message.content.substring(0, 100) + (message.content.length > 100 ? '...' : '')
      });
      textareaRef.current?.focus();
    }
  };

  const [highlightedCommentId, setHighlightedCommentId] = useState<string | null>(null);

  const createComment = async (messageId: string, content: string, parentCommentId?: string) => {
    // Проверка: должен быть либо текст, либо файлы
    if (!content.trim() && selectedFiles.length === 0) {
      showWarning('⚠️ Please add some text or attach files');
      return;
    }
    
    // Generate temporary ID for optimistic update
    const tempId = `temp-comment-${Date.now()}`;
    
    // Сохраняем текст для rollback
    const originalContent = content.trim();
    
    // Upload files if any (same logic as messages)
    const attachments = [];
    for (const file of selectedFiles) {
      try {
        let uploadResponse;
        if (file.type.startsWith('image/')) {
          uploadResponse = await fileApi.uploadImage(file, { compress: true, width: 800 });
        } else if (file.type.startsWith('video/')) {
          uploadResponse = await fileApi.uploadVideo(file);
        }
        
        if (uploadResponse?.data?.file) {
          attachments.push({
            type: file.type.startsWith('image/') ? 'image' : 'video',
            url: uploadResponse.data.file.url,
            filename: uploadResponse.data.file.originalName || uploadResponse.data.file.filename
          });
        }
      } catch (fileError) {
        console.error('Error uploading file for comment:', fileError);
      }
    }
    
    // Create optimistic comment with attachments
    const optimisticComment: Message = {
      id: tempId,
      userId: user!._id,
      username: `${user!.firstName} ${user!.lastName}`,
      avatar: user!.avatar ? `http://localhost:5005${user!.avatar}` : `https://ui-avatars.com/api/?name=${encodeURIComponent(user!.firstName + ' ' + user!.lastName)}&background=6366f1&color=fff&size=40`,
      content: originalContent,
      timestamp: new Date(),
      attachments: attachments.length > 0 ? attachments as any : undefined,
      likes: 0,
      replies: 0,
      tags: [],
      isLiked: false,
      isEdited: false,
      reactions: {},
      nestedReplies: []
    };
    
    // OPTIMISTIC UPDATE - мгновенно добавляем комментарий в UI
    if (parentCommentId) {
      // Вложенный ответ - добавляем в nestedReplies
      setMessageReplies(prev => {
        const currentReplies = prev[messageId] || [];
        
        const addNestedReply = (comments: Message[]): Message[] => {
          return comments.map(comment => {
            if (comment.id === parentCommentId) {
              return {
                ...comment,
                nestedReplies: [...(comment.nestedReplies || []), optimisticComment]
              };
            } else if (comment.nestedReplies && comment.nestedReplies.length > 0) {
              return {
                ...comment,
                nestedReplies: addNestedReply(comment.nestedReplies)
              };
            }
            return comment;
          });
        };
        
        return {
          ...prev,
          [messageId]: addNestedReply(currentReplies)
        };
      });
    } else {
      // Прямой ответ на сообщение
      setMessages(prev => prev.map(msg =>
        msg.id === messageId
          ? { ...msg, replies: msg.replies + 1 }
          : msg
      ));
      
      // ВАЖНО: Добавляем комментарий в список ВСЕГДА, не только если expandedReplies
      // Это гарантирует что комментарий будет виден когда пользователь раскроет список
      setMessageReplies(prev => ({
        ...prev,
        [messageId]: [...(prev[messageId] || []), optimisticComment]
      }));
      
      // Автоматически раскрываем комментарии если они еще не раскрыты
      if (!expandedReplies.has(messageId)) {
        setExpandedReplies(prev => new Set(prev).add(messageId));
      }
    }
    
    // ВАЖНО: Очищаем форму СРАЗУ после optimistic update
    setNewMessage('');
    setSelectedFiles([]);
    setFilePreviews([]);
    setReplyingTo(null);
    setReplyingToComment(null);
    
    // Подсвечиваем новый комментарий
    setHighlightedCommentId(tempId);
    
    // Скроллим к комментарию через задержку (чтобы DOM обновился и раскрылись родители)
    // Для вложенных ответов задержка больше, чтобы все родительские комментарии успели раскрыться
    setTimeout(() => {
      const commentElement = document.getElementById(`comment-${tempId}`);
      if (commentElement) {
        commentElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, parentCommentId ? 800 : 100); // Увеличенная задержка для вложенных ответов любого уровня
    
    // Убираем подсветку через 2 секунды
    setTimeout(() => {
      setHighlightedCommentId(null);
    }, 2000);
    
    try {
      // Отправляем на сервер в фоне с attachments
      const response = await messageApi.addComment(messageId, content, parentCommentId, attachments);
      
      const realComment: Message = {
        id: response.data.comment._id,
        userId: response.data.comment.author._id,
        username: `${response.data.comment.author.firstName} ${response.data.comment.author.lastName}`,
        avatar: response.data.comment.author.avatar ? `http://localhost:5005${response.data.comment.author.avatar}` : `https://ui-avatars.com/api/?name=${encodeURIComponent(response.data.comment.author.firstName + ' ' + response.data.comment.author.lastName)}&background=6366f1&color=fff&size=40`,
        content: response.data.comment.content,
        timestamp: new Date(response.data.comment.createdAt),
        attachments: response.data.comment.attachments || [],
        likes: 0,
        replies: 0,
        tags: [],
        isLiked: false,
        isEdited: false,
        reactions: {},
        nestedReplies: []
      };
      
      // Заменяем временный комментарий на реальный
      // НЕ обновляем highlighted ID - он уже установлен и будет автоматически сброшен
      if (parentCommentId) {
        setMessageReplies(prev => {
          const currentReplies = prev[messageId] || [];
          
          const replaceComment = (comments: Message[]): Message[] => {
            return comments.map(comment => {
              if (comment.id === parentCommentId) {
                return {
                  ...comment,
                  nestedReplies: (comment.nestedReplies || []).map(nested =>
                    nested.id === tempId ? realComment : nested
                  )
                };
              } else if (comment.nestedReplies && comment.nestedReplies.length > 0) {
                return {
                  ...comment,
                  nestedReplies: replaceComment(comment.nestedReplies)
                };
              }
              return comment;
            });
          };
          
          return {
            ...prev,
            [messageId]: replaceComment(currentReplies)
          };
        });
      } else {
        setMessageReplies(prev => ({
          ...prev,
          [messageId]: (prev[messageId] || []).map(comment =>
            comment.id === tempId ? realComment : comment
          )
        }));
      }
      
      // Убрали toast - комментарий появляется мгновенно благодаря optimistic UI
    } catch (error) {
      console.error('Error creating comment:', error);
      
      // ROLLBACK - восстанавливаем текст в форму
      setNewMessage(originalContent);
      if (parentCommentId) {
        setReplyingToComment({ 
          commentId: parentCommentId, 
          username: '', // Не критично для восстановления
          parentMessageId: messageId 
        });
      } else {
        setReplyingTo({ 
          messageId, 
          username: '', // Не критично для восстановления
          content: '' 
        });
      }
      
      // ROLLBACK - удаляем оптимистичный комментарий при ошибке
      if (parentCommentId) {
        setMessageReplies(prev => {
          const currentReplies = prev[messageId] || [];
          
          const removeComment = (comments: Message[]): Message[] => {
            return comments.map(comment => {
              if (comment.id === parentCommentId) {
                return {
                  ...comment,
                  nestedReplies: (comment.nestedReplies || []).filter(nested => nested.id !== tempId)
                };
              } else if (comment.nestedReplies && comment.nestedReplies.length > 0) {
                return {
                  ...comment,
                  nestedReplies: removeComment(comment.nestedReplies)
                };
              }
              return comment;
            });
          };
          
          return {
            ...prev,
            [messageId]: removeComment(currentReplies)
          };
        });
      } else {
        setMessages(prev => prev.map(msg =>
          msg.id === messageId
            ? { ...msg, replies: Math.max(0, msg.replies - 1) }
            : msg
        ));
        
        setMessageReplies(prev => ({
          ...prev,
          [messageId]: (prev[messageId] || []).filter(comment => comment.id !== tempId)
        }));
      }
      
      showError('❌ Error posting reply. Please try again.');
    }
  };

  // Build comment tree from flat list
  const buildCommentTree = (comments: any[], messageId: string): Message[] => {
    const commentMap = new Map<string, Message>();
    const rootComments: Message[] = [];
    
    console.log('🌳 Building comment tree for message:', messageId);
    console.log('📦 Total comments received:', comments.length);
    
    // First pass: create all comment objects
    comments.forEach((comment: any) => {
      // ВАЖНО: Правильно определяем userReaction из массива reactions
      let userReaction: string | undefined;
      if (user && comment.reactions && Array.isArray(comment.reactions)) {
        const reaction = comment.reactions.find((r: any) => 
          r.users && r.users.some((userId: string) => userId === user._id)
        );
        if (reaction) {
          userReaction = reaction.emoji;
        }
      }
      
      const commentObj: Message = {
        id: comment._id,
        userId: comment.author._id,
        username: `${comment.author.firstName} ${comment.author.lastName}`,
        avatar: comment.author.avatar ? `http://localhost:5005${comment.author.avatar}` : `https://ui-avatars.com/api/?name=${encodeURIComponent(comment.author.firstName + ' ' + comment.author.lastName)}&background=6366f1&color=fff&size=40`,
        content: comment.content,
        timestamp: new Date(comment.createdAt),
        attachments: comment.attachments || [], // ✅ ДОБАВИЛИ ATTACHMENTS!
        likes: comment.likesCount || 0,
        replies: 0,
        tags: [],
        isLiked: comment.likes?.includes(user?._id) || false,
        isEdited: comment.isEdited || false,
        editedAt: comment.editedAt ? new Date(comment.editedAt) : undefined,
        reactions: comment.reactions ? comment.reactions.reduce((acc: any, r: any) => {
          acc[r.emoji] = { count: r.count, users: r.users };
          return acc;
        }, {}) : {},
        userReaction: userReaction, // Используем правильно определённую userReaction
        parentComment: comment.parentMessage,
        nestedReplies: []
      };
      commentMap.set(comment._id, commentObj);
      console.log(`📝 Comment ${comment._id}: parentMessage=${comment.parentMessage}, userReaction=${userReaction}`);
    });
    
    // Second pass: build tree structure
    commentMap.forEach((comment) => {
      // Проверяем является ли parentComment ID другого комментария (вложенный)
      // или ID сообщения (корневой)
      const parentIsComment = commentMap.has(comment.parentComment || '');
      
      if (parentIsComment) {
        // Это вложенный ответ на комментарий
        const parent = commentMap.get(comment.parentComment!);
        if (parent) {
          parent.nestedReplies = parent.nestedReplies || [];
          parent.nestedReplies.push(comment);
          console.log(`  ↳ Nested reply ${comment.id} added to comment ${parent.id}`);
        }
      } else {
        // Это корневой комментарий (прямой ответ на сообщение)
        rootComments.push(comment);
        console.log(`  ↳ Root comment ${comment.id}`);
      }
    });
    
    console.log(`✅ Built tree: ${rootComments.length} root comments`);
    rootComments.forEach(root => {
      if (root.nestedReplies && root.nestedReplies.length > 0) {
        console.log(`  └─ Comment ${root.id} has ${root.nestedReplies.length} nested replies`);
      }
    });
    
    return rootComments;
  };

  const toggleReplies = async (messageId: string) => {
    const isExpanded = expandedReplies.has(messageId);
    
    if (isExpanded) {
      // Collapse replies
      setExpandedReplies(prev => {
        const newSet = new Set(prev);
        newSet.delete(messageId);
        return newSet;
      });
    } else {
      // Expand replies - load them if not already loaded
      setExpandedReplies(prev => new Set(prev).add(messageId));
      
      if (!messageReplies[messageId]) {
        // Load replies from server
        setLoadingReplies(prev => new Set(prev).add(messageId));
        
        try {
          const response = await messageApi.getComments(messageId);
          
          // Build comment tree from flat list
          const commentTree = buildCommentTree(response.data.comments, messageId);
          
          setMessageReplies(prev => ({
            ...prev,
            [messageId]: commentTree
          }));
        } catch (error) {
          console.error('Error loading replies:', error);
          showError('❌ Error loading replies. Please try again.');
        } finally {
          setLoadingReplies(prev => {
            const newSet = new Set(prev);
            newSet.delete(messageId);
            return newSet;
          });
        }
      }
    }
  };

  const handleEditMessage = (message: Message) => {
    setEditingMessage({ id: message.id, content: message.content });
    setNewMessage(message.content);
    textareaRef.current?.focus();
  };

  const handleDeleteMessage = async (messageId: string) => {
    if (!confirm('Are you sure you want to delete this message?')) return;
    
    try {
      await messageApi.deleteMessage(messageId);
      setMessages(prev => prev.filter(msg => msg.id !== messageId));
      showSuccess('Message deleted successfully');
    } catch (error) {
      console.error('Error deleting message:', error);
      showError('Error deleting message. Please try again.');
    }
  };

  const handleSaveEdit = async () => {
    if (!editingMessage || !newMessage.trim()) return;
    
    // Save original content for rollback
    const originalMessage = messages.find(msg => msg.id === editingMessage.id);
    if (!originalMessage) return;
    
    const originalContent = originalMessage.content;
    const newContent = newMessage.trim();
    
    // OPTIMISTIC UPDATE - мгновенно обновляем UI
    setMessages(prev => prev.map(msg =>
      msg.id === editingMessage.id
        ? {
            ...msg,
            content: newContent,
            isEdited: true,
            editedAt: new Date()
          }
        : msg
    ));
    
    // Очищаем форму сразу
    setEditingMessage(null);
    setNewMessage('');
    setSelectedFiles([]);
    setFilePreviews([]);
    
    try {
      // Отправляем на сервер в фоне
      await messageApi.updateMessage(editingMessage.id, newContent);
      showSuccess('✅ Message updated successfully');
    } catch (error) {
      console.error('Error updating message:', error);
      
      // ROLLBACK - откатываем изменения при ошибке
      setMessages(prev => prev.map(msg =>
        msg.id === editingMessage.id
          ? {
              ...msg,
              content: originalContent,
              isEdited: originalMessage.isEdited,
              editedAt: originalMessage.editedAt
            }
          : msg
      ));
      
      // Восстанавливаем режим редактирования
      setEditingMessage({ id: editingMessage.id, content: originalContent });
      setNewMessage(originalContent);
      
      showError('❌ Error updating message. Please try again.');
    }
  };

  const handleCancelEdit = () => {
    setEditingMessage(null);
    setNewMessage('');
    setSelectedFiles([]);
    setFilePreviews([]);
  };

  const handleReport = async (messageId: string) => {
    if (!isLoggedIn()) {
      setShowAuthModal(true, 'report');
      return;
    }

    const reason = prompt('Please specify the reason for reporting this content:');
    if (reason?.trim()) {
      try {
        await messageApi.reportMessage(messageId, reason.trim());
        showSuccess('🛡️ Content reported successfully. Thank you for helping keep our community safe.');
      } catch (error) {
        console.error('Error reporting message:', error);
        showError('❌ Error reporting content. Please try again.');
      }
    }
  };

  // Comment handlers
  const handleEditComment = (comment: Message, parentMessageId: string) => {
    setEditingComment({ id: comment.id, content: comment.content });
    setReplyingToComment({ commentId: comment.id, username: comment.username, parentMessageId });
    setNewMessage(comment.content);
    textareaRef.current?.focus();
  };

  const handleDeleteComment = async (commentId: string, parentMessageId: string) => {
    if (!confirm('Are you sure you want to delete this comment?')) return;
    
    try {
      await messageApi.deleteComment(commentId);
      
      // Remove from local state
      setMessageReplies(prev => ({
        ...prev,
        [parentMessageId]: prev[parentMessageId]?.filter(c => c.id !== commentId) || []
      }));
      
      // Update parent message reply count
      setMessages(prev => prev.map(msg =>
        msg.id === parentMessageId
          ? { ...msg, replies: Math.max(0, msg.replies - 1) }
          : msg
      ));
      
      showSuccess('Comment deleted successfully');
    } catch (error) {
      console.error('Error deleting comment:', error);
      showError('Error deleting comment. Please try again.');
    }
  };

  const handleSaveCommentEdit = async () => {
    if (!editingComment || !newMessage.trim() || !replyingToComment) return;
    
    const originalComment = messageReplies[replyingToComment.parentMessageId]?.find(c => c.id === editingComment.id);
    if (!originalComment) return;
    
    const originalContent = originalComment.content;
    const newContent = newMessage.trim();
    
    // OPTIMISTIC UPDATE
    setMessageReplies(prev => ({
      ...prev,
      [replyingToComment.parentMessageId]: prev[replyingToComment.parentMessageId]?.map(c =>
        c.id === editingComment.id
          ? { ...c, content: newContent, isEdited: true, editedAt: new Date() }
          : c
      ) || []
    }));
    
    setEditingComment(null);
    setReplyingToComment(null);
    setNewMessage('');
    
    try {
      await messageApi.updateComment(editingComment.id, newContent);
      showSuccess('✅ Comment updated successfully');
    } catch (error) {
      console.error('Error updating comment:', error);
      
      // ROLLBACK
      setMessageReplies(prev => ({
        ...prev,
        [replyingToComment.parentMessageId]: prev[replyingToComment.parentMessageId]?.map(c =>
          c.id === editingComment.id
            ? { ...c, content: originalContent, isEdited: originalComment.isEdited, editedAt: originalComment.editedAt }
            : c
        ) || []
      }));
      
      setEditingComment({ id: editingComment.id, content: originalContent });
      setReplyingToComment({ commentId: editingComment.id, username: originalComment.username, parentMessageId: replyingToComment.parentMessageId });
      setNewMessage(originalContent);
      
      showError('❌ Error updating comment. Please try again.');
    }
  };

  const handleCommentReaction = async (commentId: string, emoji: string, parentMessageId: string) => {
    if (!canLikeContent()) {
      setShowAuthModal(true, 'like');
      return;
    }
    
    // Рекурсивная функция для поиска комментария в дереве
    const findComment = (comments: Message[]): Message | null => {
      for (const comment of comments) {
        if (comment.id === commentId) return comment;
        if (comment.nestedReplies && comment.nestedReplies.length > 0) {
          const found = findComment(comment.nestedReplies);
          if (found) return found;
        }
      }
      return null;
    };
    
    const currentComment = findComment(messageReplies[parentMessageId] || []);
    if (!currentComment) return;
    
    const currentReactions = { ...currentComment.reactions };
    const currentUserReaction = currentComment.userReaction;
    const userId = user?._id;
    
    // Create new reactions state
    const newReactions = { ...currentReactions };
    
    // ВАЖНО: Сначала удаляем старую реакцию пользователя (если есть)
    // Это предотвращает "мерцание" когда обе реакции видны одновременно
    if (currentUserReaction && newReactions[currentUserReaction]) {
      newReactions[currentUserReaction] = {
        count: Math.max(0, newReactions[currentUserReaction].count - 1),
        users: newReactions[currentUserReaction].users.filter(id => id !== userId)
      };
      if (newReactions[currentUserReaction].count === 0) {
        delete newReactions[currentUserReaction];
      }
    }
    
    // Если пользователь кликнул на ту же реакцию - просто удаляем её (уже удалили выше)
    // Если на другую - добавляем новую
    if (currentUserReaction !== emoji) {
      if (newReactions[emoji]) {
        newReactions[emoji] = {
          count: newReactions[emoji].count + 1,
          users: [...newReactions[emoji].users, userId!]
        };
      } else {
        newReactions[emoji] = {
          count: 1,
          users: [userId!]
        };
      }
    }
    
    const newUserReaction = currentUserReaction === emoji ? undefined : emoji;
    
    // Рекурсивная функция для обновления комментария в дереве
    const updateCommentInTree = (comments: Message[]): Message[] => {
      return comments.map(comment => {
        if (comment.id === commentId) {
          return { ...comment, reactions: newReactions, userReaction: newUserReaction };
        }
        if (comment.nestedReplies && comment.nestedReplies.length > 0) {
          return {
            ...comment,
            nestedReplies: updateCommentInTree(comment.nestedReplies)
          };
        }
        return comment;
      });
    };
    
    // OPTIMISTIC UPDATE - рекурсивно обновляем дерево
    setMessageReplies(prev => ({
      ...prev,
      [parentMessageId]: updateCommentInTree(prev[parentMessageId] || [])
    }));
    
    try {
      const response = await messageApi.toggleCommentReaction(commentId, emoji);
      
      // Рекурсивная функция для синхронизации с сервером
      const syncCommentInTree = (comments: Message[]): Message[] => {
        return comments.map(comment => {
          if (comment.id === commentId) {
            return {
              ...comment,
              reactions: response.data.reactions.reduce((acc: any, r: any) => {
                acc[r.emoji] = { count: r.count, users: r.users };
                return acc;
              }, {}),
              userReaction: response.data.userReaction
            };
          }
          if (comment.nestedReplies && comment.nestedReplies.length > 0) {
            return {
              ...comment,
              nestedReplies: syncCommentInTree(comment.nestedReplies)
            };
          }
          return comment;
        });
      };
      
      // Sync with server - рекурсивно
      setMessageReplies(prev => ({
        ...prev,
        [parentMessageId]: syncCommentInTree(prev[parentMessageId] || [])
      }));
    } catch (error) {
      console.error('Error toggling comment reaction:', error);
      
      // Рекурсивная функция для rollback
      const rollbackCommentInTree = (comments: Message[]): Message[] => {
        return comments.map(comment => {
          if (comment.id === commentId) {
            return { ...comment, reactions: currentReactions, userReaction: currentUserReaction };
          }
          if (comment.nestedReplies && comment.nestedReplies.length > 0) {
            return {
              ...comment,
              nestedReplies: rollbackCommentInTree(comment.nestedReplies)
            };
          }
          return comment;
        });
      };
      
      // ROLLBACK - рекурсивно
      setMessageReplies(prev => ({
        ...prev,
        [parentMessageId]: rollbackCommentInTree(prev[parentMessageId] || [])
      }));
      
      showError('❌ Failed to update reaction. Please try again.');
    }
  };

  const handleStartKolophone = async () => {
    if (!isLoggedIn()) {
      setShowAuthModal(true, 'kolophone');
      return;
    }

    try {
      const response = await kolophoneApi.startCall({
        type: 'wall',
        targetId: activeWall
      });

      setActiveCall(response.data.call);
      setShowKolophonePanel(true);
      showSuccess('📞 Kolophone call started! Other wall members will be notified.');
    } catch (error) {
      console.error('Error starting Kolophone call:', error);
      showError('❌ Error starting call. Please try again.');
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
      
      // Add new wall to local state
      const newWall = {
        id: response.data.wall._id,
        name: response.data.wall.name,
        description: response.data.wall.description,
        icon: getCategoryIcon(response.data.wall.category),
        color: getCategoryColor(response.data.wall.category),
        participants: response.data.wall.memberCount,
        category: response.data.wall.category,
        isActive: true
      };
      
      setWalls(prev => [...prev, newWall]);
      setActiveWall(newWall.id);
      
    } catch (error) {
      console.error('Error creating wall:', error);
      showError('🏗️ Error creating wall. Please try again.');
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    addFiles(files);
  };

  const addFiles = (files: File[]) => {
    // Limit to 15 files total
    const remainingSlots = 15 - selectedFiles.length;
    const filesToAdd = files.slice(0, remainingSlots);
    
    if (filesToAdd.length < files.length) {
      showWarning(`Only ${filesToAdd.length} files added. Maximum 15 files allowed.`);
    }

    setSelectedFiles(prev => [...prev, ...filesToAdd]);
    
    // Generate previews
    filesToAdd.forEach(file => {
      if (file.type.startsWith('image/') || file.type.startsWith('video/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setFilePreviews(prev => [...prev, {
            file,
            preview: e.target?.result as string,
            type: file.type.startsWith('image/') ? 'image' : 'video'
          }]);
        };
        reader.readAsDataURL(file);
      }
    });
  };

  const removeFile = (index: number) => {
    const fileToRemove = selectedFiles[index];
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    setFilePreviews(prev => prev.filter(preview => preview.file !== fileToRemove));
    
    // Reset file input to allow re-selecting the same file
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Drag and drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    const mediaFiles = files.filter(file =>
      file.type.startsWith('image/') || file.type.startsWith('video/')
    );
    
    if (mediaFiles.length !== files.length) {
      showWarning('Only image and video files are supported');
    }
    
    if (mediaFiles.length > 0) {
      addFiles(mediaFiles);
    }
  };

  const handleStartPrivateChat = async (recipientId: string) => {
    if (!isLoggedIn()) {
      setShowAuthModal(true, 'message');
      return;
    }

    console.log('🚀 Starting private chat with:', recipientId);
    
    try {
      showInfo('💬 Creating chat...');
      const response = await chatApi.createPrivateChat(recipientId);
      console.log('📥 Chat API response:', response);
      
      // Navigate to chat page
      if (response?.data?.chat?._id) {
        console.log('✅ Navigating to chat:', response.data.chat._id);
        navigate(`/chat/${response.data.chat._id}`);
      } else {
        console.error('❌ Invalid chat response:', response);
        showError('💬 Error creating chat. Invalid response.');
      }
    } catch (error: any) {
      console.error('❌ Error starting private chat:', error);
      showError(`💬 Error starting chat: ${error.message || 'Please try again.'}`);
    }
  };

  const handleAddContact = async (userId: string) => {
    if (!isLoggedIn()) {
      setShowAuthModal(true, 'message');
      return;
    }

    const note = prompt('Add a note to your contact request (optional):');
    try {
      await contactApi.sendRequest(userId, note || undefined);
      showSuccess('👤 Contact request sent successfully!');
    } catch (error) {
      console.error('Error sending contact request:', error);
      showError('👤 Error sending contact request. Please try again.');
    }
  };

  const handleAuthLogin = () => {
    navigate('/auth');
  };

  const handleAuthRegister = () => {
    navigate('/register');
  };

  const openImageGallery = (message: Message, imageIndex: number = 0) => {
    if (!message.attachments || message.attachments.length === 0) return;
    
    setImageGalleryModal({
      isOpen: true,
      images: message.attachments.map(att => ({
        url: att.url,
        filename: att.filename,
        type: att.type as 'image' | 'video'
      })),
      initialIndex: imageIndex,
      author: {
        username: message.username,
        avatar: message.avatar
      }
    });
  };

  const handleDownloadSuccess = () => {
    showSuccess('📥 File downloaded successfully!');
  };

  const closeImageGallery = () => {
    setImageGalleryModal(null);
  };

  // Находим текущую стену из ПОЛНОГО кэша стен (allWalls), а не из отфильтрованного списка (walls)
  // Это гарантирует, что информация о стене всегда доступна, даже если она не входит в текущий фильтр категорий
  const currentWall = allWalls.find(w => w.id === activeWall);

  return (
    <>
      <div className="min-h-screen bg-dark-900 flex flex-col">
        <Header 
          activeWall={currentWall} 
          showWalls={showWalls}
          setShowWalls={(show) => {
            // Когда открываем список стен, автоматически переключаемся на категорию текущей стены
            if (show && currentWall && currentWall.category) {
              setLastOpenedWallsCategory(currentWall.category);
              setSelectedCategory(currentWall.category);
            } else if (!show && lastOpenedWallsCategory) {
              // Когда закрываем список стен, возвращаемся к категории которая была при открытии
              setSelectedCategory(lastOpenedWallsCategory);
              setLastOpenedWallsCategory(null);
            }
            setShowWalls(show);
          }}
          wallsCount={lastOpenedWallsCategory && !showWalls 
            ? allWalls.filter(w => w.category === lastOpenedWallsCategory).length 
            : walls.length}
          loadingWalls={false}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          categories={categories}
        />
        
        <div className="flex-1">
        {/* Backdrop Blur Overlay - показывается когда список стен открыт */}
        {showWalls && (
          <div 
            className="fixed inset-0 bg-dark-900/60 backdrop-blur-sm z-10 transition-all duration-300"
            onClick={() => setShowWalls(false)}
          />
        )}

        {/* Walls list - Compact Modern Design */}
        <div className={`bg-gradient-to-r from-dark-800 via-dark-700 to-dark-800 transition-all duration-300 fixed top-16 left-0 right-0 lg:right-80 z-20 ${showWalls ? 'opacity-100 h-[370px] shadow-2xl shadow-dark-900/50' : 'opacity-0 h-0 overflow-hidden'}`}>
          <div className="container mx-auto px-4 py-3">
            {showWalls && (
              <div className="animate-fade-in">
                {/* Header with Category Filters - Compact */}
                <div className="space-y-3 mb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Users className="w-4 h-4 text-primary-400" />
                      <h3 className="text-white font-semibold text-sm">Available Walls</h3>
                      <span className="text-xs text-gray-400 bg-dark-600 px-2 py-0.5 rounded-full">{filteredWalls.length}</span>
                    </div>
                    
                    <button
                      onClick={() => setShowWalls(false)}
                      className="text-gray-400 hover:text-white transition-all p-1.5 rounded-full hover:bg-dark-600 group"
                    >
                      <X className="w-4 h-4 group-hover:rotate-90 transition-transform" />
                    </button>
                  </div>
                  
                  {/* Category Filters and Search */}
                  <div className="flex items-center gap-2">
                    {/* Category Filters - Hide when search is focused */}
                    <div className={`flex items-center space-x-1.5 flex-1 overflow-x-auto scrollbar-hide transition-all duration-300 ${isSearchFocused ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100'}`}>
                      {categories.map((category, index) => (
                        <button
                          key={category.id}
                          onClick={() => setSelectedCategory(category.id)}
                          className={`px-2.5 py-1 rounded-xl text-xs font-medium transition-all transform hover:scale-105 whitespace-nowrap ${
                            selectedCategory === category.id
                              ? 'bg-gradient-to-r from-primary-500 to-accent-purple text-white shadow-lg shadow-primary-500/20'
                              : 'bg-dark-700/50 border border-dark-600 text-gray-400 hover:text-white hover:border-primary-500/50'
                          }`}
                          style={{
                            animationDelay: `${index * 30}ms`
                          }}
                        >
                          {category.name}
                        </button>
                      ))}
                    </div>
                    
                    {/* Search Input - Animated expansion */}
                    <div className={`relative flex-shrink-0 transition-all duration-300 ${isSearchFocused ? 'w-full' : 'w-48'}`}>
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-500" />
                      <input
                        type="text"
                        value={wallSearchQuery}
                        onChange={(e) => setWallSearchQuery(e.target.value)}
                        onFocus={() => setIsSearchFocused(true)}
                        onBlur={() => setIsSearchFocused(false)}
                        placeholder="Search walls..."
                        className="w-full bg-dark-700/50 border border-dark-600 text-white placeholder-gray-500 pl-9 pr-3 py-1 rounded-xl text-xs focus:outline-none focus:border-primary-500/50 transition-all"
                      />
                      {wallSearchQuery && (
                        <button
                          onMouseDown={(e) => {
                            e.preventDefault(); // Prevent blur
                            setWallSearchQuery('');
                          }}
                          className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Walls Grid - Compact Cards */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 max-h-[320px] overflow-y-auto px-2 pt-2 pb-6" style={{ scrollbarWidth: 'thin', scrollbarColor: '#4B5563 #1F2937' }}>
                  {loadingWalls ? (
                    /* Wall Skeleton Loading */
                    Array(10).fill(0).map((_, i) => (
                      <div
                        key={i}
                        className="p-3 rounded-xl border border-dark-600 bg-gradient-to-br from-dark-700 to-dark-800 animate-pulse"
                        style={{ animationDelay: `${i * 50}ms` }}
                      >
                        {/* Icon & Name Skeleton */}
                        <div className="flex items-center space-x-2 mb-2">
                          <div className="p-1.5 rounded-lg bg-dark-600 w-7 h-7"></div>
                          <div className="h-3 bg-dark-600 rounded w-20"></div>
                        </div>
                        
                        {/* Description Skeleton */}
                        <div className="space-y-1.5 mb-2">
                          <div className="h-2 bg-dark-600 rounded w-full"></div>
                          <div className="h-2 bg-dark-600 rounded w-5/6"></div>
                        </div>
                        
                        {/* Stats Skeleton */}
                        <div className="flex items-center justify-between pt-2 border-t border-dark-600/30">
                          <div className="flex items-center space-x-1">
                            <div className="w-3 h-3 bg-dark-600 rounded-full"></div>
                            <div className="h-2 bg-dark-600 rounded w-5"></div>
                          </div>
                          <div className="flex items-center space-x-1">
                            <div className="w-2 h-2 bg-dark-600 rounded-full"></div>
                            <div className="h-2 bg-dark-600 rounded w-8"></div>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : filteredWalls.length === 0 ? (
                    /* No Walls Found */
                    <div className="col-span-full flex flex-col items-center justify-center py-12 px-4">
                      <div className="w-16 h-16 bg-dark-600/50 rounded-full flex items-center justify-center mb-4">
                        <Users className="w-8 h-8 text-gray-500" />
                      </div>
                      <h3 className="text-white font-semibold text-lg mb-2">No Walls Found</h3>
                      <p className="text-gray-400 text-sm text-center max-w-md mb-4">
                        {selectedCategory === 'all' 
                          ? 'There are no walls available at the moment.'
                          : `No walls found in the "${categories.find(c => c.id === selectedCategory)?.name}" category.`
                        }
                      </p>
                      {selectedCategory !== 'all' && (
                        <button
                          onClick={() => setSelectedCategory('all')}
                          className="text-primary-400 hover:text-primary-300 text-sm font-medium transition-colors"
                        >
                          View all categories
                        </button>
                      )}
                    </div>
                  ) : (
                    filteredWalls.map((wall, index) => (
                      <button
                      key={wall.id}
                      onClick={() => {
                        // Только переходим на стену если она не активна
                        // Это предотвращает сброс состояния при просмотре списка стен
                        if (activeWall !== wall.id) {
                          navigate(`/koltech-line/${wall.id}`);
                        }
                        setShowWalls(false);
                      }}
                      className={`p-3 rounded-xl border transition-all duration-200 group text-left relative hover:z-10 ${
                        activeWall === wall.id
                          ? 'bg-gradient-to-br ' + wall.color + ' border-transparent text-white shadow-lg scale-[1.02]'
                          : 'bg-gradient-to-br from-dark-700 to-dark-800 border-dark-600 text-gray-300 hover:border-primary-500/50 hover:shadow-md hover:scale-[1.02]'
                      }`}
                      style={{
                        animationDelay: `${index * 30}ms`
                      }}
                    >
                      {/* Icon & Name */}
                      <div className="flex items-center space-x-2 mb-2">
                        <div className={`p-1.5 rounded-lg ${activeWall === wall.id ? 'bg-white/20' : 'bg-gradient-to-r ' + wall.color}`}>
                          {wall.icon && <wall.icon className="w-3.5 h-3.5" />}
                        </div>
                        <span className="font-semibold text-xs truncate flex-1">{wall.name}</span>
                      </div>
                      
                      {/* Description */}
                      <p className={`text-xs mb-2 line-clamp-2 leading-tight ${activeWall === wall.id ? 'opacity-90' : 'opacity-70'}`}>
                        {wall.description}
                      </p>
                      
                      {/* Stats */}
                      <div className="flex items-center justify-between pt-2 border-t border-current/10">
                        <div className="flex items-center space-x-1">
                          <Users className="w-3 h-3 opacity-70" />
                          <span className="text-xs font-medium">{wall.participants}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></div>
                          <span className="text-xs opacity-70">Live</span>
                        </div>
                      </div>
                      </button>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Filters - Enhanced modern design */}
        {(selectedTags.length > 0 || showFilters) && (
          <div className="bg-gradient-to-r from-dark-800 via-dark-700 to-dark-800 border-b border-dark-600 py-3">
            <div className="container mx-auto px-4">
              {/* Active tags */}
              {selectedTags.length > 0 && (
                <div className="flex items-center space-x-2 overflow-x-auto scrollbar-hide pb-2">
                  <div className="flex items-center space-x-2 bg-dark-700/50 px-3 py-1.5 rounded-xl border border-dark-600">
                    <Hash className="w-4 h-4 text-primary-400" />
                    <span className="text-gray-400 text-sm font-medium">Active:</span>
                  </div>
                  {selectedTags.map((tag, index) => (
                    <span
                      key={tag}
                      onClick={() => toggleTag(tag)}
                      className="bg-gradient-to-r from-accent-purple to-primary-500 text-white px-3 py-1.5 rounded-xl text-xs font-medium cursor-pointer hover:shadow-lg hover:shadow-accent-purple/30 transition-all flex items-center space-x-1 group"
                      style={{
                        animationDelay: `${index * 50}ms`
                      }}
                    >
                      <span>#{tag}</span>
                      <span className="group-hover:scale-125 transition-transform">×</span>
                    </span>
                  ))}
                </div>
              )}

              {/* Extended filters */}
              {showFilters && (
                <div className="mt-4 p-5 bg-gradient-to-br from-dark-700 to-dark-800 rounded-2xl border border-dark-600 shadow-xl">
                  <div className="grid md:grid-cols-3 gap-6">
                    {/* Categories */}
                    <div>
                      <h4 className="text-white font-bold mb-4 flex items-center space-x-2">
                        <Filter className="w-4 h-4 text-primary-400" />
                        <span>Categories</span>
                      </h4>
                      <div className="space-y-2">
                        {categories.map(category => (
                          <label key={category.id} className="flex items-center space-x-3 p-2 rounded-lg hover:bg-dark-600/50 transition-colors cursor-pointer group">
                            <input
                              type="radio"
                              name="category"
                              checked={selectedCategory === category.id}
                              onChange={() => setSelectedCategory(category.id)}
                              className="text-primary-500 w-4 h-4"
                            />
                            <span className="text-gray-300 text-sm group-hover:text-white transition-colors">{category.name}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Participants */}
                    <div>
                      <h4 className="text-white font-bold mb-4 flex items-center space-x-2">
                        <Users className="w-4 h-4 text-accent-purple" />
                        <span>Wall Size</span>
                      </h4>
                      <div className="space-y-2">
                        {participantRanges.map(range => (
                          <label key={range.id} className="flex items-center space-x-3 p-2 rounded-lg hover:bg-dark-600/50 transition-colors cursor-pointer group">
                            <input
                              type="radio"
                              name="participants"
                              checked={selectedParticipants === range.id}
                              onChange={() => setSelectedParticipants(range.id)}
                              className="text-primary-500 w-4 h-4"
                            />
                            <span className="text-gray-300 text-sm group-hover:text-white transition-colors">{range.name}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Tags */}
                    <div>
                      <h4 className="text-white font-bold mb-4 flex items-center space-x-2">
                        <Hash className="w-4 h-4 text-green-400" />
                        <span>Popular Tags</span>
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {popularTags.map((tag, index) => (
                          <button
                            key={tag}
                            onClick={() => toggleTag(tag)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all transform hover:scale-105 ${
                              selectedTags.includes(tag)
                                ? 'bg-gradient-to-r from-accent-purple to-primary-500 text-white shadow-lg'
                                : 'bg-dark-600 text-gray-400 hover:text-white hover:bg-dark-500 border border-dark-500'
                            }`}
                            style={{
                              animationDelay: `${index * 30}ms`
                            }}
                          >
                            #{tag}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Main Content Area - Full width with sidebar space */}
        <div className="flex-1 flex w-full">
          {/* Messages Feed - With right padding to account for fixed sidebar */}
          <div className="flex-1 flex flex-col lg:pr-80">
            {/* Current Wall Header - Enhanced modern design */}
            <div className={`bg-gradient-to-r from-dark-800 via-dark-700 to-dark-800 p-4 fixed left-0 right-0 lg:right-80 z-30 border-b border-dark-600 shadow-lg backdrop-blur-sm transition-all duration-300 ${showWalls ? 'top-[436px] blur-sm opacity-60 pointer-events-none' : 'top-16'}`}>
              <div className="container mx-auto">
                {!activeWall ? (
                  /* Header Skeleton */
                  <div className="flex items-center justify-between animate-pulse">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-dark-600 rounded-xl"></div>
                      <div>
                        <div className="h-3 bg-dark-600 rounded w-48 mb-2"></div>
                        <div className="flex items-center space-x-3">
                          <div className="h-2 bg-dark-600 rounded w-20"></div>
                          <div className="h-2 bg-dark-600 rounded w-16"></div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="h-9 bg-dark-600 rounded-xl w-20"></div>
                      <div className="h-9 w-9 bg-dark-600 rounded-xl"></div>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className={`p-3 bg-gradient-to-r ${currentWall?.color} rounded-xl shadow-lg`}>
                        {currentWall?.icon && <currentWall.icon className="w-6 h-6 text-white" />}
                      </div>
                      <div>
                        <p className="text-gray-300 text-sm truncate max-w-md font-medium">{currentWall?.description}</p>
                        <div className="flex items-center space-x-3 mt-1">
                          <div className="flex items-center space-x-1">
                            <Users className="w-3 h-3 text-primary-400" />
                            <span className="text-xs text-gray-400">{currentWall?.participants} members</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                            <span className="text-xs text-green-400">Active</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      {isLoggedIn() && currentWall && !currentWall.isMember ? (
                        <button
                          onClick={() => handleJoinWall(currentWall.id)}
                          className="flex items-center space-x-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-2 rounded-xl hover:shadow-lg hover:shadow-green-500/30 transition-all text-sm font-medium group"
                        >
                          <UserPlus className="w-4 h-4 group-hover:scale-110 transition-transform" />
                          <span>Join</span>
                        </button>
                      ) : (
                        isLoggedIn() && currentWall && currentWall.isMember && (
                          <button
                            onClick={handleStartKolophone}
                            className="flex items-center space-x-2 bg-gradient-to-r from-primary-500 to-accent-purple text-white px-4 py-2 rounded-xl hover:shadow-lg hover:shadow-primary-500/30 transition-all text-sm font-medium group"
                          >
                            <PhoneCall className="w-4 h-4 group-hover:scale-110 transition-transform" />
                            <span>Call</span>
                          </button>
                        )
                      )}
                      
                      <button className="p-2.5 bg-dark-700/50 border border-dark-600 text-gray-400 rounded-xl hover:text-white hover:border-primary-500/50 transition-all">
                        <Search className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Messages */}
            <div className={`flex-1 overflow-y-auto p-6 pb-40 container mx-auto relative transition-all duration-300 ${showWalls ? 'pt-[654px] blur-sm opacity-60 pointer-events-none' : 'pt-44'}`} onScroll={(e) => {
              const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
              if (scrollHeight - scrollTop <= clientHeight * 1.5 && hasMoreMessages && !loadingMore) {
                loadMoreMessages();
              }
            }}>
              {/* Animated background */}
              <div className="fixed inset-0 pointer-events-none opacity-30">
                <div className="absolute top-20 left-10 w-72 h-72 bg-primary-500/10 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute top-40 right-20 w-96 h-96 bg-accent-purple/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
                <div className="absolute bottom-40 left-1/3 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
              </div>

              {!activeWall ? (
                /* No Wall Selected Placeholder */
                <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
                  <div className="text-center max-w-md px-6 animate-fade-in">
                    <div className="w-24 h-24 bg-gradient-to-br from-primary-500 to-accent-purple rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-primary-500/30 animate-pulse">
                      <Users className="w-12 h-12 text-white" />
                    </div>
                    <h2 className="text-white text-3xl font-bold mb-3">Welcome to KolTech Line</h2>
                    <p className="text-gray-400 text-lg mb-8">
                      Choose a wall to start connecting with professionals, entrepreneurs, and innovators
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                      <button
                        onClick={() => setShowWalls(true)}
                        className="bg-gradient-to-r from-primary-500 to-accent-purple text-white px-6 py-3 rounded-xl font-semibold text-base hover:shadow-2xl hover:shadow-primary-500/40 transition-all transform hover:scale-105 flex items-center space-x-2 group whitespace-nowrap"
                      >
                        <Users className="w-5 h-5 group-hover:scale-110 transition-transform" />
                        <span>Choose a Wall</span>
                      </button>
                      
                      <span className="text-gray-500 text-base font-medium">or</span>
                      
                      <button
                        onClick={handleCreateWall}
                        className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-3 rounded-xl font-semibold text-base hover:shadow-2xl hover:shadow-green-500/40 transition-all transform hover:scale-105 flex items-center space-x-2 group whitespace-nowrap"
                      >
                        <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" />
                        <span>Create Wall</span>
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
              <div className="max-w-3xl mx-auto space-y-6 relative z-10">
                {loading ? (
                  /* Skeleton Loading */
                  <div className="space-y-6">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div
                        key={i}
                        className="rounded-2xl p-4 bg-gradient-to-br from-dark-800 to-dark-700 border border-dark-600 shadow-lg animate-pulse"
                        style={{ animationDelay: `${i * 100}ms` }}
                      >
                        {/* Header Skeleton */}
                        <div className="flex items-start space-x-3 mb-2">
                          {/* Avatar Skeleton */}
                          <div className="w-9 h-9 rounded-full bg-dark-600"></div>
                          
                          <div className="flex-1 min-w-0">
                            {/* Name and Time Skeleton */}
                            <div className="flex items-center space-x-2 mb-2">
                              <div className="h-3 bg-dark-600 rounded w-24"></div>
                              <div className="h-2 bg-dark-600 rounded w-12"></div>
                            </div>
                            
                            {/* Content Skeleton */}
                            <div className="space-y-2">
                              <div className="h-3 bg-dark-600 rounded w-full"></div>
                              <div className="h-3 bg-dark-600 rounded w-5/6"></div>
                              <div className="h-3 bg-dark-600 rounded w-4/6"></div>
                            </div>
                            
                            {/* Tags Skeleton */}
                            <div className="flex gap-1.5 mt-2">
                              <div className="h-5 bg-dark-600 rounded w-16"></div>
                              <div className="h-5 bg-dark-600 rounded w-20"></div>
                            </div>
                          </div>
                        </div>
                        
                        {/* Reactions Skeleton */}
                        <div className="flex items-center gap-1.5 mt-2">
                          <div className="h-6 bg-dark-600 rounded-full w-12"></div>
                          <div className="h-6 bg-dark-600 rounded-full w-12"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  messages.map((message) => {
                    const isOwnMessage = user && message.userId === user._id;
                    return (
                    <div
                      key={message.id}
                      className={`group relative rounded-2xl transition-all duration-200 shadow-lg hover:shadow-xl ${
                        isOwnMessage
                          ? 'bg-gradient-to-br from-primary-500/15 to-accent-purple/15 border border-primary-500/40 hover:border-primary-500/60 hover:shadow-primary-500/20'
                          : 'bg-gradient-to-br from-dark-800 to-dark-700 border border-dark-600 hover:border-primary-500/30 hover:shadow-dark-900/50'
                      }`}
                      onMouseEnter={() => {
                        // Показываем реакции только если НЕ наводим на область комментариев
                        if (!isHoveringComments) {
                          setShowReactionPicker(message.id);
                        }
                      }}
                      onMouseLeave={() => setShowReactionPicker(null)}
                    >
                    {/* Message Header - Compact */}
                    <div className="flex items-start space-x-3 p-4 pb-3 rounded-t-2xl overflow-hidden">
                      <Link to={`/user/${message.userId}`} className="flex-shrink-0">
                        <img
                          src={message.avatar}
                          alt={message.username}
                          className="w-9 h-9 rounded-full object-cover border-2 border-transparent hover:border-primary-500/50 transition-colors"
                        />
                      </Link>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-1">
                          <Link to={`/user/${message.userId}`} className="group">
                            <h3 className="text-white font-medium text-sm group-hover:text-primary-400 transition-colors">
                              {message.username}
                            </h3>
                          </Link>
                          <span className="text-gray-500 text-xs">
                            {formatTime(message.timestamp)}
                          </span>
                          {message.isEdited && (
                            <span className="text-xs text-gray-500">edited</span>
                          )}
                          {message.isPinned && (
                            <Pin className="w-3 h-3 text-primary-400" />
                          )}
                        </div>

                        {/* Message Content */}
                        {message.content && (
                          <p className="text-gray-300 leading-relaxed text-sm">{message.content}</p>
                        )}
                      </div>
                    </div>
                      
                    {/* Attachments - Full Width Carousel */}
                    {message.attachments && message.attachments.length > 0 && (
                      <div className="overflow-hidden">
                        <ImageCarousel
                          attachments={message.attachments}
                          onImageClick={(index) => openImageGallery(message, index)}
                        />
                      </div>
                    )}

                    {/* Tags - Below carousel */}
                    {message.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 px-4 pt-3 overflow-hidden">
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

                    {/* Compact Message Footer - Reaction counters */}
                    <div className="px-4 pb-4 pt-2 rounded-b-2xl">
                      {/* Show counters only if there are reactions or replies */}
                      {((message.reactions && Object.keys(message.reactions).length > 0) || message.replies > 0) && (
                        <div className="relative flex items-center gap-1.5 flex-wrap">
                          {message.reactions && Object.entries(message.reactions).map(([emoji, data]) => (
                            <div 
                              key={emoji}
                              className="flex items-center bg-dark-700/50 rounded-full px-1.5 py-0.5 cursor-pointer hover:bg-dark-700 transition-colors text-xs"
                              onClick={() => setShowReactionPicker(showReactionPicker === message.id ? null : message.id)}
                            >
                              <span>{emoji}</span>
                              <span className="text-gray-400 ml-1">{data.count}</span>
                            </div>
                          ))}
                          {message.replies > 0 && (
                            <button
                              onClick={() => toggleReplies(message.id)}
                              className="text-xs text-blue-400 hover:text-blue-300 transition-colors flex items-center space-x-1 px-1.5"
                            >
                              <MessageCircle className="w-3 h-3" />
                              <span>{message.replies}</span>
                            </button>
                          )}
                          
                          {/* Reaction Picker - компактный - показываем только если НЕ в области комментариев */}
                          {showReactionPicker === message.id && !isHoveringComments && (
                            <div className="absolute left-0 top-full mt-1 bg-dark-700 border border-dark-600 rounded-full px-2 py-1.5 shadow-xl flex items-center gap-1 animate-scale-in z-50 reaction-picker-container">
                              {['❤️', '👍', '😂', '😮', '😢', '🔥'].map((emoji) => (
                                <button
                                  key={emoji}
                                  onClick={async (e) => {
                                    e.stopPropagation();
                                    if (!canLikeContent()) {
                                      setShowAuthModal(true, 'like');
                                      setShowReactionPicker(null);
                                      return;
                                    }
                                    
                                    // OPTIMISTIC UPDATE - мгновенно обновляем UI
                                    const currentReactions = { ...message.reactions };
                                    const currentUserReaction = message.userReaction;
                                    const userId = user?._id;
                                    
                                    // Создаём новое состояние реакций
                                    const newReactions = { ...currentReactions };
                                    
                                    // ВАЖНО: Сначала удаляем старую реакцию пользователя (если есть)
                                    // Это предотвращает "мерцание" когда обе реакции видны одновременно
                                    if (currentUserReaction && newReactions[currentUserReaction]) {
                                      newReactions[currentUserReaction] = {
                                        count: Math.max(0, newReactions[currentUserReaction].count - 1),
                                        users: newReactions[currentUserReaction].users.filter(id => id !== userId)
                                      };
                                      if (newReactions[currentUserReaction].count === 0) {
                                        delete newReactions[currentUserReaction];
                                      }
                                    }
                                    
                                    // Если пользователь кликнул на ту же реакцию - просто удаляем её (уже удалили выше)
                                    // Если на другую - добавляем новую
                                    if (currentUserReaction !== emoji) {
                                      if (newReactions[emoji]) {
                                        newReactions[emoji] = {
                                          count: newReactions[emoji].count + 1,
                                          users: [...newReactions[emoji].users, userId!]
                                        };
                                      } else {
                                        newReactions[emoji] = {
                                          count: 1,
                                          users: [userId!]
                                        };
                                      }
                                    }
                                    
                                    const newUserReaction = currentUserReaction === emoji ? undefined : emoji;
                                    
                                    // Мгновенно обновляем UI (Optimistic Update)
                                    setMessages(prev => prev.map(msg =>
                                      msg.id === message.id
                                        ? {
                                            ...msg,
                                            reactions: newReactions,
                                            userReaction: newUserReaction
                                          }
                                        : msg
                                    ));
                                    
                                    // Отправляем запрос на сервер в фоне
                                    try {
                                      const response = await messageApi.toggleReaction(message.id, emoji);
                                      
                                      // Синхронизируем с реальными данными от сервера
                                      setMessages(prev => prev.map(msg =>
                                        msg.id === message.id
                                          ? {
                                              ...msg,
                                              reactions: response.data.reactions.reduce((acc: any, r: any) => {
                                                acc[r.emoji] = { count: r.count, users: r.users };
                                                return acc;
                                              }, {}),
                                              userReaction: response.data.userReaction
                                            }
                                          : msg
                                      ));
                                    } catch (error) {
                                      console.error('Error toggling reaction:', error);
                                      
                                      // В случае ошибки - откатываем изменения (Rollback)
                                      setMessages(prev => prev.map(msg =>
                                        msg.id === message.id
                                          ? {
                                              ...msg,
                                              reactions: currentReactions,
                                              userReaction: currentUserReaction
                                            }
                                          : msg
                                      ));
                                      
                                      showError('❌ Failed to update reaction. Please try again.');
                                    }
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
                      )}
                      
                      {/* Replies Section */}
                      {expandedReplies.has(message.id) && (
                        <div 
                          className="mt-4 ml-4 pl-4 border-l-2 border-primary-500/30 space-y-3"
                          onMouseEnter={() => {
                            setIsHoveringComments(message.id);
                            setShowReactionPicker(null); // Скрываем реакции основного сообщения
                          }}
                          onMouseLeave={() => {
                            setIsHoveringComments(null);
                            setShowCommentReactionPicker(null); // Скрываем реакции комментариев
                          }}
                        >
                          {loadingReplies.has(message.id) ? (
                            /* Comment Skeleton Loading */
                            <div className="space-y-3">
                              {[1, 2, 3].map((i) => (
                                <div
                                  key={i}
                                  className="rounded-xl p-3 bg-gradient-to-br from-dark-700/50 to-dark-800/50 border border-dark-600 animate-pulse"
                                  style={{ animationDelay: `${i * 100}ms` }}
                                >
                                  <div className="flex items-start space-x-2">
                                    {/* Avatar Skeleton */}
                                    <div className="w-7 h-7 rounded-full bg-dark-600"></div>
                                    
                                    <div className="flex-1 min-w-0">
                                      {/* Name and Time Skeleton */}
                                      <div className="flex items-center space-x-2 mb-2">
                                        <div className="h-3 bg-dark-600 rounded w-20"></div>
                                        <div className="h-2 bg-dark-600 rounded w-8"></div>
                                      </div>
                                      
                                      {/* Content Skeleton */}
                                      <div className="space-y-1.5">
                                        <div className="h-2.5 bg-dark-600 rounded w-full"></div>
                                        <div className="h-2.5 bg-dark-600 rounded w-4/5"></div>
                                      </div>
                                    </div>
                                  </div>
                                  
                                  {/* Reactions Skeleton */}
                                  <div className="flex items-center gap-1.5 mt-2 ml-9">
                                    <div className="h-5 bg-dark-600 rounded-full w-10"></div>
                                    <div className="h-5 bg-dark-600 rounded-full w-10"></div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            messageReplies[message.id]?.map((comment) => (
                              <Comment
                                key={comment.id}
                                comment={comment}
                                parentMessageId={message.id}
                                currentUserId={user?._id}
                                isLoggedIn={isLoggedIn()}
                                level={0}
                                highlightedCommentId={highlightedCommentId}
                                onReply={(commentId, username) => {
                                  setReplyingToComment({ commentId, username, parentMessageId: message.id });
                                  setNewMessage(`@${username} `);
                                  textareaRef.current?.focus();
                                }}
                                onEdit={(comment) => handleEditComment(comment, message.id)}
                                onDelete={(commentId) => handleDeleteComment(commentId, message.id)}
                                onReaction={(commentId, emoji) => handleCommentReaction(commentId, emoji, message.id)}
                                onStartChat={handleStartPrivateChat}
                                onAddContact={handleAddContact}
                                onReport={handleReport}
                                onImageClick={(comment, imageIndex) => {
                                  setImageGalleryModal({
                                    isOpen: true,
                                    images: comment.attachments!.map((att: any) => ({
                                      url: att.url,
                                      filename: att.filename,
                                      type: att.type as 'image' | 'video'
                                    })),
                                    initialIndex: imageIndex,
                                    author: {
                                      username: comment.username,
                                      avatar: comment.avatar
                                    }
                                  });
                                }}
                                formatTime={formatTime}
                              />
                            ))
                          )}
                        </div>
                      )}
                    </div>
                    
                    {/* Hover Actions - Compact */}
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity message-menu-container">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setMessageMenuOpen(messageMenuOpen === message.id ? null : message.id);
                        }}
                        className="p-1.5 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-dark-700"
                      >
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                      
                      {/* Dropdown Menu */}
                      {messageMenuOpen === message.id && (
                        <div className="absolute right-0 top-full mt-1 w-48 bg-dark-700 border border-dark-600 rounded-xl shadow-2xl z-[100] overflow-hidden message-menu-container">
                          <button
                            onClick={() => {
                              handleComment(message.id);
                              setMessageMenuOpen(null);
                            }}
                            className="w-full text-left px-3 py-2 text-gray-300 hover:bg-dark-600 hover:text-white transition-colors flex items-center space-x-2 text-sm"
                          >
                            <MessageCircle className="w-4 h-4" />
                            <span>Reply</span>
                          </button>
                          
                          {isLoggedIn() && message.userId === user?._id && (
                            <>
                              <button
                                onClick={() => {
                                  handleEditMessage(message);
                                  setMessageMenuOpen(null);
                                }}
                                className="w-full text-left px-3 py-2 text-gray-300 hover:bg-dark-600 hover:text-white transition-colors flex items-center space-x-2 text-sm"
                              >
                                <Settings className="w-4 h-4" />
                                <span>Edit</span>
                              </button>
                              
                              <button
                                onClick={() => {
                                  handleDeleteMessage(message.id);
                                  setMessageMenuOpen(null);
                                }}
                                className="w-full text-left px-3 py-2 text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors flex items-center space-x-2 text-sm"
                              >
                                <Flag className="w-4 h-4" />
                                <span>Delete</span>
                              </button>
                            </>
                          )}
                          
                          {isLoggedIn() && message.userId !== user?._id && (
                            <>
                              <button
                                onClick={() => {
                                  handleStartPrivateChat(message.userId);
                                  setMessageMenuOpen(null);
                                }}
                                className="w-full text-left px-3 py-2 text-gray-300 hover:bg-dark-600 hover:text-white transition-colors flex items-center space-x-2 text-sm"
                              >
                                <Phone className="w-4 h-4" />
                                <span>Message</span>
                              </button>
                              
                              <button
                                onClick={() => {
                                  handleAddContact(message.userId);
                                  setMessageMenuOpen(null);
                                }}
                                className="w-full text-left px-3 py-2 text-gray-300 hover:bg-dark-600 hover:text-white transition-colors flex items-center space-x-2 text-sm"
                              >
                                <UserPlus className="w-4 h-4" />
                                <span>Add Contact</span>
                              </button>
                              
                              <button
                                onClick={() => {
                                  handleReport(message.id);
                                  setMessageMenuOpen(null);
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
                            onClick={() => setMessageMenuOpen(null)}
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
                  })
                )}
                
                {/* Load More Button */}
                {!loading && hasMoreMessages && (
                  <div className="flex justify-center py-6">
                    <button
                      onClick={loadMoreMessages}
                      disabled={loadingMore}
                      className={`px-6 py-3 rounded-xl transition-all ${
                        loadingMore
                          ? 'bg-dark-600 text-gray-500 cursor-not-allowed'
                          : 'bg-dark-700 text-gray-300 hover:bg-dark-600 hover:text-white border border-dark-600'
                      }`}
                    >
                      {loadingMore ? (
                        <div className="flex items-center space-x-2">
                          <div className="w-4 h-4 border-2 border-gray-500 border-t-transparent rounded-full animate-spin"></div>
                          <span>Loading more...</span>
                        </div>
                      ) : (
                        'Load More Messages'
                      )}
                    </button>
                  </div>
                )}
                
                {!loading && !hasMoreMessages && messages.length > 0 && (
                  <div className="text-center py-6">
                    <p className="text-gray-500 text-sm">You've reached the end of messages</p>
                  </div>
                )}
              </div>
              )}
            </div>

            {/* Message Input - Modern Telegram-style - Only show when wall is selected */}
            {activeWall && (
            <div className={`bg-gradient-to-r from-dark-800 via-dark-700 to-dark-800 border-t border-dark-600 fixed bottom-0 left-0 right-0 lg:right-80 z-10 shadow-2xl transition-all duration-300 ${showWalls ? 'blur-sm opacity-60 pointer-events-none' : ''}`}>
              <div className="py-2 px-4">
                <div className="container mx-auto">
                <div
                  className={`bg-gradient-to-br from-dark-700 to-dark-800 rounded-2xl p-2 border transition-all shadow-lg ${
                    isDragging ? 'border-primary-500 bg-primary-500/5 shadow-primary-500/30' : 'border-dark-600'
                  }`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  {isDragging && (
                    <div className="absolute inset-0 bg-gradient-to-br from-primary-500/20 to-accent-purple/20 border-2 border-primary-500 border-dashed rounded-2xl flex items-center justify-center z-10 backdrop-blur-sm">
                      <div className="text-center">
                        <Image className="w-8 h-8 text-primary-400 mx-auto mb-1" />
                        <p className="text-primary-400 text-sm font-medium">Drop files here</p>
                      </div>
                    </div>
                  )}
                  
                  <div className="flex items-center space-x-2">
                    <div className="flex-1">
                      <textarea
                        ref={textareaRef}
                        value={newMessage}
                        onChange={(e) => {
                          handleInputChange(e);
                          // Auto-resize textarea with max height of 80px
                          const target = e.target;
                          target.style.height = 'auto';
                          target.style.height = Math.min(target.scrollHeight, 80) + 'px';
                        }}
                        onKeyDown={handleKeyPress}
                        placeholder={
                          editingMessage ? 'Edit message...' :
                          replyingTo ? `Reply to ${replyingTo.username}...` :
                          `Message ${currentWall?.name}...`
                        }
                        className="w-full bg-gradient-to-br from-dark-600 to-dark-700 border border-dark-500 text-white placeholder-gray-500 resize-none focus:outline-none focus:border-primary-500/50 min-h-[36px] max-h-[80px] overflow-y-auto scrollbar-hide rounded-xl px-3 py-2 text-sm transition-all"
                        style={{
                          height: '36px'
                        }}
                      />
                    </div>
                    
                    <div className="flex items-center space-x-1">
                      <input
                        ref={fileInputRef}
                        type="file"
                        multiple
                        accept="image/*,video/*"
                        onChange={handleFileSelect}
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
                        onClick={handleSendMessage}
                        disabled={(!newMessage.trim() && selectedFiles.length === 0) || sendingMessage}
                        className={`p-2 rounded-xl transition-all ${
                          (newMessage.trim() || selectedFiles.length > 0) && !sendingMessage
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
                          onClick={() => {
                            setReplyingToComment(null);
                            setNewMessage('');
                          }}
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
                          onClick={() => setReplyingTo(null)}
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
                          onClick={() => {
                            setEditingComment(null);
                            setReplyingToComment(null);
                            setNewMessage('');
                          }}
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
                          onClick={handleCancelEdit}
                          className="text-gray-400 hover:text-white text-xs"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Wall Membership Warning - Modern */}
                  {isLoggedIn() && currentWall && !currentWall.isMember && (
                    <div className="mb-2 p-2 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 rounded-xl border-l-2 border-yellow-400 shadow-lg">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <UserPlus className="w-4 h-4 text-yellow-400" />
                          <p className="text-yellow-400 text-xs font-medium">Join to post</p>
                        </div>
                        <button
                          onClick={() => handleJoinWall(currentWall.id)}
                          className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-3 py-1 rounded-xl text-xs hover:shadow-lg hover:shadow-green-500/30 transition-all font-medium"
                        >
                          Join
                        </button>
                      </div>
                    </div>
                  )}
                  
                  {/* Selected Files Preview - Modern */}
                  {filePreviews.length > 0 && (
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
                              
                              {/* Remove button - always visible on mobile, hover on desktop */}
                              <button
                                onClick={() => removeFile(index)}
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
            )}

            {/* Sidebar - Wall Info - Fixed from top of page */}
            {/* Sidebar - Wall Info - Fixed from top of page */}
            <div className="w-80 bg-dark-800 border-l border-dark-700 p-6 hidden lg:block fixed right-0 top-14 bottom-0 overflow-y-auto" style={{ scrollbarWidth: 'thin', scrollbarColor: '#4B5563 #1F2937', paddingBottom: '120px' }}>
            <div className="space-y-6 pb-20">
              {!activeWall ? (
                /* Sidebar Skeleton */
                <>
                  {/* Wall Info Skeleton */}
                  <div className="bg-gradient-to-br from-dark-700 to-dark-800 rounded-2xl p-5 border border-dark-600 shadow-xl animate-pulse">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-12 h-12 bg-dark-600 rounded-xl"></div>
                      <div className="flex-1">
                        <div className="h-4 bg-dark-600 rounded w-32 mb-2"></div>
                        <div className="h-2 bg-dark-600 rounded w-20"></div>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <div className="bg-dark-600/50 rounded-xl p-3 h-24"></div>
                      <div className="bg-dark-600/50 rounded-xl p-3 h-24"></div>
                    </div>
                    <div className="h-16 bg-dark-600/30 rounded-xl mb-4"></div>
                    <div className="h-8 bg-dark-600 rounded-full mb-4"></div>
                    <div className="h-12 bg-dark-600 rounded-xl"></div>
                  </div>

                  {/* Trending Tags Skeleton */}
                  <div className="bg-gradient-to-br from-dark-700 to-dark-800 rounded-2xl p-5 border border-dark-600 shadow-xl animate-pulse">
                    <div className="h-5 bg-dark-600 rounded w-32 mb-4"></div>
                    <div className="flex flex-wrap gap-2">
                      {[1, 2, 3, 4, 5, 6].map((i) => (
                        <div key={i} className="h-7 bg-dark-600 rounded-lg w-16"></div>
                      ))}
                    </div>
                  </div>

                  {/* Online Users Skeleton */}
                  <div className="bg-gradient-to-br from-dark-700 to-dark-800 rounded-2xl p-5 border border-dark-600 shadow-xl animate-pulse">
                    <div className="h-5 bg-dark-600 rounded w-28 mb-4"></div>
                    <div className="space-y-3">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-dark-600 rounded-full"></div>
                          <div className="flex-1">
                            <div className="h-3 bg-dark-600 rounded w-24 mb-1"></div>
                            <div className="h-2 bg-dark-600 rounded w-32"></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Quick Actions Skeleton */}
                  <div className="space-y-3 animate-pulse">
                    <div className="h-12 bg-dark-600 rounded-xl"></div>
                    <div className="h-12 bg-dark-600 rounded-xl"></div>
                    <div className="h-12 bg-dark-600 rounded-xl"></div>
                  </div>
                </>
              ) : (
                <>
              {/* Current Wall Info - Enhanced */}
              <div className="bg-gradient-to-br from-dark-700 to-dark-800 rounded-2xl p-5 border border-dark-600 shadow-xl">
                {/* Wall Header with Icon */}
                <div className="flex items-center space-x-3 mb-4">
                  <div className={`p-3 bg-gradient-to-r ${currentWall?.color} rounded-xl shadow-lg`}>
                    {currentWall?.icon && <currentWall.icon className="w-6 h-6 text-white" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-white font-bold text-lg truncate">{currentWall?.name}</h3>
                    <p className="text-gray-400 text-xs capitalize">{currentWall?.category}</p>
                  </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                  {/* Members Count */}
                  <div className="bg-dark-600/50 rounded-xl p-3 border border-dark-500 hover:border-primary-500/50 transition-all group">
                    <div className="flex items-center space-x-2 mb-1">
                      <Users className="w-4 h-4 text-primary-400 group-hover:scale-110 transition-transform" />
                      <span className="text-gray-400 text-xs">Members</span>
                    </div>
                    <p className="text-white text-2xl font-bold">{currentWall?.participants || 0}</p>
                    <div className="flex items-center space-x-1 mt-1">
                      <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></div>
                      <span className="text-green-400 text-xs">+12 today</span>
                    </div>
                  </div>

                  {/* Messages Count */}
                  <div className="bg-dark-600/50 rounded-xl p-3 border border-dark-500 hover:border-accent-purple/50 transition-all group">
                    <div className="flex items-center space-x-2 mb-1">
                      <MessageCircle className="w-4 h-4 text-accent-purple group-hover:scale-110 transition-transform" />
                      <span className="text-gray-400 text-xs">Messages</span>
                    </div>
                    <p className="text-white text-2xl font-bold">{messages.length}</p>
                    <div className="flex items-center space-x-1 mt-1">
                      <TrendingUp className="w-3 h-3 text-accent-purple" />
                      <span className="text-accent-purple text-xs">Active</span>
                    </div>
                  </div>
                </div>

                {/* Activity Indicator */}
                <div className="bg-dark-600/30 rounded-xl p-3 mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-400 text-xs">Activity Level</span>
                    <span className="text-green-400 text-xs font-medium">Very High</span>
                  </div>
                  <div className="w-full bg-dark-500 rounded-full h-2 overflow-hidden">
                    <div className="bg-gradient-to-r from-green-500 to-emerald-400 h-full rounded-full animate-pulse" style={{ width: '85%' }}></div>
                  </div>
                </div>

                {/* Your Status Badge */}
                <div className="flex items-center justify-between mb-4">
                  <span className="text-gray-400 text-sm">Your Status</span>
                  {isLoggedIn() && currentWall ? (
                    <div className={`flex items-center space-x-2 px-3 py-1.5 rounded-full ${
                      currentWall.isMember 
                        ? 'bg-green-500/20 border border-green-500/30' 
                        : 'bg-yellow-500/20 border border-yellow-500/30'
                    }`}>
                      {currentWall.isMember ? (
                        <>
                          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                          <span className="text-green-400 text-xs font-medium">Member</span>
                        </>
                      ) : (
                        <>
                          <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                          <span className="text-yellow-400 text-xs font-medium">Guest</span>
                        </>
                      )}
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2 px-3 py-1.5 rounded-full bg-gray-500/20 border border-gray-500/30">
                      <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                      <span className="text-gray-400 text-xs font-medium">Visitor</span>
                    </div>
                  )}
                </div>
                
                {/* Join/Leave Wall Actions */}
                {isLoggedIn() && currentWall && (
                  <div className="pt-4 border-t border-dark-600">
                    {!currentWall.isMember ? (
                      <button
                        onClick={() => handleJoinWall(currentWall.id)}
                        className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white py-3 px-4 rounded-xl hover:shadow-lg hover:shadow-green-500/20 transition-all flex items-center justify-center space-x-2 font-medium group"
                      >
                        <UserPlus className="w-5 h-5 group-hover:scale-110 transition-transform" />
                        <span>Join This Wall</span>
                      </button>
                    ) : (
                      <div className="space-y-2">
                        <div className="flex items-center justify-center space-x-2 text-green-400 text-sm mb-3 bg-green-500/10 py-2 rounded-lg">
                          <Users className="w-4 h-4" />
                          <span className="font-medium">You're a member!</span>
                        </div>
                        <button
                          onClick={() => handleLeaveWall(currentWall.id)}
                          className="w-full bg-red-500/10 border border-red-500/30 text-red-400 py-2.5 px-4 rounded-xl hover:bg-red-500/20 transition-all text-sm font-medium"
                        >
                          Leave Wall
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Trending Tags - Enhanced */}
              <div className="bg-gradient-to-br from-dark-700 to-dark-800 rounded-2xl p-5 border border-dark-600 shadow-xl">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <Hash className="w-5 h-5 text-accent-purple" />
                    <h3 className="text-white font-bold">Trending Tags</h3>
                  </div>
                  <TrendingUp className="w-4 h-4 text-accent-purple animate-pulse" />
                </div>
                <div className="flex flex-wrap gap-2">
                  {popularTags.slice(0, 10).map((tag, index) => (
                    <button
                      key={tag}
                      onClick={() => toggleTag(tag)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all transform hover:scale-105 ${
                        selectedTags.includes(tag)
                          ? 'bg-gradient-to-r from-accent-purple to-primary-500 text-white shadow-lg shadow-accent-purple/30'
                          : 'bg-dark-600 text-gray-400 hover:text-white hover:bg-dark-500 border border-dark-500'
                      }`}
                      style={{
                        animationDelay: `${index * 50}ms`
                      }}
                    >
                      #{tag}
                    </button>
                  ))}
                </div>
              </div>

              {/* Online Users - Enhanced */}
              <div className="bg-gradient-to-br from-dark-700 to-dark-800 rounded-2xl p-5 border border-dark-600 shadow-xl">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <div className="relative">
                      <Users className="w-5 h-5 text-green-400" />
                      <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-400 rounded-full animate-ping"></div>
                    </div>
                    <h3 className="text-white font-bold">Online Now</h3>
                  </div>
                  <span className="text-green-400 text-sm font-medium">3 active</span>
                </div>
                <div className="space-y-3">
                  {[
                    { name: 'Alex Chen', status: 'Available for projects', color: 'from-blue-500 to-cyan-500', online: true },
                    { name: 'Sarah Johnson', status: 'Seeking investors', color: 'from-purple-500 to-pink-500', online: true },
                    { name: 'Mike Rodriguez', status: 'Building MVP', color: 'from-orange-500 to-red-500', online: true }
                  ].map((user, index) => (
                    <div 
                      key={index} 
                      className="flex items-center space-x-3 p-2 rounded-xl hover:bg-dark-600/50 transition-all cursor-pointer group"
                      style={{
                        animationDelay: `${index * 100}ms`
                      }}
                    >
                      <div className="relative">
                        <div className={`w-10 h-10 bg-gradient-to-br ${user.color} rounded-full group-hover:scale-110 transition-transform`}></div>
                        {user.online && (
                          <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-400 rounded-full border-2 border-dark-700 animate-pulse"></div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-white text-sm font-medium truncate group-hover:text-primary-400 transition-colors">{user.name}</p>
                        <p className="text-gray-400 text-xs truncate">{user.status}</p>
                      </div>
                      <MessageCircle className="w-4 h-4 text-gray-500 group-hover:text-primary-400 transition-colors" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Actions - Enhanced */}
              <div className="space-y-3">
                <button
                  onClick={handleCreateWall}
                  className="w-full bg-gradient-to-r from-primary-500 to-accent-purple text-white py-3.5 rounded-xl font-medium hover:shadow-lg hover:shadow-primary-500/30 transition-all flex items-center justify-center space-x-2 group"
                >
                  <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" />
                  <span>Create New Wall</span>
                </button>
                
                {isLoggedIn() && (
                  <button
                    onClick={handleStartKolophone}
                    className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white py-3.5 rounded-xl font-medium hover:shadow-lg hover:shadow-green-500/30 transition-all flex items-center justify-center space-x-2 group"
                  >
                    <PhoneCall className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    <span>Start Wall Call</span>
                  </button>
                )}
                
                <button
                  onClick={() => navigate('/contacts')}
                  className="w-full bg-dark-700 border border-dark-600 text-gray-300 py-3.5 rounded-xl font-medium hover:bg-dark-600 hover:border-primary-500/50 transition-all flex items-center justify-center space-x-2 group"
                >
                  <UserPlus className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  <span>Manage Contacts</span>
                </button>
              </div>
                </>
              )}
            </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        action={authAction}
        onLogin={handleAuthLogin}
        onRegister={handleAuthRegister}
      />

      <CreateWallModal
        isOpen={showCreateWallModal}
        onClose={() => setShowCreateWallModal(false)}
        onSubmit={handleWallSubmit}
      />

      {/* Image Gallery Modal */}
      {imageGalleryModal && (
        <ImageGalleryModal
          isOpen={imageGalleryModal.isOpen}
          onClose={closeImageGallery}
          images={imageGalleryModal.images}
          initialIndex={imageGalleryModal.initialIndex}
          author={imageGalleryModal.author}
          onDownloadSuccess={handleDownloadSuccess}
        />
      )}

      {/* Toast Notifications */}
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
    </>
  );
};

export default KolTechLine;
