import React, { useState, useEffect } from 'react';
import { X, Copy, MessageCircle, Repeat, Users, Send, Check } from 'lucide-react';
import { motion } from 'framer-motion';
import { contactApi, chatApi, postsAPI } from '../../utils/api';
import { useAuthStore } from '../../store/authStore';
import toast from 'react-hot-toast';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  postId: string;
  postType: 'social_post' | 'wall_message';
  postContent: {
    author: {
      firstName: string;
      lastName: string;
      avatar?: string;
    };
    content?: string;
    images?: string[];
    type?: string;
  };
}

interface Contact {
  _id: string;
  firstName: string;
  lastName: string;
  username?: string;
  avatar?: string;
}

interface Chat {
  _id: string;
  name?: string;
  participants: {
    _id: string;
    firstName: string;
    lastName: string;
    avatar?: string;
  }[];
  type: 'private' | 'group';
}

const ShareModal: React.FC<ShareModalProps> = ({
  isOpen,
  onClose,
  postId,
  postType,
  postContent
}) => {
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState<'link' | 'contacts' | 'chats' | 'repost'>('link');
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [chats, setChats] = useState<Chat[]>([]);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [selectedContacts, setSelectedContacts] = useState<string[]>([]);
  const [selectedChats, setSelectedChats] = useState<string[]>([]);
  const [sharing, setSharing] = useState(false);
  const [reposting, setReposting] = useState(false);

  useEffect(() => {
    if (isOpen && (activeTab === 'contacts' || activeTab === 'chats')) {
      fetchContactsAndChats();
    }
  }, [isOpen, activeTab]);

  const fetchContactsAndChats = async () => {
    setLoading(true);
    try {
      const [contactsResponse, chatsResponse] = await Promise.all([
        contactApi.getContacts('accepted'),
        chatApi.getChats()
      ]);

      if (contactsResponse.success) {
        setContacts(contactsResponse.data.contacts || []);
      }

      if (chatsResponse.success) {
        setChats(chatsResponse.data.chats || []);
      }
    } catch (error) {
      console.error('Failed to fetch contacts and chats:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateShareLink = () => {
    const baseUrl = window.location.origin;
    if (postType === 'social_post') {
      return `${baseUrl}/post/${postId}`;
    } else {
      return `${baseUrl}/message/${postId}`;
    }
  };

  const handleCopyLink = async () => {
    try {
      const shareLink = generateShareLink();
      await navigator.clipboard.writeText(shareLink);
      setCopied(true);
      toast.success('Link copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error('Failed to copy link');
    }
  };

  const handleShareToContacts = async () => {
    if (selectedContacts.length === 0) {
      toast.error('Please select at least one contact');
      return;
    }

    setSharing(true);
    try {
      const shareLink = generateShareLink();
      const message = `Check out this ${postType === 'social_post' ? 'post' : 'message'} from ${postContent.author.firstName} ${postContent.author.lastName}: ${shareLink}`;

      // Create private chats and send messages
      for (const contactId of selectedContacts) {
        const chatResponse = await chatApi.createPrivateChat(contactId);
        if (chatResponse.success) {
          await chatApi.sendMessage(chatResponse.data.chat._id, message);
        }
      }

      toast.success(`Shared with ${selectedContacts.length} contact(s)!`);
      onClose();
    } catch (error: any) {
      toast.error('Failed to share with contacts');
    } finally {
      setSharing(false);
    }
  };

  const handleShareToChats = async () => {
    if (selectedChats.length === 0) {
      toast.error('Please select at least one chat');
      return;
    }

    setSharing(true);
    try {
      const shareLink = generateShareLink();
      const message = `Check out this ${postType === 'social_post' ? 'post' : 'message'} from ${postContent.author.firstName} ${postContent.author.lastName}: ${shareLink}`;

      // Send to selected chats
      for (const chatId of selectedChats) {
        await chatApi.sendMessage(chatId, message);
      }

      toast.success(`Shared to ${selectedChats.length} chat(s)!`);
      onClose();
    } catch (error: any) {
      toast.error('Failed to share to chats');
    } finally {
      setSharing(false);
    }
  };

  const handleRepost = async () => {
    setReposting(true);
    try {
      // Create a repost (this would need to be implemented in the backend)
      const repostData = {
        content: `Shared a ${postType === 'social_post' ? 'post' : 'message'} from ${postContent.author.firstName} ${postContent.author.lastName}`,
        type: 'repost',
        metadata: {
          originalPostId: postId,
          originalAuthor: postContent.author,
          originalContent: postContent.content
        }
      };

      const response = await postsAPI.createPost(repostData);
      
      if (response.success) {
        toast.success('Reposted to your profile!');
        onClose();
      }
    } catch (error: any) {
      toast.error('Failed to repost');
    } finally {
      setReposting(false);
    }
  };

  const toggleContactSelection = (contactId: string) => {
    setSelectedContacts(prev =>
      prev.includes(contactId)
        ? prev.filter(id => id !== contactId)
        : [...prev, contactId]
    );
  };

  const toggleChatSelection = (chatId: string) => {
    setSelectedChats(prev =>
      prev.includes(chatId)
        ? prev.filter(id => id !== chatId)
        : [...prev, chatId]
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        className="bg-dark-800 rounded-2xl w-full max-w-md shadow-xl border border-dark-700"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-dark-700">
          <h2 className="text-xl font-bold text-white">Share Post</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-dark-700">
          {[
            { id: 'link', label: 'Copy Link', icon: Copy },
            { id: 'contacts', label: 'Contacts', icon: Users },
            { id: 'chats', label: 'Chats', icon: MessageCircle },
            { id: 'repost', label: 'Repost', icon: Repeat }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'text-primary-400 border-b-2 border-primary-400'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Preview */}
          <div className="bg-dark-700/50 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-3 mb-3">
              <img
                src={postContent.author.avatar ?
                  `${import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5005'}${postContent.author.avatar}` :
                  `https://ui-avatars.com/api/?name=${postContent.author.firstName}+${postContent.author.lastName}&background=6366f1&color=ffffff&size=32`
                }
                alt={`${postContent.author.firstName} ${postContent.author.lastName}`}
                className="w-8 h-8 rounded-full object-cover"
              />
              <span className="text-white text-sm font-medium">
                {postContent.author.firstName} {postContent.author.lastName}
              </span>
            </div>
            {postContent.content && (
              <p className="text-gray-300 text-sm line-clamp-3">{postContent.content}</p>
            )}
            {postContent.images && postContent.images.length > 0 && (
              <div className="mt-2 flex gap-1">
                {postContent.images.slice(0, 3).map((image, index) => (
                  <img
                    key={index}
                    src={`${import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5005'}${image}`}
                    className="w-12 h-12 object-cover rounded"
                  />
                ))}
                {postContent.images.length > 3 && (
                  <div className="w-12 h-12 bg-dark-600 rounded flex items-center justify-center text-gray-400 text-xs">
                    +{postContent.images.length - 3}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Tab Content */}
          {activeTab === 'link' && (
            <div className="space-y-4">
              <p className="text-gray-400 text-sm">Copy the link to share this post anywhere</p>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={generateShareLink()}
                  readOnly
                  className="flex-1 input-primary text-sm"
                />
                <button
                  onClick={handleCopyLink}
                  className={`px-4 py-2 rounded-lg transition-all flex items-center gap-2 ${
                    copied 
                      ? 'bg-green-500 text-white' 
                      : 'bg-primary-500 hover:bg-primary-600 text-white'
                  }`}
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  {copied ? 'Copied' : 'Copy'}
                </button>
              </div>
            </div>
          )}

          {activeTab === 'contacts' && (
            <div className="space-y-4">
              <p className="text-gray-400 text-sm">Share with your contacts</p>
              {loading ? (
                <div className="space-y-3">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 animate-pulse">
                      <div className="w-10 h-10 bg-dark-600 rounded-full"></div>
                      <div className="h-4 bg-dark-600 rounded w-32"></div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="max-h-60 overflow-y-auto space-y-2">
                  {contacts.map(contact => (
                    <div
                      key={contact._id}
                      onClick={() => toggleContactSelection(contact._id)}
                      className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
                        selectedContacts.includes(contact._id)
                          ? 'bg-primary-500/20 border border-primary-500/50'
                          : 'hover:bg-dark-600'
                      }`}
                    >
                      <img
                        src={contact.avatar ?
                          `${import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5005'}${contact.avatar}` :
                          `https://ui-avatars.com/api/?name=${contact.firstName}+${contact.lastName}&background=6366f1&color=ffffff&size=40`
                        }
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div className="flex-1">
                        <p className="text-white font-medium">{contact.firstName} {contact.lastName}</p>
                        {contact.username && (
                          <p className="text-gray-400 text-sm">@{contact.username}</p>
                        )}
                      </div>
                      {selectedContacts.includes(contact._id) && (
                        <Check className="w-5 h-5 text-primary-400" />
                      )}
                    </div>
                  ))}
                </div>
              )}
              {selectedContacts.length > 0 && (
                <button
                  onClick={handleShareToContacts}
                  disabled={sharing}
                  className="w-full btn-primary"
                >
                  {sharing ? 'Sharing...' : `Share to ${selectedContacts.length} contact(s)`}
                </button>
              )}
            </div>
          )}

          {activeTab === 'chats' && (
            <div className="space-y-4">
              <p className="text-gray-400 text-sm">Share in your chats</p>
              {loading ? (
                <div className="space-y-3">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 animate-pulse">
                      <div className="w-10 h-10 bg-dark-600 rounded-full"></div>
                      <div className="h-4 bg-dark-600 rounded w-32"></div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="max-h-60 overflow-y-auto space-y-2">
                  {chats.map(chat => (
                    <div
                      key={chat._id}
                      onClick={() => toggleChatSelection(chat._id)}
                      className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
                        selectedChats.includes(chat._id)
                          ? 'bg-primary-500/20 border border-primary-500/50'
                          : 'hover:bg-dark-600'
                      }`}
                    >
                      <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-accent-purple rounded-full flex items-center justify-center">
                        <MessageCircle className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <p className="text-white font-medium">
                          {chat.type === 'group' ? chat.name : 
                            chat.participants.find(p => p._id !== user?._id)?.firstName + ' ' +
                            chat.participants.find(p => p._id !== user?._id)?.lastName
                          }
                        </p>
                        <p className="text-gray-400 text-sm">
                          {chat.type === 'group' ? `${chat.participants.length} members` : 'Private chat'}
                        </p>
                      </div>
                      {selectedChats.includes(chat._id) && (
                        <Check className="w-5 h-5 text-primary-400" />
                      )}
                    </div>
                  ))}
                </div>
              )}
              {selectedChats.length > 0 && (
                <button
                  onClick={handleShareToChats}
                  disabled={sharing}
                  className="w-full btn-primary"
                >
                  {sharing ? 'Sharing...' : `Share to ${selectedChats.length} chat(s)`}
                </button>
              )}
            </div>
          )}

          {activeTab === 'repost' && (
            <div className="space-y-4">
              <p className="text-gray-400 text-sm">Repost to your profile</p>
              
              <div className="bg-dark-700/50 border border-dark-600 rounded-lg p-4">
                <div className="flex items-center gap-3 mb-3">
                  <img
                    src={user?.avatar ?
                      `${import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5005'}${user.avatar}` :
                      `https://ui-avatars.com/api/?name=${user?.firstName}+${user?.lastName}&background=6366f1&color=ffffff&size=32`
                    }
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <span className="text-white text-sm font-medium">
                    {user?.firstName} {user?.lastName}
                  </span>
                  <span className="text-gray-400 text-xs">• reposted</span>
                </div>
                
                <div className="ml-11 border-l-2 border-dark-600 pl-4">
                  <div className="flex items-center gap-2 mb-2">
                    <img
                      src={postContent.author.avatar ?
                        `${import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5005'}${postContent.author.avatar}` :
                        `https://ui-avatars.com/api/?name=${postContent.author.firstName}+${postContent.author.lastName}&background=6366f1&color=ffffff&size=24`
                      }
                      className="w-6 h-6 rounded-full object-cover"
                    />
                    <span className="text-gray-300 text-sm">
                      {postContent.author.firstName} {postContent.author.lastName}
                    </span>
                  </div>
                  {postContent.content && (
                    <p className="text-gray-400 text-sm line-clamp-3">{postContent.content}</p>
                  )}
                </div>
              </div>

              <button
                onClick={handleRepost}
                disabled={reposting}
                className="w-full btn-primary"
              >
                {reposting ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Reposting...
                  </div>
                ) : (
                  <>
                    <Repeat className="w-4 h-4 mr-2" />
                    Repost to Profile
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default ShareModal;