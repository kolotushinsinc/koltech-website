import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
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
  Pin
} from 'lucide-react';
import Header from '../components/Header';
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
  const { isLoggedIn, canCreatePosts, canLikeContent, canCommentOnContent, canCreateWalls, user } = useAuth();
  const {
    showAuthModal,
    authAction,
    showCreateWallModal,
    setShowAuthModal,
    setShowCreateWallModal
  } = useModalStore();

  // State management
  const [walls, setWalls] = useState<Wall[]>([]);
  const [activeWall, setActiveWall] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
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
  const [messageMenuOpen, setMessageMenuOpen] = useState<string | null>(null);
  const [expandedReplies, setExpandedReplies] = useState<Set<string>>(new Set());
  const [messageReplies, setMessageReplies] = useState<{ [key: string]: Message[] }>({});
  const [loadingReplies, setLoadingReplies] = useState<Set<string>>(new Set());
  
  // UI state
  const [showFilters, setShowFilters] = useState(false);
  const [showWalls, setShowWalls] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedParticipants, setSelectedParticipants] = useState('all');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [showKolophonePanel, setShowKolophonePanel] = useState(false);
  const [activeCall, setActiveCall] = useState<any>(null);
  
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
  const { joinWall, leaveWall, emitTyping, joinNotifications, subscribeToEvents, isConnected } = useSocket();

  // Subscribe to socket events only once
  useEffect(() => {
    if (isConnected) {
      subscribeToEvents({
        // On message received
        onMessageReceived: (data: any) => {
          if (data.type === 'like_updated') {
            setMessages(prev => prev.map(msg =>
              msg.id === data.messageId
                ? { ...msg, likes: data.likesCount, isLiked: data.likedBy === user?._id }
                : msg
            ));
          } else if (data.type === 'new_comment') {
            setMessages(prev => prev.map(msg =>
              msg.id === data.parentMessageId
                ? { ...msg, replies: msg.replies + 1 }
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

      // Join notifications once when connected
      joinNotifications();
    }
  }, [isConnected]); // Only depend on connection status

  // Load walls from API
  useEffect(() => {
    loadWalls();
  }, [selectedCategory]);

  // Load messages when wall changes (don't wait for socket)
  useEffect(() => {
    if (activeWall) {
      console.log('🏠 Switching to wall:', activeWall);
      loadMessages(1, true); // Reset pagination when switching walls
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
      
      // Set first wall as active if none selected
      if (!activeWall && wallsData.length > 0) {
        setActiveWall(wallsData[0].id);
      }
    } catch (error) {
      console.error('Error loading walls:', error);
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
      
      // Update wall membership status
      setWalls(prev => prev.map(wall =>
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
      
      // Update wall membership status
      setWalls(prev => prev.map(wall =>
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
    // Check if editing
    if (editingMessage) {
      handleSaveEdit();
      return;
    }

    // Check if replying
    if (replyingTo) {
      if (!newMessage.trim()) return;
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
    const currentWall = walls.find(w => w.id === activeWall);
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

  const createComment = async (messageId: string, content: string) => {
    try {
      const response = await messageApi.addComment(messageId, content);
      
      // Update replies count
      setMessages(prev => prev.map(msg =>
        msg.id === messageId
          ? { ...msg, replies: msg.replies + 1 }
          : msg
      ));
      
      // If replies are expanded, add new reply to the list
      if (expandedReplies.has(messageId)) {
        const newReply: Message = {
          id: response.data.comment._id,
          userId: response.data.comment.author._id,
          username: `${response.data.comment.author.firstName} ${response.data.comment.author.lastName}`,
          avatar: response.data.comment.author.avatar ? `http://localhost:5005${response.data.comment.author.avatar}` : `https://ui-avatars.com/api/?name=${encodeURIComponent(response.data.comment.author.firstName + ' ' + response.data.comment.author.lastName)}&background=6366f1&color=fff&size=40`,
          content: response.data.comment.content,
          timestamp: new Date(response.data.comment.createdAt),
          likes: 0,
          replies: 0,
          tags: [],
          isLiked: false,
          isEdited: false
        };
        
        setMessageReplies(prev => ({
          ...prev,
          [messageId]: [...(prev[messageId] || []), newReply]
        }));
      }
      
      // Clear reply state
      setReplyingTo(null);
      showSuccess('✅ Reply posted successfully');
    } catch (error) {
      console.error('Error creating comment:', error);
      showError('❌ Error posting reply. Please try again.');
    }
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
          
          const replies = response.data.comments.map((comment: any) => ({
            id: comment._id,
            userId: comment.author._id,
            username: `${comment.author.firstName} ${comment.author.lastName}`,
            avatar: comment.author.avatar ? `http://localhost:5005${comment.author.avatar}` : `https://ui-avatars.com/api/?name=${encodeURIComponent(comment.author.firstName + ' ' + comment.author.lastName)}&background=6366f1&color=fff&size=40`,
            content: comment.content,
            timestamp: new Date(comment.createdAt),
            likes: comment.likesCount || 0,
            replies: 0,
            tags: [],
            isLiked: comment.likes?.includes(user?._id) || false,
            isEdited: comment.isEdited || false,
            editedAt: comment.editedAt ? new Date(comment.editedAt) : undefined
          }));
          
          setMessageReplies(prev => ({
            ...prev,
            [messageId]: replies
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

  const currentWall = walls.find(w => w.id === activeWall);

  return (
    <>
      <div className="min-h-screen bg-dark-900 flex flex-col">
        <Header 
          activeWall={currentWall} 
          showWalls={showWalls}
          setShowWalls={setShowWalls}
          wallsCount={walls.length}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          categories={categories}
        />
        
        <div className="flex-1">
        {/* Walls list - only shown when clicked, now controlled from header */}
        <div className={`bg-dark-800 border-b border-dark-700 py-2 transition-all duration-300 ${showWalls ? 'opacity-100' : 'opacity-0 h-0 py-0 overflow-hidden'}`}>
          <div className="container mx-auto">
            
            {/* Walls list - only shown when clicked */}
            {showWalls && (
              <div className="mt-4 space-y-4 animate-fade-in">
                <h3 className="text-white font-medium">Available Walls</h3>
                <div className="flex space-x-4 overflow-x-auto pb-2 scrollbar-hide">
                  {filteredWalls.map((wall) => (
                    <button
                      key={wall.id}
                      onClick={() => {
                        setActiveWall(wall.id);
                        setShowWalls(false);
                      }}
                      className={`flex-shrink-0 p-4 rounded-xl border transition-all duration-300 min-w-[200px] ${
                        activeWall === wall.id
                          ? 'bg-gradient-to-r ' + wall.color + ' border-transparent text-white'
                          : 'bg-dark-700 border-dark-600 text-gray-300 hover:border-gray-500'
                      }`}
                    >
                      <div className="flex items-center space-x-3 mb-2">
                        {wall.icon && <wall.icon className="w-5 h-5" />}
                        <span className="font-medium">{wall.name}</span>
                      </div>
                      <p className="text-xs opacity-80 text-left">{wall.description}</p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs opacity-60">{wall.participants} members</span>
                        <div className="w-2 h-2 bg-current rounded-full animate-pulse"></div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Filters - Only show when there are active tags or filters are expanded */}
        {(selectedTags.length > 0 || showFilters) && (
          <div className="bg-dark-800 border-b border-dark-700 py-2">
            <div className="container mx-auto">
              {/* Active tags */}
              {selectedTags.length > 0 && (
                <div className="flex items-center space-x-2 overflow-x-auto scrollbar-hide">
                  <span className="text-gray-400 text-sm">Tags:</span>
                  {selectedTags.map(tag => (
                    <span
                      key={tag}
                      onClick={() => toggleTag(tag)}
                      className="bg-accent-purple text-white px-2 py-1 rounded text-xs cursor-pointer hover:bg-accent-purple/80"
                    >
                      #{tag} ×
                    </span>
                  ))}
                </div>
              )}

              {/* Extended filters */}
              {showFilters && (
                <div className="mt-4 p-4 bg-dark-700 rounded-xl border border-dark-600">
                  <div className="grid md:grid-cols-3 gap-6">
                    {/* Categories */}
                    <div>
                      <h4 className="text-white font-medium mb-3">Categories</h4>
                      <div className="space-y-2">
                        {categories.map(category => (
                          <label key={category.id} className="flex items-center space-x-2">
                            <input
                              type="radio"
                              name="category"
                              checked={selectedCategory === category.id}
                              onChange={() => setSelectedCategory(category.id)}
                              className="text-primary-500"
                            />
                            <span className="text-gray-300 text-sm">{category.name}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Participants */}
                    <div>
                      <h4 className="text-white font-medium mb-3">Wall Size</h4>
                      <div className="space-y-2">
                        {participantRanges.map(range => (
                          <label key={range.id} className="flex items-center space-x-2">
                            <input
                              type="radio"
                              name="participants"
                              checked={selectedParticipants === range.id}
                              onChange={() => setSelectedParticipants(range.id)}
                              className="text-primary-500"
                            />
                            <span className="text-gray-300 text-sm">{range.name}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Tags */}
                    <div>
                      <h4 className="text-white font-medium mb-3">Popular Tags</h4>
                      <div className="flex flex-wrap gap-2">
                        {popularTags.map(tag => (
                          <button
                            key={tag}
                            onClick={() => toggleTag(tag)}
                            className={`px-2 py-1 rounded text-xs transition-colors ${
                              selectedTags.includes(tag)
                                ? 'bg-accent-purple text-white'
                                : 'bg-dark-600 text-gray-400 hover:text-white'
                            }`}
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
            {/* Current Wall Header - Fixed position below main header */}
            <div className="bg-dark-800 p-4 fixed top-14 left-0 right-0 lg:right-80 z-30 border-b border-dark-700">
              <div className="container mx-auto">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 bg-gradient-to-r ${currentWall?.color} rounded-lg`}>
                      {currentWall?.icon && <currentWall.icon className="w-5 h-5 text-white" />}
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm truncate max-w-md">{currentWall?.description}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    {isLoggedIn() && currentWall && !currentWall.isMember ? (
                      <button
                        onClick={() => handleJoinWall(currentWall.id)}
                        className="flex items-center space-x-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-3 py-1 rounded-lg hover:shadow-lg transition-all text-sm"
                      >
                        <UserPlus className="w-4 h-4" />
                        <span>Join</span>
                      </button>
                    ) : (
                      isLoggedIn() && currentWall && currentWall.isMember && (
                        <button
                          onClick={handleStartKolophone}
                          className="flex items-center space-x-1 bg-gradient-to-r from-primary-500 to-accent-purple text-white px-3 py-1 rounded-lg hover:shadow-lg transition-all text-sm"
                        >
                          <PhoneCall className="w-4 h-4" />
                          <span>Call</span>
                        </button>
                      )
                    )}
                    
                    <button className="p-2 bg-dark-700 text-gray-400 rounded-lg hover:text-white transition-colors">
                      <Search className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 pb-32 pt-32 container mx-auto relative" onScroll={(e) => {
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

              <div className="max-w-3xl mx-auto space-y-6 relative z-10">
                {loading ? (
                  <div className="flex justify-center py-8">
                    <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                ) : (
                  messages.map((message) => {
                    const isOwnMessage = user && message.userId === user._id;
                    return (
                    <div
                      key={message.id}
                      className={`group relative rounded-2xl p-6 transition-all duration-300 ${
                        isOwnMessage
                          ? 'bg-gradient-to-br from-primary-500/10 to-accent-purple/10 border border-primary-500/30 hover:border-primary-500/50'
                          : 'bg-dark-800 border border-dark-700 hover:border-dark-600'
                      }`}
                      onMouseEnter={() => setShowReactionPicker(message.id)}
                      onMouseLeave={() => setShowReactionPicker(null)}
                    >
                    {/* Message Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <Link to={`/user/${message.userId}`} className="group/avatar">
                          <img
                            src={message.avatar}
                            alt={message.username}
                            className="w-10 h-10 rounded-full object-cover border-2 border-transparent group-hover/avatar:border-primary-500/50 transition-colors"
                          />
                        </Link>
                        
                        <div>
                          <div className="flex items-center space-x-2">
                            <Link
                              to={`/user/${message.userId}`}
                              className="group"
                            >
                              <h3 className="text-white font-medium group-hover:text-primary-400 group-hover:underline transition-all cursor-pointer">
                                {message.username}
                              </h3>
                            </Link>
                            {message.isEdited && (
                              <span className="text-xs text-gray-500 bg-dark-600 px-2 py-0.5 rounded">
                                edited
                              </span>
                            )}
                          </div>
                          <p className="text-gray-400 text-sm">
                            {formatTime(message.timestamp)}
                            {message.isEdited && message.editedAt && (
                              <span className="ml-1">• edited {formatTime(message.editedAt)}</span>
                            )}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Message Content */}
                    <div className="mb-4">
                      <p className="text-gray-300 leading-relaxed">{message.content}</p>
                      
                      {/* Attachments */}
                      {message.attachments && message.attachments.length > 0 && (
                        <div className="mt-4">
                          <div className={`grid gap-3 ${
                            message.attachments.length === 1 ? 'grid-cols-1' :
                            message.attachments.length === 2 ? 'grid-cols-2' :
                            message.attachments.length === 3 ? 'grid-cols-3' :
                            'grid-cols-2 sm:grid-cols-3'
                          }`}>
                            {message.attachments.map((attachment, index) => (
                              <div key={index} className="rounded-xl overflow-hidden relative group">
                                {attachment.type === 'image' && (
                                  <img
                                    src={attachment.url.startsWith('http') ? attachment.url : `http://localhost:5005${attachment.url}`}
                                    alt={attachment.filename || 'Attachment'}
                                    className="w-full h-48 object-cover rounded-xl cursor-pointer hover:opacity-80 transition-opacity"
                                    onClick={() => openImageGallery(message, index)}
                                  />
                                )}
                                {attachment.type === 'video' && (
                                  <div className="relative">
                                    <video
                                      src={attachment.url.startsWith('http') ? attachment.url : `http://localhost:5005${attachment.url}`}
                                      className="w-full h-48 object-cover rounded-xl cursor-pointer"
                                      preload="metadata"
                                      onClick={() => openImageGallery(message, index)}
                                    />
                                    {/* Video play overlay */}
                                    <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                                      <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                                        <div className="w-0 h-0 border-l-[8px] border-l-white border-y-[6px] border-y-transparent ml-1"></div>
                                      </div>
                                    </div>
                                  </div>
                                )}
                                
                                {/* Multiple files indicator */}
                                {message.attachments && message.attachments.length > 1 && index === 0 && (
                                  <div className="absolute top-2 right-2 bg-dark-800/80 text-white px-2 py-1 rounded text-xs">
                                    +{message.attachments.length - 1} more
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Tags */}
                      {message.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-4">
                          {message.tags.map(tag => (
                            <span
                              key={tag}
                              className="bg-dark-700 text-gray-400 px-2 py-1 rounded text-xs hover:bg-primary-500 hover:text-white transition-colors cursor-pointer"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Compact Message Footer - Reaction counters and picker */}
                    <div className="relative">
                      {/* Show counters only if there are reactions or replies */}
                      {((message.reactions && Object.keys(message.reactions).length > 0) || message.replies > 0) && (
                        <div className="flex items-center gap-2 mt-2 flex-wrap">
                          {message.reactions && Object.entries(message.reactions).map(([emoji, data]) => (
                            <div 
                              key={emoji}
                              className="flex items-center bg-dark-700/50 rounded-full px-2 py-1 cursor-pointer hover:bg-dark-700 transition-colors"
                              onClick={() => setShowReactionPicker(showReactionPicker === message.id ? null : message.id)}
                            >
                              <span className="text-sm">{emoji}</span>
                              <span className="text-xs text-gray-400 ml-1">{data.count}</span>
                            </div>
                          ))}
                          {message.replies > 0 && (
                            <button
                              onClick={() => toggleReplies(message.id)}
                              className="text-xs text-blue-400 hover:text-blue-300 transition-colors flex items-center space-x-1"
                            >
                              <MessageCircle className="w-3 h-3" />
                              <span>{message.replies} {message.replies === 1 ? 'reply' : 'replies'}</span>
                              <span className="text-gray-500">{expandedReplies.has(message.id) ? '▼' : '▶'}</span>
                            </button>
                          )}
                        </div>
                      )}
                      
                      {/* Replies Section */}
                      {expandedReplies.has(message.id) && (
                        <div className="mt-4 pl-4 border-l-2 border-dark-600 space-y-3">
                          {loadingReplies.has(message.id) ? (
                            <div className="flex justify-center py-4">
                              <div className="w-6 h-6 border-2 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
                            </div>
                          ) : (
                            messageReplies[message.id]?.map((reply) => (
                              <div key={reply.id} className="bg-dark-700/50 rounded-lg p-3">
                                <div className="flex items-start space-x-2 mb-2">
                                  <Link to={`/user/${reply.userId}`}>
                                    <img
                                      src={reply.avatar}
                                      alt={reply.username}
                                      className="w-6 h-6 rounded-full object-cover"
                                    />
                                  </Link>
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center space-x-2">
                                      <Link to={`/user/${reply.userId}`}>
                                        <span className="text-white text-sm font-medium hover:text-primary-400 transition-colors">
                                          {reply.username}
                                        </span>
                                      </Link>
                                      <span className="text-gray-500 text-xs">
                                        {formatTime(reply.timestamp)}
                                      </span>
                                      {reply.isEdited && (
                                        <span className="text-xs text-gray-500 bg-dark-600 px-1 py-0.5 rounded">
                                          edited
                                        </span>
                                      )}
                                    </div>
                                    <p className="text-gray-300 text-sm mt-1">{reply.content}</p>
                                  </div>
                                </div>
                              </div>
                            ))
                          )}
                        </div>
                      )}
                      
                      {/* Reaction Picker - показывается при наведении на сообщение или клике на реакции */}
                      {showReactionPicker === message.id && (
                          <div className="absolute left-0 top-full mt-2 bg-dark-700 border border-dark-600 rounded-full px-3 py-2 shadow-xl flex items-center gap-2 animate-scale-in z-50">
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
                                  
                                  // Если пользователь уже поставил эту реакцию - удаляем
                                  if (currentUserReaction === emoji) {
                                    if (newReactions[emoji]) {
                                      newReactions[emoji] = {
                                        count: Math.max(0, newReactions[emoji].count - 1),
                                        users: newReactions[emoji].users.filter(id => id !== userId)
                                      };
                                      if (newReactions[emoji].count === 0) {
                                        delete newReactions[emoji];
                                      }
                                    }
                                  } else {
                                    // Удаляем старую реакцию пользователя если была
                                    if (currentUserReaction && newReactions[currentUserReaction]) {
                                      newReactions[currentUserReaction] = {
                                        count: Math.max(0, newReactions[currentUserReaction].count - 1),
                                        users: newReactions[currentUserReaction].users.filter(id => id !== userId)
                                      };
                                      if (newReactions[currentUserReaction].count === 0) {
                                        delete newReactions[currentUserReaction];
                                      }
                                    }
                                    
                                    // Добавляем новую реакцию
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
                                className={`text-2xl hover:scale-125 transition-transform ${
                                  message.userReaction === emoji ? 'scale-110 drop-shadow-lg' : ''
                                }`}
                                title={emoji}
                              >
                                {emoji}
                              </button>
                            ))}
                          </div>
                        )}
                    </div>
                    
                    {/* Hover Actions - Compact like messenger */}
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 bg-dark-700/90 backdrop-blur-sm rounded-full px-2 py-1 shadow-lg z-50">
                      {/* Three Dots Menu */}
                      <div className="relative z-50">
                        <button
                          onClick={() => setMessageMenuOpen(messageMenuOpen === message.id ? null : message.id)}
                          className="p-1.5 text-gray-400 hover:text-white transition-colors rounded-full hover:bg-dark-600"
                        >
                          <MoreHorizontal className="w-4 h-4" />
                        </button>
                        
                        {/* Dropdown Menu */}
                        {messageMenuOpen === message.id && (
                          <div className="absolute right-0 top-full mt-2 w-48 bg-dark-700 border border-dark-600 rounded-lg shadow-xl z-[100] animate-fade-in">
                            <button
                              onClick={() => {
                                handleComment(message.id);
                                setMessageMenuOpen(null);
                              }}
                              className="w-full text-left px-4 py-2 text-gray-300 hover:bg-dark-600 hover:text-white transition-colors flex items-center space-x-2 rounded-t-lg"
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
                                  className="w-full text-left px-4 py-2 text-gray-300 hover:bg-dark-600 hover:text-white transition-colors flex items-center space-x-2"
                                >
                                  <Settings className="w-4 h-4" />
                                  <span>Edit</span>
                                </button>
                                
                                <button
                                  onClick={() => {
                                    handleDeleteMessage(message.id);
                                    setMessageMenuOpen(null);
                                  }}
                                  className="w-full text-left px-4 py-2 text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors flex items-center space-x-2"
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
                                  className="w-full text-left px-4 py-2 text-gray-300 hover:bg-dark-600 hover:text-white transition-colors flex items-center space-x-2"
                                >
                                  <Phone className="w-4 h-4" />
                                  <span>Message</span>
                                </button>
                                
                                <button
                                  onClick={() => {
                                    handleAddContact(message.userId);
                                    setMessageMenuOpen(null);
                                  }}
                                  className="w-full text-left px-4 py-2 text-gray-300 hover:bg-dark-600 hover:text-white transition-colors flex items-center space-x-2"
                                >
                                  <UserPlus className="w-4 h-4" />
                                  <span>Add Contact</span>
                                </button>
                                
                                <button
                                  onClick={() => {
                                    handleReport(message.id);
                                    setMessageMenuOpen(null);
                                  }}
                                  className="w-full text-left px-4 py-2 text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors flex items-center space-x-2 rounded-b-lg"
                                >
                                  <Flag className="w-4 h-4" />
                                  <span>Report</span>
                                </button>
                              </>
                            )}
                            
                            <button
                              onClick={() => setMessageMenuOpen(null)}
                              className="w-full text-left px-4 py-2 text-gray-300 hover:bg-dark-600 hover:text-white transition-colors flex items-center space-x-2 rounded-b-lg"
                            >
                              <Share2 className="w-4 h-4" />
                              <span>Share</span>
                            </button>
                          </div>
                        )}
                      </div>
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
            </div>

            {/* Message Input - Fixed at bottom of screen with full width up to sidebar */}
            <div className="bg-dark-800 border-t border-dark-700 fixed bottom-0 left-0 right-0 lg:right-80 z-10">
              <div className="py-3 px-4">
                <div className="container mx-auto">
                <div
                  className={`bg-dark-700 border border-dark-600 rounded-2xl p-4 transition-all ${
                    isDragging ? 'border-primary-500 bg-primary-500/5' : ''
                  }`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  {isDragging && (
                    <div className="absolute inset-0 bg-primary-500/20 border-2 border-primary-500 border-dashed rounded-2xl flex items-center justify-center z-10">
                      <div className="text-center">
                        <Image className="w-12 h-12 text-primary-400 mx-auto mb-2" />
                        <p className="text-primary-400 font-medium">Drop your files here</p>
                        <p className="text-gray-400 text-sm">Images and videos supported (max 15)</p>
                      </div>
                    </div>
                  )}
                  
                  <div className="flex items-center space-x-4">
                    <div className="flex-1">
                      <textarea
                        ref={textareaRef}
                        value={newMessage}
                        onChange={(e) => {
                          handleInputChange(e);
                          // Auto-resize textarea with max height of 100px
                          const target = e.target;
                          target.style.height = 'auto';
                          target.style.height = Math.min(target.scrollHeight, 100) + 'px';
                        }}
                        onKeyDown={handleKeyPress}
                        placeholder={
                          editingMessage ? 'Edit your message...' :
                          replyingTo ? `Reply to ${replyingTo.username}...` :
                          `Share something in ${currentWall?.name}...`
                        }
                        className="w-full bg-transparent text-white placeholder-gray-500 resize-none focus:outline-none min-h-[44px] max-h-[100px] overflow-y-auto scrollbar-hide rounded-xl p-2"
                        style={{
                          height: '44px',
                          backdropFilter: 'blur(8px)',
                          background: 'rgba(255, 255, 255, 0.05)'
                        }}
                      />
                    </div>
                    
                    <div className="flex items-center space-x-2">
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
                        className={`p-2 rounded-lg transition-colors ${
                          selectedFiles.length >= 15
                            ? 'text-gray-600 cursor-not-allowed'
                            : 'text-gray-400 hover:text-white hover:bg-dark-600'
                        }`}
                        title={selectedFiles.length >= 15 ? 'Maximum files reached' : 'Upload Images/Videos (or drag & drop)'}
                      >
                        <Image className="w-5 h-5" />
                      </button>
                      
                      <button className="p-2 text-gray-400 hover:text-white hover:bg-dark-600 rounded-lg transition-colors">
                        <Smile className="w-5 h-5" />
                      </button>
                      
                      <button className="p-2 text-gray-400 hover:text-white hover:bg-dark-600 rounded-lg transition-colors">
                        <Hash className="w-5 h-5" />
                      </button>
                      
                      <button
                        onClick={handleSendMessage}
                        disabled={(!newMessage.trim() && selectedFiles.length === 0) || sendingMessage}
                        className={`p-3 rounded-xl transition-all duration-300 flex items-center space-x-2 ${
                          (newMessage.trim() || selectedFiles.length > 0) && !sendingMessage
                            ? 'bg-gradient-to-r from-primary-500 to-accent-purple text-white hover:shadow-lg'
                            : 'bg-dark-600 text-gray-500 cursor-not-allowed'
                        }`}
                      >
                        {sendingMessage ? (
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        ) : (
                          <Send className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                  </div>
                  
                  {/* Reply Banner */}
                  {replyingTo && (
                    <div className="mb-4 p-3 bg-dark-600 border border-dark-500 rounded-xl">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <MessageCircle className="w-4 h-4 text-blue-400" />
                          <div>
                            <p className="text-blue-400 text-sm font-medium">
                              Replying to {replyingTo.username}
                            </p>
                            <p className="text-gray-400 text-xs truncate max-w-md">
                              {replyingTo.content}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => setReplyingTo(null)}
                          className="text-red-400 hover:text-red-300 transition-colors"
                        >
                          ×
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Edit Banner */}
                  {editingMessage && (
                    <div className="mb-4 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-xl">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <Settings className="w-4 h-4 text-yellow-400" />
                          <p className="text-yellow-400 text-sm font-medium">
                            Editing message
                          </p>
                        </div>
                        <button
                          onClick={handleCancelEdit}
                          className="text-red-400 hover:text-red-300 transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Wall Membership Warning */}
                  {isLoggedIn() && currentWall && !currentWall.isMember && (
                    <div className="mb-4 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-xl">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <UserPlus className="w-5 h-5 text-yellow-400" />
                          <div>
                            <p className="text-yellow-400 font-medium">Join this wall to participate</p>
                            <p className="text-gray-400 text-sm">You need to be a member to post messages, like, and comment.</p>
                          </div>
                        </div>
                        <button
                          onClick={() => handleJoinWall(currentWall.id)}
                          className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all flex items-center space-x-2"
                        >
                          <UserPlus className="w-4 h-4" />
                          <span>Join Now</span>
                        </button>
                      </div>
                    </div>
                  )}
                  
                  {/* Selected Files Preview */}
                  {filePreviews.length > 0 && (
                    <div className="mb-3 p-3 bg-dark-600 rounded-lg">
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                        {filePreviews.map((preview, index) => (
                          <div key={index} className="relative group">
                            <div className="aspect-square rounded-lg overflow-hidden bg-dark-700">
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
                              
                              {/* File info overlay */}
                              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-2">
                                <div className="text-white text-xs truncate">
                                  {preview.file.name}
                                </div>
                                <div className="text-white text-xs">
                                  {preview.type === 'image' ? '📷' : '🎥'} {(preview.file.size / 1024 / 1024).toFixed(1)}MB
                                </div>
                              </div>
                              
                              {/* Remove button */}
                              <button
                                onClick={() => removeFile(index)}
                                className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full text-xs hover:bg-red-600 transition-colors flex items-center justify-center"
                              >
                                ×
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      {selectedFiles.length >= 15 && (
                        <p className="text-yellow-400 text-xs mt-2">
                          Maximum 15 files reached
                        </p>
                      )}
                    </div>
                  )}
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar - Wall Info - Fixed from top of page */}
            <div className="w-80 bg-dark-800 border-l border-dark-700 p-6 hidden lg:block fixed right-0 top-14 bottom-0 overflow-y-auto" style={{ scrollbarWidth: 'thin', scrollbarColor: '#4B5563 #1F2937', paddingBottom: '120px' }}>
            <div className="space-y-6 pb-20">
              {/* Current Wall Info */}
              <div className="bg-dark-700 rounded-xl p-4">
                <h3 className="text-white font-semibold mb-3">Wall Information</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400 text-sm">Members</span>
                    <span className="text-white">{currentWall?.participants}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400 text-sm">Category</span>
                    <span className="text-white capitalize">{currentWall?.category}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400 text-sm">Your Status</span>
                    {isLoggedIn() && currentWall ? (
                      <span className={`text-sm ${currentWall.isMember ? 'text-green-400' : 'text-yellow-400'}`}>
                        {currentWall.isMember ? 'Member' : 'Not Member'}
                      </span>
                    ) : (
                      <span className="text-gray-400 text-sm">Guest</span>
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400 text-sm">Status</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                      <span className="text-green-400 text-sm">Active</span>
                    </div>
                  </div>
                </div>
                
                {/* Join/Leave Wall Actions */}
                {isLoggedIn() && currentWall && (
                  <div className="mt-4 pt-4 border-t border-dark-600">
                    {!currentWall.isMember ? (
                      <button
                        onClick={() => handleJoinWall(currentWall.id)}
                        className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white py-2 px-4 rounded-lg hover:shadow-lg transition-all flex items-center justify-center space-x-2"
                      >
                        <UserPlus className="w-4 h-4" />
                        <span>Join This Wall</span>
                      </button>
                    ) : (
                      <div className="space-y-2">
                        <div className="flex items-center justify-center space-x-2 text-green-400 text-sm mb-2">
                          <Users className="w-4 h-4" />
                          <span>You are a member</span>
                        </div>
                        <button
                          onClick={() => handleLeaveWall(currentWall.id)}
                          className="w-full bg-red-500/20 border border-red-500/30 text-red-400 py-2 px-4 rounded-lg hover:bg-red-500/30 transition-all text-sm"
                        >
                          Leave Wall
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Trending Tags */}
              <div className="bg-dark-700 rounded-xl p-4">
                <h3 className="text-white font-semibold mb-3">Trending Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {popularTags.slice(0, 8).map(tag => (
                    <button
                      key={tag}
                      onClick={() => toggleTag(tag)}
                      className={`px-2 py-1 rounded text-xs transition-colors ${
                        selectedTags.includes(tag)
                          ? 'bg-accent-purple text-white'
                          : 'bg-dark-600 text-gray-400 hover:text-white'
                      }`}
                    >
                      #{tag}
                    </button>
                  ))}
                </div>
              </div>

              {/* Online Users */}
              <div className="bg-dark-700 rounded-xl p-4">
                <h3 className="text-white font-semibold mb-3">Online Now</h3>
                <div className="space-y-3">
                  {[
                    { name: 'Alex Chen', status: 'Available for projects' },
                    { name: 'Sarah Johnson', status: 'Seeking investors' },
                    { name: 'Mike Rodriguez', status: 'Building MVP' }
                  ].map((user, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <div className="relative">
                        <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-accent-purple rounded-full"></div>
                        <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-dark-700"></div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-white text-sm font-medium truncate">{user.name}</p>
                        <p className="text-gray-400 text-xs truncate">{user.status}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="space-y-3">
                <button
                  onClick={handleCreateWall}
                  className="w-full bg-gradient-to-r from-primary-500 to-accent-purple text-white py-3 rounded-xl font-medium hover:shadow-lg transition-all flex items-center justify-center space-x-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Create New Wall</span>
                </button>
                
                {isLoggedIn() && (
                  <button
                    onClick={handleStartKolophone}
                    className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white py-3 rounded-xl font-medium hover:shadow-lg transition-all flex items-center justify-center space-x-2"
                  >
                    <PhoneCall className="w-4 h-4" />
                    <span>Start Wall Call</span>
                  </button>
                )}
                
                <button
                  onClick={() => navigate('/contacts')}
                  className="w-full bg-dark-700 border border-dark-600 text-gray-300 py-3 rounded-xl font-medium hover:bg-dark-600 transition-colors flex items-center justify-center space-x-2"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Manage Contacts</span>
                </button>
              </div>
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
