import { useState, useEffect } from 'react';
import { Message } from '../../types/koltech-line';
import { messageApi } from '../../utils/api';

interface UseMessagesProps {
  wallId: string;
  userId?: string;
}

export const useMessages = ({ wallId, userId }: UseMessagesProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMoreMessages, setHasMoreMessages] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  const loadMessages = async (page = 1, reset = true) => {
    if (!wallId) return;
    
    if (reset) {
      setLoading(true);
      setCurrentPage(1);
      setHasMoreMessages(true);
    } else {
      setLoadingMore(true);
    }
    
    try {
      const response = await messageApi.getWallMessages(wallId, {
        limit: 20,
        page
      });
      
      const messagesData = response.data.messages.map((msg: any) => {
        // Convert reactions array to object format
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
        if (userId && msg.reactions) {
          const reaction = msg.reactions.find((r: any) => 
            r.users.some((id: string) => id === userId)
          );
          if (reaction) {
            userReaction = reaction.emoji;
          }
        }
        
        return {
          id: msg._id,
          userId: msg.author._id,
          username: `${msg.author.firstName} ${msg.author.lastName}`,
          avatar: msg.author.avatar 
            ? `http://localhost:5005${msg.author.avatar}` 
            : `https://ui-avatars.com/api/?name=${encodeURIComponent(msg.author.firstName + ' ' + msg.author.lastName)}&background=6366f1&color=fff&size=40`,
          content: msg.content,
          timestamp: new Date(msg.createdAt),
          attachments: msg.attachments || [],
          likes: msg.likesCount,
          replies: msg.repliesCount,
          tags: msg.tags || [],
          isLiked: msg.likes?.includes(userId) || false,
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

  const addMessage = (message: Message) => {
    setMessages(prev => [message, ...prev]);
  };

  const updateMessage = (messageId: string, updates: Partial<Message>) => {
    setMessages(prev => prev.map(msg =>
      msg.id === messageId ? { ...msg, ...updates } : msg
    ));
  };

  const removeMessage = (messageId: string) => {
    setMessages(prev => prev.filter(msg => msg.id !== messageId));
  };

  useEffect(() => {
    if (wallId) {
      loadMessages(1, true);
    } else {
      setMessages([]);
      setLoading(false);
    }
  }, [wallId]);

  return {
    messages,
    loading,
    loadingMore,
    hasMoreMessages,
    currentPage,
    loadMessages,
    loadMoreMessages,
    addMessage,
    updateMessage,
    removeMessage,
    setMessages
  };
};
