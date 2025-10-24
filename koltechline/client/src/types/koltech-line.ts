export interface Message {
  id: string;
  userId: string;
  username: string;
  avatar: string;
  content: string;
  timestamp: Date;
  attachments?: {
    type: 'image' | 'video' | 'gif' | 'sticker' | 'file';
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
  userReaction?: string;
  parentComment?: string;
  nestedReplies?: Message[];
}

export interface Wall {
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

export interface FilePreview {
  file: File;
  preview: string;
  type: 'image' | 'video';
}

export interface Category {
  id: string;
  name: string;
}

export interface ParticipantRange {
  id: string;
  name: string;
}

export interface SendMessageData {
  content: string;
  wallId: string;
  attachments: any[];
  tags: string[];
}

export interface ReplyToData {
  messageId: string;
  username: string;
  content: string;
}

export interface ReplyToCommentData {
  commentId: string;
  username: string;
  parentMessageId: string;
}

export interface EditingMessageData {
  id: string;
  content: string;
}

export interface EditingCommentData {
  id: string;
  content: string;
}

export interface ImageGalleryModalData {
  isOpen: boolean;
  images: { url: string; filename?: string; type: 'image' | 'video' }[];
  initialIndex: number;
  author: { username: string; avatar: string };
}
