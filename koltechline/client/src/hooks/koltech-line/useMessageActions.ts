import { Message, SendMessageData } from '../../types/koltech-line';
import { messageApi, fileApi } from '../../utils/api';
import { extractTagsFromContent } from '../../utils/koltech-line/wallHelpers';

interface UseMessageActionsProps {
  userId?: string;
  username?: string;
  avatar?: string;
  onSuccess?: (message: string) => void;
  onError?: (message: string) => void;
}

export const useMessageActions = ({ userId, username, avatar, onSuccess, onError }: UseMessageActionsProps = {}) => {
  
  const handleSendMessage = async (
    data: SendMessageData,
    files: File[],
    onMessageAdded: (message: Message) => void
  ): Promise<Message | null> => {
    const { content, wallId } = data;
    
    // Generate temporary ID for optimistic update
    const tempId = `temp-${Date.now()}`;
    
    // Create optimistic message with real user data
    const optimisticMessage: Message = {
      id: tempId,
      userId: userId!,
      username: username || 'You',
      avatar: avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(username || 'You')}&background=6366f1&color=fff&size=40`,
      content: content.trim(),
      timestamp: new Date(),
      attachments: [],
      likes: 0,
      replies: 0,
      tags: extractTagsFromContent(content),
      isLiked: false,
      isEdited: false
    };
    
    // Optimistic update
    onMessageAdded(optimisticMessage);
    
    try {
      // Upload files first if any
      const attachments = [];
      
      for (const file of files) {
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
          console.error('Error uploading file:', fileError);
          if (onError) {
            onError(`Error uploading ${file.name}`);
          }
        }
      }

      const messageData = {
        content: content || '',
        wallId,
        attachments,
        tags: extractTagsFromContent(content)
      };

      // Create message on server
      const response = await messageApi.createMessage(messageData);

      const realMessage: Message = {
        id: response.data.message._id,
        userId: response.data.message.author._id,
        username: `${response.data.message.author.firstName} ${response.data.message.author.lastName}`,
        avatar: response.data.message.author.avatar 
          ? `http://localhost:5005${response.data.message.author.avatar}` 
          : `https://ui-avatars.com/api/?name=${encodeURIComponent(response.data.message.author.firstName + ' ' + response.data.message.author.lastName)}&background=6366f1&color=fff&size=40`,
        content: response.data.message.content,
        timestamp: new Date(response.data.message.createdAt),
        attachments: response.data.message.attachments || attachments,
        likes: 0,
        replies: 0,
        tags: response.data.message.tags || [],
        isLiked: false,
        isEdited: false
      };
      
      return realMessage;
    } catch (error: any) {
      console.error('Error sending message:', error);
      if (onError) {
        onError(`Error sending message: ${error.message || 'Please try again.'}`);
      }
      return null;
    }
  };

  const handleEditMessage = async (
    messageId: string,
    content: string,
    onMessageUpdated: (messageId: string, updates: Partial<Message>) => void
  ): Promise<boolean> => {
    const originalContent = content;
    
    // Optimistic update
    onMessageUpdated(messageId, {
      content: content.trim(),
      isEdited: true,
      editedAt: new Date()
    });
    
    try {
      await messageApi.updateMessage(messageId, content.trim());
      if (onSuccess) {
        onSuccess('Message updated successfully');
      }
      return true;
    } catch (error) {
      console.error('Error updating message:', error);
      
      // Rollback
      onMessageUpdated(messageId, {
        content: originalContent
      });
      
      if (onError) {
        onError('Error updating message. Please try again.');
      }
      return false;
    }
  };

  const handleDeleteMessage = async (
    messageId: string,
    onMessageRemoved: (messageId: string) => void
  ): Promise<boolean> => {
    try {
      await messageApi.deleteMessage(messageId);
      onMessageRemoved(messageId);
      if (onSuccess) {
        onSuccess('Message deleted successfully');
      }
      return true;
    } catch (error) {
      console.error('Error deleting message:', error);
      if (onError) {
        onError('Error deleting message. Please try again.');
      }
      return false;
    }
  };

  const handleLike = async (
    messageId: string,
    currentMessage: Message,
    onMessageUpdated: (messageId: string, updates: Partial<Message>) => void
  ): Promise<boolean> => {
    // Optimistic update
    onMessageUpdated(messageId, {
      likes: currentMessage.isLiked ? currentMessage.likes - 1 : currentMessage.likes + 1,
      isLiked: !currentMessage.isLiked
    });
    
    try {
      const response = await messageApi.toggleLike(messageId);
      
      // Update with server response
      onMessageUpdated(messageId, {
        likes: response.data.likesCount,
        isLiked: response.data.hasLiked
      });
      
      return true;
    } catch (error) {
      console.error('Error toggling like:', error);
      
      // Revert optimistic update
      onMessageUpdated(messageId, {
        likes: currentMessage.likes,
        isLiked: currentMessage.isLiked
      });
      
      return false;
    }
  };

  const handleReaction = async (
    messageId: string,
    emoji: string,
    currentMessage: Message,
    onMessageUpdated: (messageId: string, updates: Partial<Message>) => void
  ): Promise<boolean> => {
    const currentReactions = { ...currentMessage.reactions };
    const currentUserReaction = currentMessage.userReaction;
    
    // Create new reactions state
    const newReactions = { ...currentReactions };
    
    // Remove old reaction if exists
    if (currentUserReaction && newReactions[currentUserReaction]) {
      newReactions[currentUserReaction] = {
        count: Math.max(0, newReactions[currentUserReaction].count - 1),
        users: newReactions[currentUserReaction].users.filter(id => id !== userId)
      };
      if (newReactions[currentUserReaction].count === 0) {
        delete newReactions[currentUserReaction];
      }
    }
    
    // Add new reaction if different
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
    
    // Optimistic update
    onMessageUpdated(messageId, {
      reactions: newReactions,
      userReaction: newUserReaction
    });
    
    try {
      const response = await messageApi.toggleReaction(messageId, emoji);
      
      // Sync with server
      onMessageUpdated(messageId, {
        reactions: response.data.reactions.reduce((acc: any, r: any) => {
          acc[r.emoji] = { count: r.count, users: r.users };
          return acc;
        }, {}),
        userReaction: response.data.userReaction
      });
      
      return true;
    } catch (error) {
      console.error('Error toggling reaction:', error);
      
      // Rollback
      onMessageUpdated(messageId, {
        reactions: currentReactions,
        userReaction: currentUserReaction
      });
      
      if (onError) {
        onError('Failed to update reaction. Please try again.');
      }
      
      return false;
    }
  };

  const handleReport = async (messageId: string, reason: string): Promise<boolean> => {
    try {
      await messageApi.reportMessage(messageId, reason);
      if (onSuccess) {
        onSuccess('Content reported successfully. Thank you for helping keep our community safe.');
      }
      return true;
    } catch (error) {
      console.error('Error reporting message:', error);
      if (onError) {
        onError('Error reporting content. Please try again.');
      }
      return false;
    }
  };

  return {
    handleSendMessage,
    handleEditMessage,
    handleDeleteMessage,
    handleLike,
    handleReaction,
    handleReport
  };
};
