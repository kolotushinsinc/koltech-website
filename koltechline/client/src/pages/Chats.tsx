import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MessageCircle,
  Users,
  Plus,
  Search,
  Phone,
  Video
} from 'lucide-react';
import Header from '../components/Header';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';
import { chatApi } from '../utils/api';
import Toast from '../components/ui/Toast';

interface Chat {
  _id: string;
  type: 'private' | 'group';
  name?: string;
  participants: {
    _id: string;
    firstName: string;
    lastName: string;
    avatar?: string;
  }[];
  lastMessage?: {
    content: string;
    createdAt: Date;
    author: {
      firstName: string;
      lastName: string;
    };
  };
  lastActivity: Date;
  unreadCount: number;
}

const Chats = () => {
  const navigate = useNavigate();
  const { user, isLoggedIn } = useAuth();
  const { toasts, showError, removeToast } = useToast();
  
  const [chats, setChats] = useState<Chat[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (!isLoggedIn()) {
      navigate('/auth');
      return;
    }
    loadChats();
  }, [isLoggedIn]);

  const loadChats = async () => {
    try {
      const response = await chatApi.getChats();
      const chatsData = (response.data.chats || []).map((chat: any) => ({
        ...chat,
        lastActivity: new Date(chat.lastActivity)
      }));
      setChats(chatsData);
    } catch (error) {
      console.error('Error loading chats:', error);
      showError('Failed to load chats');
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (date: Date | string) => {
    if (!date) return 'unknown';
    
    const now = new Date();
    const messageDate = new Date(date);
    
    // Check if date is valid
    if (isNaN(messageDate.getTime())) return 'unknown';
    
    const diff = now.getTime() - messageDate.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'now';
    if (minutes < 60) return `${minutes}m`;
    if (hours < 24) return `${hours}h`;
    return `${days}d`;
  };

  const getOtherParticipant = (chat: Chat) => {
    return chat.participants.find(p => p._id !== user?._id);
  };

  const getChatName = (chat: Chat) => {
    if (chat.type === 'group') {
      return chat.name || 'Group Chat';
    }
    const other = getOtherParticipant(chat);
    return other ? `${other.firstName} ${other.lastName}` : 'Private Chat';
  };

  const getChatAvatar = (chat: Chat) => {
    if (chat.type === 'group') {
      return `https://ui-avatars.com/api/?name=${encodeURIComponent(chat.name || 'Group')}&background=8b5cf6&color=fff&size=48`;
    }
    const other = getOtherParticipant(chat);
    return other?.avatar ? `http://localhost:5005${other.avatar}` :
      `https://ui-avatars.com/api/?name=${encodeURIComponent(getChatName(chat))}&background=6366f1&color=fff&size=48`;
  };

  const filteredChats = chats.filter(chat => {
    if (!searchQuery) return true;
    const name = getChatName(chat).toLowerCase();
    return name.includes(searchQuery.toLowerCase());
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-900 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-900 flex flex-col">
      <Header />
      
      <div className="flex-1 pt-16">
        <div className="max-w-6xl mx-auto p-6">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Messages</h1>
            <p className="text-gray-400">Your conversations and group chats</p>
          </div>

          {/* Search and Actions */}
          <div className="flex items-center justify-between mb-6">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search conversations..."
                className="w-full bg-dark-700 border border-dark-600 rounded-xl pl-10 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-primary-500 transition-colors"
              />
            </div>
            
            <button
              onClick={() => navigate('/contacts')}
              className="ml-4 bg-gradient-to-r from-primary-500 to-accent-purple text-white px-4 py-3 rounded-xl font-medium hover:shadow-lg transition-all flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>New Chat</span>
            </button>
          </div>

          {/* Chats List */}
          <div className="space-y-3">
            {filteredChats.length === 0 ? (
              <div className="text-center py-12">
                <MessageCircle className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <h3 className="text-gray-400 text-lg font-medium mb-2">No conversations yet</h3>
                <p className="text-gray-500 mb-6">Start chatting with your contacts</p>
                <button
                  onClick={() => navigate('/contacts')}
                  className="bg-gradient-to-r from-primary-500 to-accent-purple text-white px-6 py-3 rounded-xl font-medium hover:shadow-lg transition-all"
                >
                  Find Contacts
                </button>
              </div>
            ) : (
              filteredChats.map((chat) => (
                <div
                  key={chat._id}
                  onClick={() => navigate(`/chat/${chat._id}`)}
                  className="bg-dark-800 border border-dark-700 rounded-xl p-4 hover:border-dark-600 transition-colors cursor-pointer"
                >
                  <div className="flex items-center space-x-4">
                    {/* Avatar */}
                    <div className="relative">
                      {chat.type === 'private' ? (
                        <img
                          src={getChatAvatar(chat)}
                          alt={getChatName(chat)}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-accent-purple rounded-full flex items-center justify-center">
                          <Users className="w-6 h-6 text-white" />
                        </div>
                      )}
                      
                      {/* Unread indicator */}
                      {chat.unreadCount > 0 && (
                        <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                          {chat.unreadCount > 9 ? '9+' : chat.unreadCount}
                        </div>
                      )}
                    </div>
                    
                    {/* Chat Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="text-white font-medium truncate">
                          {getChatName(chat)}
                        </h3>
                        <span className="text-gray-500 text-sm">
                          {formatTime(chat.lastActivity)}
                        </span>
                      </div>
                      
                      {chat.lastMessage ? (
                        <p className="text-gray-400 text-sm truncate">
                          {chat.lastMessage.author.firstName}: {chat.lastMessage.content}
                        </p>
                      ) : (
                        <p className="text-gray-500 text-sm italic">No messages yet</p>
                      )}
                    </div>
                    
                    {/* Chat Type Indicator */}
                    <div className="flex items-center space-x-2">
                      {chat.type === 'group' && (
                        <div className="flex items-center space-x-1 text-gray-500">
                          <Users className="w-4 h-4" />
                          <span className="text-xs">{chat.participants.length}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
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

export default Chats;