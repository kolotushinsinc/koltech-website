import { useState } from 'react';
import { Message } from '../../types/koltech-line';
import { messageApi } from '../../utils/api';

interface UseCommentActionsProps {
  userId?: string;
  onError?: (message: string) => void;
}

export const useCommentActions = ({ userId, onError }: UseCommentActionsProps = {}) => {
  const [messageReplies, setMessageReplies] = useState<{ [key: string]: Message[] }>({});
  const [expandedReplies, setExpandedReplies] = useState<Set<string>>(new Set());
  const [loadingReplies, setLoadingReplies] = useState<Set<string>>(new Set());
  const [highlightedCommentId, setHighlightedCommentId] = useState<string | null>(null);

  // Build comment tree from flat list
  const buildCommentTree = (comments: any[], messageId: string): Message[] => {
    const commentMap = new Map<string, Message>();
    const rootComments: Message[] = [];
    
    // First pass: create all comment objects
    comments.forEach((comment: any) => {
      let userReaction: string | undefined;
      if (userId && comment.reactions && Array.isArray(comment.reactions)) {
        const reaction = comment.reactions.find((r: any) => 
          r.users && r.users.some((id: string) => id === userId)
        );
        if (reaction) {
          userReaction = reaction.emoji;
        }
      }
      
      const commentObj: Message = {
        id: comment._id,
        userId: comment.author._id,
        username: `${comment.author.firstName} ${comment.author.lastName}`,
        avatar: comment.author.avatar 
          ? `http://localhost:5005${comment.author.avatar}` 
          : `https://ui-avatars.com/api/?name=${encodeURIComponent(comment.author.firstName + ' ' + comment.author.lastName)}&background=6366f1&color=fff&size=40`,
        content: comment.content,
        timestamp: new Date(comment.createdAt),
        attachments: comment.attachments || [],
        likes: comment.likesCount || 0,
        replies: 0,
        tags: [],
        isLiked: comment.likes?.includes(userId) || false,
        isEdited: comment.isEdited || false,
        editedAt: comment.editedAt ? new Date(comment.editedAt) : undefined,
        reactions: comment.reactions ? comment.reactions.reduce((acc: any, r: any) => {
          acc[r.emoji] = { count: r.count, users: r.users };
          return acc;
        }, {}) : {},
        userReaction,
        parentComment: comment.parentMessage,
        nestedReplies: []
      };
      commentMap.set(comment._id, commentObj);
    });
    
    // Second pass: build tree structure
    commentMap.forEach((comment) => {
      const parentIsComment = commentMap.has(comment.parentComment || '');
      
      if (parentIsComment) {
        const parent = commentMap.get(comment.parentComment!);
        if (parent) {
          parent.nestedReplies = parent.nestedReplies || [];
          parent.nestedReplies.push(comment);
        }
      } else {
        rootComments.push(comment);
      }
    });
    
    return rootComments;
  };

  const toggleReplies = async (messageId: string) => {
    const isExpanded = expandedReplies.has(messageId);
    
    if (isExpanded) {
      setExpandedReplies(prev => {
        const newSet = new Set(prev);
        newSet.delete(messageId);
        return newSet;
      });
    } else {
      setExpandedReplies(prev => new Set(prev).add(messageId));
      
      if (!messageReplies[messageId]) {
        setLoadingReplies(prev => new Set(prev).add(messageId));
        
        try {
          const response = await messageApi.getComments(messageId);
          const commentTree = buildCommentTree(response.data.comments, messageId);
          
          setMessageReplies(prev => ({
            ...prev,
            [messageId]: commentTree
          }));
        } catch (error) {
          console.error('Error loading replies:', error);
          if (onError) {
            onError('Error loading replies. Please try again.');
          }
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

  const createComment = async (
    messageId: string,
    content: string,
    parentCommentId?: string,
    attachments: any[] = []
  ): Promise<Message | null> => {
    const tempId = `temp-comment-${Date.now()}`;
    
    const optimisticComment: Message = {
      id: tempId,
      userId: userId!,
      username: 'You',
      avatar: '',
      content,
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
    
    // Optimistic update
    if (parentCommentId) {
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
      setMessageReplies(prev => ({
        ...prev,
        [messageId]: [...(prev[messageId] || []), optimisticComment]
      }));
      
      if (!expandedReplies.has(messageId)) {
        setExpandedReplies(prev => new Set(prev).add(messageId));
      }
    }
    
    setHighlightedCommentId(tempId);
    setTimeout(() => setHighlightedCommentId(null), 2000);
    
    try {
      const response = await messageApi.addComment(messageId, content, parentCommentId, attachments);
      
      const realComment: Message = {
        id: response.data.comment._id,
        userId: response.data.comment.author._id,
        username: `${response.data.comment.author.firstName} ${response.data.comment.author.lastName}`,
        avatar: response.data.comment.author.avatar 
          ? `http://localhost:5005${response.data.comment.author.avatar}` 
          : '',
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
      
      // Replace temp with real
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
      
      return realComment;
    } catch (error) {
      console.error('Error creating comment:', error);
      
      // Rollback
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
        setMessageReplies(prev => ({
          ...prev,
          [messageId]: (prev[messageId] || []).filter(comment => comment.id !== tempId)
        }));
      }
      
      if (onError) {
        onError('Error posting reply. Please try again.');
      }
      
      return null;
    }
  };

  const handleCommentReaction = async (commentId: string, emoji: string, parentMessageId: string) => {
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
    
    const newReactions = { ...currentReactions };
    
    if (currentUserReaction && newReactions[currentUserReaction]) {
      newReactions[currentUserReaction] = {
        count: Math.max(0, newReactions[currentUserReaction].count - 1),
        users: newReactions[currentUserReaction].users.filter(id => id !== userId)
      };
      if (newReactions[currentUserReaction].count === 0) {
        delete newReactions[currentUserReaction];
      }
    }
    
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
    
    setMessageReplies(prev => ({
      ...prev,
      [parentMessageId]: updateCommentInTree(prev[parentMessageId] || [])
    }));
    
    try {
      const response = await messageApi.toggleCommentReaction(commentId, emoji);
      
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
      
      setMessageReplies(prev => ({
        ...prev,
        [parentMessageId]: syncCommentInTree(prev[parentMessageId] || [])
      }));
    } catch (error) {
      console.error('Error toggling comment reaction:', error);
      
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
      
      setMessageReplies(prev => ({
        ...prev,
        [parentMessageId]: rollbackCommentInTree(prev[parentMessageId] || [])
      }));
      
      if (onError) {
        onError('Failed to update reaction. Please try again.');
      }
    }
  };

  return {
    messageReplies,
    expandedReplies,
    loadingReplies,
    highlightedCommentId,
    toggleReplies,
    createComment,
    handleCommentReaction,
    buildCommentTree,
    setMessageReplies,
    setExpandedReplies,
    setHighlightedCommentId
  };
};
