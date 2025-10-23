import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useCallback, useEffect } from 'react';
import { messageApi } from '../utils/api';
import { useSocket } from './useSocket';

interface Comment {
  id: string;
  userId: string;
  username: string;
  avatar: string;
  content: string;
  timestamp: Date;
  isEdited?: boolean;
  editedAt?: Date;
  reactions?: {
    [emoji: string]: {
      count: number;
      users: string[];
    };
  };
  userReaction?: string;
  nestedReplies?: Comment[];
  parentMessage?: string;
}

interface UseCommentsOptions {
  messageId: string;
  enabled?: boolean;
}

interface UseCommentsReturn {
  comments: Comment[];
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  refetch: () => void;
  addComment: (content: string, parentCommentId?: string) => Promise<void>;
  updateComment: (commentId: string, content: string) => Promise<void>;
  deleteComment: (commentId: string) => Promise<void>;
  toggleReaction: (commentId: string, emoji: string) => Promise<void>;
}

export const useComments = ({ messageId, enabled = true }: UseCommentsOptions): UseCommentsReturn => {
  const queryClient = useQueryClient();
  const { socket, subscribeToEvents } = useSocket();

  // Query key for this message's comments
  const queryKey = ['comments', messageId];

  // Fetch comments
  const {
    data: comments = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery<Comment[]>({
    queryKey,
    queryFn: async () => {
      const response = await messageApi.getComments(messageId);
      return response.data.comments || [];
    },
    enabled: enabled && !!messageId,
    staleTime: 0, // Always fetch fresh data for real-time
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });

  // Build nested structure from flat list
  const buildNestedComments = useCallback((flatComments: Comment[]): Comment[] => {
    const commentsMap = new Map<string, Comment>();
    const rootComments: Comment[] = [];

    // First pass: create map
    flatComments.forEach((comment) => {
      commentsMap.set(comment.id, { ...comment, nestedReplies: [] });
    });

    // Second pass: build tree
    commentsMap.forEach((comment) => {
      if (comment.parentMessage === messageId) {
        // Top-level comment
        rootComments.push(comment);
      } else if (comment.parentMessage && commentsMap.has(comment.parentMessage)) {
        // Nested reply
        const parent = commentsMap.get(comment.parentMessage)!;
        if (!parent.nestedReplies) {
          parent.nestedReplies = [];
        }
        parent.nestedReplies.push(comment);
      }
    });

    return rootComments;
  }, [messageId]);

  // Add comment mutation
  const addCommentMutation = useMutation({
    mutationFn: async ({ content, parentCommentId }: { content: string; parentCommentId?: string }) => {
      const response = await messageApi.addComment(messageId, content, parentCommentId);
      return response.data.comment;
    },
    onSuccess: async () => {
      // Immediately refetch to get fresh data from server
      await queryClient.invalidateQueries({ queryKey });
      await refetch();
      // Also invalidate message queries to update comment count
      await queryClient.invalidateQueries({ queryKey: ['messages'] });
    },
  });

  // Update comment mutation
  const updateCommentMutation = useMutation({
    mutationFn: async ({ commentId, content }: { commentId: string; content: string }) => {
      const response = await messageApi.updateComment(commentId, content);
      return response.data.comment;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey });
      await refetch();
    },
  });

  // Delete comment mutation
  const deleteCommentMutation = useMutation({
    mutationFn: async (commentId: string) => {
      await messageApi.deleteComment(commentId);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey });
      await refetch();
      // Also invalidate message queries to update comment count
      await queryClient.invalidateQueries({ queryKey: ['messages'] });
    },
  });

  // Toggle reaction mutation
  const toggleReactionMutation = useMutation({
    mutationFn: async ({ commentId, emoji }: { commentId: string; emoji: string }) => {
      const response = await messageApi.toggleCommentReaction(commentId, emoji);
      return response.data;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey });
      await refetch();
    },
  });

  // Subscribe to real-time updates
  useEffect(() => {
    if (!socket || !messageId) return;

    const handleNewComment = (data: any) => {
      // Check if this comment belongs to our message thread
      if (data.parentMessageId === messageId || data.comment?.parentMessage === messageId) {
        console.log('📨 New comment received:', data);
        // Immediately refetch to get fresh data
        queryClient.invalidateQueries({ queryKey });
        queryClient.invalidateQueries({ queryKey: ['messages'] });
        refetch();
      }
    };

    const handleNestedReplyAdded = (data: any) => {
      // Handle nested reply specifically
      if (data.parentMessageId === messageId) {
        console.log('📨 Nested reply added:', data);
        // Immediately refetch to get fresh data
        queryClient.invalidateQueries({ queryKey });
        queryClient.invalidateQueries({ queryKey: ['messages'] });
        refetch();
      }
    };

    const handleCommentUpdated = (data: any) => {
      // Update comment in cache
      if (data.parentMessageId === messageId) {
        console.log('✏️ Comment updated:', data);
        queryClient.setQueryData<Comment[]>(queryKey, (old = []) =>
          old.map((comment) =>
            comment.id === data.commentId
              ? { ...comment, content: data.content, isEdited: data.isEdited, editedAt: data.editedAt }
              : comment
          )
        );
      }
    };

    const handleCommentDeleted = (data: any) => {
      // Remove comment from cache
      if (data.parentMessageId === messageId) {
        console.log('🗑️ Comment deleted:', data);
        queryClient.setQueryData<Comment[]>(queryKey, (old = []) =>
          old.filter((comment) => comment.id !== data.commentId)
        );
        // Update message count
        queryClient.invalidateQueries({ queryKey: ['messages'] });
      }
    };

    const handleCommentReaction = (data: any) => {
      // Update reactions in cache
      if (data.parentMessageId === messageId) {
        console.log('❤️ Comment reaction updated:', data);
        queryClient.setQueryData<Comment[]>(queryKey, (old = []) =>
          old.map((comment) =>
            comment.id === data.commentId
              ? { ...comment, reactions: data.reactions, userReaction: data.userReaction }
              : comment
          )
        );
      }
    };

    // Subscribe to events
    subscribeToEvents({
      onMessageReceived: (data) => {
        if (data.type === 'new_comment') {
          handleNewComment(data);
        }
      },
    });

    // Listen to specific comment events
    socket.on('new_comment', handleNewComment);
    socket.on('nested_reply_added', handleNestedReplyAdded);
    socket.on('comment_updated', handleCommentUpdated);
    socket.on('comment_deleted', handleCommentDeleted);
    socket.on('comment_reaction_updated', handleCommentReaction);

    return () => {
      socket.off('new_comment', handleNewComment);
      socket.off('nested_reply_added', handleNestedReplyAdded);
      socket.off('comment_updated', handleCommentUpdated);
      socket.off('comment_deleted', handleCommentDeleted);
      socket.off('comment_reaction_updated', handleCommentReaction);
    };
  }, [socket, messageId, queryClient, queryKey, subscribeToEvents]);

  return {
    comments: buildNestedComments(comments),
    isLoading,
    isError,
    error: error as Error | null,
    refetch,
    addComment: (content: string, parentCommentId?: string) =>
      addCommentMutation.mutateAsync({ content, parentCommentId }),
    updateComment: (commentId: string, content: string) =>
      updateCommentMutation.mutateAsync({ commentId, content }),
    deleteComment: (commentId: string) => deleteCommentMutation.mutateAsync(commentId),
    toggleReaction: (commentId: string, emoji: string) =>
      toggleReactionMutation.mutateAsync({ commentId, emoji }),
  };
};
