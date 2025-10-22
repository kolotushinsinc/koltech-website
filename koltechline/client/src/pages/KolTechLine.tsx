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
  
  // UI state
  const [showFilters, setShowFilters] = useState(false);
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

  // Handle wall switching - join new wall when active wall changes
  useEffect(() => {
    if (activeWall && isConnected) {
      console.log('🏠 Switching to wall:', activeWall);
      loadMessages(1, true); // Reset pagination when switching walls
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
      
      const messagesData = response.data.messages.map((msg: any) => ({
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
        editedAt: msg.editedAt ? new Date(msg.editedAt) : undefined
      }));
      
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

    if (!canCreatePosts()) {
      console.log('❌ User cannot create posts, showing auth modal');
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
    setSendingMessage(true);
    
    try {
      // Upload files first if any
      const attachments = [];
      console.log('📁 Files to upload:', selectedFiles.length);
      
      for (const file of selectedFiles) {
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
        content: newMessage.trim() || '', // Allow empty content if there are attachments
        wallId: activeWall,
        attachments,
        tags: extractTagsFromContent(newMessage)
      };

      console.log('📤 Sending message data:', messageData);

      // Create message
      const response = await messageApi.createMessage(messageData);
      console.log('✅ Message created successfully:', response);

      // Add to local state
      const newMsg: Message = {
        id: response.data.message._id,
        userId: response.data.message.author._id,
        username: `${response.data.message.author.firstName} ${response.data.message.author.lastName}`,
        avatar: response.data.message.author.avatar ? `http://localhost:5005${response.data.message.author.avatar}` : `https://ui-avatars.com/api/?name=${encodeURIComponent(response.data.message.author.firstName + ' ' + response.data.message.author.lastName)}&background=6366f1&color=fff&size=40`,
        content: response.data.message.content,
        timestamp: new Date(response.data.message.createdAt),
        attachments: response.data.message.attachments || attachments, // Use uploaded attachments if server doesn't return them
        likes: 0,
        replies: 0,
        tags: response.data.message.tags || [],
        isLiked: false,
        isEdited: false
      };
      
      console.log('💾 Adding message to local state with attachments:', newMsg.attachments);

      setMessages(prev => [newMsg, ...prev]);
      setNewMessage('');
      setSelectedFiles([]);
      setFilePreviews([]);
      
      console.log('✅ Message added to local state');
    } catch (error: any) {
      console.error('❌ Error sending message:', error);
      console.error('❌ Error details:', error.response?.data || error.message);
      alert(`Error sending message: ${error.message || 'Please try again.'}`);
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
      await messageApi.addComment(messageId, content);
      
      // Update replies count
      setMessages(prev => prev.map(msg =>
        msg.id === messageId
          ? { ...msg, replies: msg.replies + 1 }
          : msg
      ));
      
      // Clear reply state
      setReplyingTo(null);
    } catch (error) {
      console.error('Error creating comment:', error);
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
    
    try {
      const response = await messageApi.updateMessage(editingMessage.id, newMessage.trim());
      
      // Update message in local state
      setMessages(prev => prev.map(msg =>
        msg.id === editingMessage.id
          ? {
              ...msg,
              content: newMessage.trim(),
              isEdited: true,
              editedAt: new Date()
            }
          : msg
      ));
      
      setEditingMessage(null);
      setNewMessage('');
      setSelectedFiles([]);
      setFilePreviews([]);
      showSuccess('Message updated successfully');
    } catch (error) {
      console.error('Error updating message:', error);
      showError('Error updating message. Please try again.');
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
    <div className="min-h-screen bg-dark-900 flex flex-col">
      <Header />
      
      <div className="flex-1 pt-16">
        {/* Live Wall Ticker */}
        <div className="bg-dark-800 border-b border-dark-700 py-4 px-6">
          <div className="container mx-auto">
            <div className="flex items-center space-x-4 mb-4">
              <h2 className="text-white font-semibold">Active Walls</h2>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-green-400 text-sm">Live</span>
              </div>
            </div>
            
            {/* Horizontal scrolling wall list */}
            <div className="flex space-x-4 overflow-x-auto pb-2 scrollbar-hide">
              {filteredWalls.map((wall) => (
                <button
                  key={wall.id}
                  onClick={() => setActiveWall(wall.id)}
                  className={`flex-shrink-0 p-4 rounded-xl border transition-all duration-300 min-w-[200px] ${
                    activeWall === wall.id
                      ? 'bg-gradient-to-r ' + wall.color + ' border-transparent text-white'
                      : 'bg-dark-700 border-dark-600 text-gray-300 hover:border-gray-500'
                  }`}
                >
                  <div className="flex items-center space-x-3 mb-2">
                    <wall.icon className="w-5 h-5" />
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
        </div>

        {/* Filters */}
        <div className="bg-dark-800/50 border-b border-dark-700 py-4 px-6">
          <div className="container mx-auto">
            <div className="flex flex-wrap items-center gap-4">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center space-x-2 bg-dark-700 text-gray-300 px-4 py-2 rounded-lg hover:bg-dark-600 transition-colors"
              >
                <Filter className="w-4 h-4" />
                <span>Filters</span>
              </button>

              {/* Quick category filters */}
              <div className="flex space-x-2">
                {categories.map(category => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`px-3 py-1 rounded-full text-sm transition-colors ${
                      selectedCategory === category.id
                        ? 'bg-primary-500 text-white'
                        : 'bg-dark-700 text-gray-400 hover:text-white'
                    }`}
                  >
                    {category.name}
                  </button>
                ))}
              </div>

              {/* Active tags */}
              {selectedTags.length > 0 && (
                <div className="flex items-center space-x-2">
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
            </div>

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

        {/* Main Content Area */}
        <div className="flex-1 flex max-w-7xl mx-auto w-full">
          {/* Messages Feed */}
          <div className="flex-1 flex flex-col max-w-4xl">
            {/* Current Wall Header */}
            <div className="bg-dark-800 border-b border-dark-700 p-6">
              <div className="container mx-auto">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className={`p-3 bg-gradient-to-r ${currentWall?.color} rounded-xl`}>
                      {currentWall?.icon && <currentWall.icon className="w-6 h-6 text-white" />}
                    </div>
                    <div>
                      <h1 className="text-2xl font-bold text-white">{currentWall?.name}</h1>
                      <p className="text-gray-400">{currentWall?.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2 text-gray-400">
                      <Users className="w-4 h-4" />
                      <span className="text-sm">{currentWall?.participants} members</span>
                    </div>
                    
                    {/* Wall Membership Status & Actions */}
                    {isLoggedIn() && currentWall && (
                      <>
                        {!currentWall.isMember ? (
                          <button
                            onClick={() => handleJoinWall(currentWall.id)}
                            className="flex items-center space-x-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all"
                          >
                            <UserPlus className="w-4 h-4" />
                            <span className="text-sm">Join Wall</span>
                          </button>
                        ) : (
                          <>
                            <div className="flex items-center space-x-2 text-green-400 text-sm">
                              <Users className="w-4 h-4" />
                              <span>Member</span>
                            </div>
                            
                            <button
                              onClick={handleStartKolophone}
                              className="flex items-center space-x-2 bg-gradient-to-r from-primary-500 to-accent-purple text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all"
                            >
                              <PhoneCall className="w-4 h-4" />
                              <span className="text-sm">Start Kolophone</span>
                            </button>
                          </>
                        )}
                      </>
                    )}
                    
                    <button className="p-2 bg-dark-700 text-gray-400 rounded-lg hover:text-white transition-colors">
                      <Search className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6" onScroll={(e) => {
              const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
              if (scrollHeight - scrollTop <= clientHeight * 1.5 && hasMoreMessages && !loadingMore) {
                loadMoreMessages();
              }
            }}>
              <div className="max-w-3xl mx-auto space-y-6">
                {loading ? (
                  <div className="flex justify-center py-8">
                    <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                ) : (
                  messages.map((message) => (
                    <div
                      key={message.id}
                      className="bg-dark-800 border border-dark-700 rounded-2xl p-6 hover:border-dark-600 transition-colors"
                    >
                    {/* Message Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <Link to={`/user/${message.userId}`} className="group">
                          <img
                            src={message.avatar}
                            alt={message.username}
                            className="w-10 h-10 rounded-full object-cover border-2 border-transparent group-hover:border-primary-500/50 transition-colors"
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
                      <button className="text-gray-400 hover:text-white transition-colors">
                        <MoreHorizontal className="w-5 h-5" />
                      </button>
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

                    {/* Message Actions */}
                    <div className="flex items-center justify-between pt-4 border-t border-dark-700">
                      <div className="flex items-center space-x-6">
                        <button
                          onClick={() => handleLike(message.id)}
                          className={`flex items-center space-x-2 transition-colors ${
                            message.isLiked
                              ? 'text-red-400'
                              : 'text-gray-400 hover:text-red-400'
                          }`}
                        >
                          <Heart className={`w-4 h-4 ${message.isLiked ? 'fill-current' : ''}`} />
                          <span className="text-sm">{message.likes}</span>
                        </button>
                        
                        <button
                          onClick={() => handleComment(message.id)}
                          className="flex items-center space-x-2 text-gray-400 hover:text-blue-400 transition-colors"
                        >
                          <MessageCircle className="w-4 h-4" />
                          <span className="text-sm">{message.replies}</span>
                        </button>
                        
                        <button className="flex items-center space-x-2 text-gray-400 hover:text-green-400 transition-colors">
                          <Share2 className="w-4 h-4" />
                          <span className="text-sm">Share</span>
                        </button>

                        {/* Private Chat Button */}
                        {isLoggedIn() && message.userId !== user?._id && (
                          <button
                            onClick={() => handleStartPrivateChat(message.userId)}
                            className="flex items-center space-x-2 text-gray-400 hover:text-primary-400 transition-colors"
                          >
                            <Phone className="w-4 h-4" />
                            <span className="text-sm">Chat</span>
                          </button>
                        )}
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        {message.isPinned && (
                          <Pin className="w-4 h-4 text-yellow-400" />
                        )}
                        
                        <Star className="w-4 h-4 text-gray-400 hover:text-yellow-400 transition-colors cursor-pointer" />
                        
                        {/* Message Options Menu */}
                        <div className="relative group">
                          <button className="text-gray-400 hover:text-white transition-colors">
                            <MoreHorizontal className="w-5 h-5" />
                          </button>
                          
                          {/* Dropdown Menu */}
                          <div className="absolute right-0 top-full mt-2 w-48 bg-dark-700 border border-dark-600 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
                            {isLoggedIn() && message.userId === user?._id && (
                              <>
                                <button
                                  onClick={() => handleEditMessage(message)}
                                  className="w-full text-left px-4 py-2 text-gray-300 hover:bg-dark-600 hover:text-white transition-colors flex items-center space-x-2"
                                >
                                  <Settings className="w-4 h-4" />
                                  <span>Edit Message</span>
                                </button>
                                
                                <button
                                  onClick={() => handleDeleteMessage(message.id)}
                                  className="w-full text-left px-4 py-2 text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors flex items-center space-x-2"
                                >
                                  <Flag className="w-4 h-4" />
                                  <span>Delete Message</span>
                                </button>
                              </>
                            )}
                            
                            {isLoggedIn() && message.userId !== user?._id && (
                              <>
                                <button
                                  onClick={() => handleStartPrivateChat(message.userId)}
                                  className="w-full text-left px-4 py-2 text-gray-300 hover:bg-dark-600 hover:text-white transition-colors flex items-center space-x-2"
                                >
                                  <Phone className="w-4 h-4" />
                                  <span>Message User</span>
                                </button>
                                
                                <button
                                  onClick={() => handleAddContact(message.userId)}
                                  className="w-full text-left px-4 py-2 text-gray-300 hover:bg-dark-600 hover:text-white transition-colors flex items-center space-x-2"
                                >
                                  <UserPlus className="w-4 h-4" />
                                  <span>Add Contact</span>
                                </button>
                                
                                <button
                                  onClick={() => handleReport(message.id)}
                                  className="w-full text-left px-4 py-2 text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors flex items-center space-x-2"
                                >
                                  <Flag className="w-4 h-4" />
                                  <span>Report</span>
                                </button>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    </div>
                  ))
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

            {/* Message Input */}
            <div className="bg-dark-800 border-t border-dark-700 p-6">
              <div className="max-w-3xl mx-auto">
                {/* Reply Banner */}
                {replyingTo && (
                  <div className="mb-4 p-3 bg-dark-600 border border-dark-500 rounded-lg">
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
                  <div className="mb-4 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
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
                  
                  <div className="flex items-end space-x-4">
                    <div className="flex-1">
                      <textarea
                        ref={textareaRef}
                        value={newMessage}
                        onChange={handleInputChange}
                        onKeyPress={handleKeyPress}
                        placeholder={
                          editingMessage ? 'Edit your message...' :
                          replyingTo ? `Reply to ${replyingTo.username}...` :
                          `Share something in ${currentWall?.name}...`
                        }
                        className="w-full bg-transparent text-white placeholder-gray-500 resize-none focus:outline-none h-[80px]"
                        rows={3}
                      />
                      
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

                      {/* Attachment Options */}
                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center space-x-3">
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
                          
                          <button
                            onClick={() => {
                              if (fileInputRef.current && selectedFiles.length < 15) {
                                fileInputRef.current.accept = 'video/*';
                                fileInputRef.current.click();
                              }
                            }}
                            disabled={selectedFiles.length >= 15}
                            className={`p-2 rounded-lg transition-colors ${
                              selectedFiles.length >= 15
                                ? 'text-gray-600 cursor-not-allowed'
                                : 'text-gray-400 hover:text-white hover:bg-dark-600'
                            }`}
                            title={selectedFiles.length >= 15 ? 'Maximum files reached' : 'Upload Video'}
                          >
                            <Video className="w-5 h-5" />
                          </button>
                          
                          <button className="p-2 text-gray-400 hover:text-white hover:bg-dark-600 rounded-lg transition-colors">
                            <Smile className="w-5 h-5" />
                          </button>
                          
                          <button className="p-2 text-gray-400 hover:text-white hover:bg-dark-600 rounded-lg transition-colors">
                            <Paperclip className="w-5 h-5" />
                          </button>
                          
                          <button className="p-2 text-gray-400 hover:text-white hover:bg-dark-600 rounded-lg transition-colors">
                            <Hash className="w-5 h-5" />
                          </button>
                        </div>
                        
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
                            <>
                              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                              <span className="text-sm">Sending...</span>
                            </>
                          ) : (
                            <>
                              <Send className="w-5 h-5" />
                              {editingMessage && <span className="text-sm">Save</span>}
                              {replyingTo && <span className="text-sm">Reply</span>}
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar - Wall Info */}
          <div className="w-80 bg-dark-800 border-l border-dark-700 p-6 hidden lg:block">
            <div className="space-y-6">
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
    </div>
  );
};

export default KolTechLine;