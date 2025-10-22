import React, { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Send,
  ArrowLeft,
  Phone,
  Video,
  MoreVertical,
  Image,
  Paperclip,
  Smile,
  Users,
  Settings
} from 'lucide-react';
import Header from '../components/Header';
import { useAuth } from '../hooks/useAuth';
import { useSocket } from '../hooks/useSocket';
import { useToast } from '../hooks/useToast';
import { chatApi, fileApi } from '../utils/api';
import Toast from '../components/ui/Toast';

interface ChatMessage {
  _id: string;
  author: {
    _id: string;
    firstName: string;
    lastName: string;
    username: string;
    avatar?: string;
  };
  content: string;
  attachments?: {
    type: 'image' | 'video' | 'file';
    url: string;
    filename?: string;
  }[];
  createdAt: Date;
  readBy: { user: string; readAt: Date }[];
  isEdited: boolean;
}

interface ChatData {
  _id: string;
  type: 'private' | 'group';
  name?: string;
  participants: {
    _id: string;
    firstName: string;
    lastName: string;
    username: string;
    avatar?: string;
  }[];
  lastActivity: Date;
}

const Chat = () => {
  const { chatId } = useParams<{ chatId: string }>();
  const navigate = useNavigate();
  const { user, isLoggedIn } = useAuth();
  const { toasts, showSuccess, showError, removeToast } = useToast();
  
  // State
  const [chat, setChat] = useState<ChatData | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  
  // Refs
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Socket integration
  const { subscribeToEvents, isConnected, joinChat } = useSocket();

  // Redirect if not authenticated
  useEffect(() => {
    if (!isLoggedIn()) {
      navigate('/auth');
      return;
    }
  }, [isLoggedIn]);

  // Subscribe to socket events and join chat room
  useEffect(() => {
    if (isConnected && chatId) {
      // Join chat room for real-time updates
      joinChat(chatId);
      
      subscribeToEvents({
        onMessageReceived: (data: any) => {
          console.log('📨 Socket message received:', data);
          if (data.chatId === chatId && data.message?._id && data.message.author) {
            setMessages(prev => [...prev, {
              _id: data.message._id,
              author: data.message.author,
              content: data.message.content || '',
              attachments: data.message.attachments || [],
              createdAt: new Date(data.message.createdAt),
              readBy: data.message.readBy || [],
              isEdited: data.message.isEdited || false
            }]);
            scrollToBottom();
          }
        }
      });
    }
  }, [isConnected, chatId]);

  // Load chat data
  useEffect(() => {
    if (chatId) {
      loadChatData();
      loadChatMessages();
    }
  }, [chatId]);

  // Auto scroll to bottom
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadChatData = async () => {
    if (!chatId) return;
    
    try {
      // Get all user's chats and find the current one
      const response = await chatApi.getChats();
      const chatData = response.data.chats.find((c: any) => c._id === chatId);
      
      if (chatData) {
        setChat({
          _id: chatData._id,
          type: chatData.type,
          name: chatData.name,
          participants: chatData.participants,
          lastActivity: new Date(chatData.lastActivity)
        });
      }
    } catch (error) {
      console.error('Error loading chat data:', error);
    }
  };

  const loadChatMessages = async () => {
    if (!chatId) return;
    
    try {
      const response = await chatApi.getChatMessages(chatId, { limit: 50 });
      
      const messagesData = response.data.messages
        .filter((msg: any) => msg && msg._id && msg.author)
        .map((msg: any) => ({
          _id: msg._id,
          author: msg.author,
          content: msg.content || '',
          attachments: msg.attachments || [],
          createdAt: new Date(msg.createdAt),
          readBy: msg.readBy || [],
          isEdited: msg.isEdited || false
        }));
      
      setMessages(messagesData);
      setLoading(false);
    } catch (error) {
      console.error('Error loading chat messages:', error);
      showError('Failed to load chat messages');
      setLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() && selectedFiles.length === 0) return;
    if (!chatId) return;

    setSending(true);
    
    try {
      // Upload files first if any
      const attachments = [];
      
      for (const file of selectedFiles) {
        try {
          let uploadResponse;
          if (file.type.startsWith('image/')) {
            uploadResponse = await fileApi.uploadImage(file);
          } else if (file.type.startsWith('video/')) {
            uploadResponse = await fileApi.uploadVideo(file);
          }
          
          if (uploadResponse?.data?.file) {
            attachments.push({
              type: file.type.startsWith('image/') ? 'image' : 'video',
              url: uploadResponse.data.file.url,
              filename: uploadResponse.data.file.filename
            });
          }
        } catch (uploadError) {
          console.error('File upload error:', uploadError);
        }
      }

      // Send message
      const response = await chatApi.sendMessage(chatId, newMessage.trim(), attachments);
      
      // Add to local state (will also come via socket)
      if (response?.data?.message?._id && response.data.message.author) {
        const newMsg: ChatMessage = {
          _id: response.data.message._id,
          author: response.data.message.author,
          content: response.data.message.content || '',
          attachments: response.data.message.attachments || [],
          createdAt: new Date(response.data.message.createdAt),
          readBy: response.data.message.readBy || [],
          isEdited: false
        };
        
        setMessages(prev => [...prev, newMsg]);
      }
      setNewMessage('');
      setSelectedFiles([]);
      
    } catch (error: any) {
      console.error('Error sending message:', error);
      showError(`Failed to send message: ${error.message}`);
    } finally {
      setSending(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setSelectedFiles(prev => [...prev, ...files]);
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('en', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    }).format(date);
  };

  const formatDate = (date: Date) => {
    const today = new Date();
    const messageDate = new Date(date);
    
    if (messageDate.toDateString() === today.toDateString()) {
      return 'Today';
    }
    
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    if (messageDate.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    }
    
    return messageDate.toLocaleDateString();
  };

  if (!isLoggedIn()) {
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-900 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const otherParticipant = chat?.participants.find(p => p._id !== user?._id);
  const chatName = chat?.type === 'private' 
    ? `${otherParticipant?.firstName} ${otherParticipant?.lastName}`
    : chat?.name || 'Group Chat';

  return (
    <div className="min-h-screen bg-dark-900 flex flex-col">
      <Header />
      
      {/* Chat Header */}
      <div className="bg-dark-800 border-b border-dark-700 p-4 mt-16">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate(-1)}
              className="p-2 text-gray-400 hover:text-white rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            
            <div className="flex items-center space-x-3">
              {chat?.type === 'private' && otherParticipant ? (
                <img
                  src={otherParticipant.avatar ? `http://localhost:5005${otherParticipant.avatar}` : 
                    `https://ui-avatars.com/api/?name=${encodeURIComponent(otherParticipant.firstName + ' ' + otherParticipant.lastName)}&background=6366f1&color=fff&size=40`}
                  alt={chatName}
                  className="w-10 h-10 rounded-full object-cover"
                />
              ) : (
                <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-accent-purple rounded-full flex items-center justify-center">
                  <Users className="w-5 h-5 text-white" />
                </div>
              )}
              
              <div>
                <h1 className="text-white font-semibold">{chatName}</h1>
                <p className="text-gray-400 text-sm">
                  {chat?.type === 'private' ? 'Private Chat' : `${chat?.participants.length} members`}
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <button className="p-2 text-gray-400 hover:text-white rounded-lg transition-colors">
              <Phone className="w-5 h-5" />
            </button>
            <button className="p-2 text-gray-400 hover:text-white rounded-lg transition-colors">
              <Video className="w-5 h-5" />
            </button>
            <button className="p-2 text-gray-400 hover:text-white rounded-lg transition-colors">
              <MoreVertical className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-4xl mx-auto space-y-4">
          {messages.filter(message => message && message._id && message.author).map((message, index) => {
            const showDate = index === 0 ||
              formatDate(message.createdAt) !== formatDate(messages[index - 1]?.createdAt || new Date());
            const isOwn = message.author?._id === user?._id;
            
            return (
              <div key={message._id}>
                {/* Date separator */}
                {showDate && (
                  <div className="text-center my-4">
                    <span className="bg-dark-700 text-gray-400 px-3 py-1 rounded-full text-sm">
                      {formatDate(message.createdAt)}
                    </span>
                  </div>
                )}
                
                {/* Message */}
                <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-xs lg:max-w-md ${isOwn ? 'order-2' : 'order-1'}`}>
                    {!isOwn && message.author && (
                      <div className="flex items-center space-x-2 mb-1">
                        <img
                          src={message.author.avatar ? `http://localhost:5005${message.author.avatar}` :
                            `https://ui-avatars.com/api/?name=${encodeURIComponent((message.author.firstName || '') + ' ' + (message.author.lastName || ''))}&background=6366f1&color=fff&size=32`}
                          alt={`${message.author.firstName || ''} ${message.author.lastName || ''}`}
                          className="w-6 h-6 rounded-full object-cover"
                        />
                        <span className="text-gray-400 text-xs font-medium">
                          {message.author.firstName} {message.author.lastName}
                        </span>
                      </div>
                    )}
                    
                    <div className={`p-3 rounded-2xl ${
                      isOwn 
                        ? 'bg-gradient-to-r from-primary-500 to-accent-purple text-white' 
                        : 'bg-dark-700 text-gray-300'
                    }`}>
                      {message.content && (
                        <p className="leading-relaxed">{message.content}</p>
                      )}
                      
                      {/* Attachments */}
                      {message.attachments && message.attachments.length > 0 && (
                        <div className="mt-2 space-y-2">
                          {message.attachments.map((attachment, idx) => (
                            <div key={idx}>
                              {attachment.type === 'image' && (
                                <img
                                  src={attachment.url.startsWith('http') ? attachment.url : `http://localhost:5005${attachment.url}`}
                                  alt={attachment.filename || 'Image'}
                                  className="max-w-full h-32 object-cover rounded-lg cursor-pointer"
                                  onClick={() => window.open(attachment.url.startsWith('http') ? attachment.url : `http://localhost:5005${attachment.url}`, '_blank')}
                                />
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                      
                      <div className="flex items-center justify-between mt-2">
                        <span className={`text-xs ${isOwn ? 'text-gray-200' : 'text-gray-500'}`}>
                          {formatTime(message.createdAt)}
                        </span>
                        {message.isEdited && (
                          <span className={`text-xs ${isOwn ? 'text-gray-300' : 'text-gray-500'}`}>
                            edited
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
          
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Message Input */}
      <div className="bg-dark-800 border-t border-dark-700 p-4">
        <div className="max-w-4xl mx-auto">
          {/* File Preview */}
          {selectedFiles.length > 0 && (
            <div className="mb-3 p-3 bg-dark-700 rounded-lg">
              <div className="flex flex-wrap gap-2">
                {selectedFiles.map((file, index) => (
                  <div key={index} className="flex items-center space-x-2 bg-dark-600 px-3 py-2 rounded-lg">
                    <span className="text-gray-300 text-sm truncate max-w-32">{file.name}</span>
                    <button
                      onClick={() => removeFile(index)}
                      className="text-red-400 hover:text-red-300 text-lg"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          <div className="flex items-end space-x-3">
            <div className="flex-1 bg-dark-700 rounded-2xl border border-dark-600 p-3">
              <div className="flex items-end space-x-3">
                <div className="flex-1">
                  <textarea
                    ref={textareaRef}
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type a message..."
                    className="w-full bg-transparent text-white placeholder-gray-500 resize-none focus:outline-none max-h-32"
                    rows={1}
                    style={{ minHeight: '24px' }}
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
                    className="p-1.5 text-gray-400 hover:text-white rounded-lg transition-colors"
                  >
                    <Image className="w-4 h-4" />
                  </button>
                  
                  <button className="p-1.5 text-gray-400 hover:text-white rounded-lg transition-colors">
                    <Paperclip className="w-4 h-4" />
                  </button>
                  
                  <button className="p-1.5 text-gray-400 hover:text-white rounded-lg transition-colors">
                    <Smile className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
            
            <button
              onClick={handleSendMessage}
              disabled={(!newMessage.trim() && selectedFiles.length === 0) || sending}
              className={`p-3 rounded-xl transition-all ${
                (newMessage.trim() || selectedFiles.length > 0) && !sending
                  ? 'bg-gradient-to-r from-primary-500 to-accent-purple text-white hover:shadow-lg'
                  : 'bg-dark-600 text-gray-500 cursor-not-allowed'
              }`}
            >
              {sending ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <Send className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </div>

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

export default Chat;